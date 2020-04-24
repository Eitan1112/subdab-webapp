import { createWorker } from "@ffmpeg/ffmpeg";
import *  as Helpers from './helpers'
import * as Constants from '../constants'
import SubtitlesParser from './subtitleParser'

class Checker {
    /**
     * Class for reading files and making actions on these data.
     *
     * 
     * Attributes:
     *      server (String): The API server.
     *      subsElement (Element): The subtitles file input element.
     *      videoElement (Element): The video file input element.
     *      worker (Worker): The ffmpeg worker.
     *      sp (SubtitleParser): The subtitle parser object. (Only loads after prepare is called).
     *      filename (String): The video filename. (Only loads after prepare is called).
     *      setProgress (function): Function to set the progress.
     *      setMessage (function): Function to set message for the client.
     *      setError (function): Function to set error for the client.
     */

    constructor(server, setProgress, setMessage, setError) {
        /**
         * Constructor for Readers class.
         * 
         * Params:
         *      server (String): The API server.
         *      setProgress (function): Function to set the progress.
         *      setMessage (function): Function to set message for the client.
         *      setError (function): Function to set error for the client.
         */

        this.subsFile = (Array.from(document.querySelector('input[type="file"]').files).filter((file) => file.type.split('/')[0] !== 'video'))[0];
        this.videoFile = (Array.from(document.querySelector('input[type="file"]').files).filter((file) => file.type.split('/')[0] === 'video'))[0];
        this.sp = undefined
        this.filename = undefined
        this.setProgress = setProgress
        this.setMessage = setMessage
        this.setError = setError
        this.server = server
    }

    async prepare() {
        /**
         * Prepares the Checker instance for checking delay or sync by loading the ffmpeg-core,
         * reading the binary file and writing it to the file system, and reading and parsing the subtitles.
         * 
         * Params:
         *      setProgress (function): Function to set the progress.
         * 
         */

        const subtitles = await Helpers.readSubtitlesAsync(this.subsFile)
        this.sp = new SubtitlesParser(subtitles)
        this.setProgress(3)
        const worker = createWorker();
        this.setProgress(5)
        this.setMessage('Loading video editor...')
        await worker.load();
        this.setProgress(15)
        this.extension = this.videoFile.name.split('.').slice(-1)[0]
        this.filename = `video.${this.extension}`
        this.setMessage('Writing file for editing...')
        await worker.write(this.filename, this.videoFile);
        this.setProgress(18)
        this.worker = worker
    }

    async set_download(element) {
        /**
         * Sets the download file element with downloading the new subtitles
         */

        const new_filename = this.filename.split('.')[0] + '.srt'
        this.sp.set_download(element, new_filename, delay)

    }

    async checkSync() {
        /**
         * Checks whether the subtitles and video file are synced by sending buffers and subtitles to the
         * server for comparison.
         * 
         * Returns:
         *      json_res (JSON): The response to the check_sync request in JSON format.
         */

        const valid_subtitles_timestamps = this.sp.get_valid_subtitles_timestamps()
        const data = await this.getBuffersAndTimestamps(valid_subtitles_timestamps)
        const json_data = JSON.stringify({
            data,
            extension: this.extension
        })
        const check_sync_url = this.server + Constants.CHECK_SYNC_ROUTE
        const request_content = {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: json_data
        }
        this.setMessage('Checking if synced...')
        const res = await fetch(check_sync_url, request_content)
        this.setProgress(50)
        const json_res = await res.json()
        return json_res.is_synced
    }

    async checkDelay(start = 0, end = Constants.DEFAULT_SECTION_LENGTH) {
        /**
         * Checks the delay of the subtitles compared to the video.
         * 
         * Params:
         *      start (int): The start time to trim the video. (Sent by server)
         *      end (int): The end time to trim the video. (Sent by server)
         * 
         * Returns:
         *      delay (float): The delay.
         */

        let delay = undefined
        const iteration = start / Constants.DEFAULT_SECTION_LENGTH

        // Progres: First iteration: 50, Second: 70, Third: 80, Fourth: 85, Fifth: 87.5 etc.
        let progress = 50 + Math.floor([...Array(iteration).keys()].map((num) => 20 / Math.pow(2, num)).reduce((a, b) => a + b, 0))
        const step = (20 / Math.pow(2, iteration))

        const buffer = await this.trimVideo(start, end)
        const base64str = Helpers.arrayBufferToBase64(buffer)
        this.setProgress(Math.floor(progress + (step / 3)))
        const check_delay_url = this.SERVER + Constants.CHECK_DELAY_ROUTE
        const check_delay_body = JSON.stringify({
            base64str,
            timestamp: { start, end },
            subtitles: this.sp.subtitles,
            extension: this.extension
        })
        const request_content = {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: check_delay_body
        }
        this.setMessage('Checking delay...')
        const res = await fetch(check_delay_url, request_content)
        if (res.status !== 200) {
            return this.setError('Error occured - unable to find delay.')
        }

        const json_res = await res.json()
        if (json_res.hasOwnProperty('delay')) {
            return json_res.delay
        } else {
            const new_start = start + Constants.DEFAULT_SECTION_LENGTH
            const new_end = end + Constants.DEFAULT_SECTION_LENGTH
            this.setProgress(Math.floor(progress + step))
            return this.checkDelay(new_start, new_end)
        }
    }


    async getBuffersAndTimestamps(subtitles_timestamps) {
        /**
         * Gets the buffers of the timestamps and formats the return to fit the API.
         *
         * Params:
         *    subtitles_timestamps (Array of Arrays): [[subtitles, start, end], [subtitles, start, end]...]
         *
         * Returns:
         *    Array of Arrays: [[buffer, subtitles], [buffer, subtitles]...]
         */

        let data = [];

        this.setMessage('Trimming video...')
        let i = 1
        for (const [subtitles, start, end] of subtitles_timestamps) {
            const buffer = await this.trimVideo(start, end);
            data.push([Helpers.arrayBufferToBase64(buffer), subtitles]);
            this.setProgress(17 + i)
            i++
        }
        return data;
    }

    async trimVideo(start, end) {
        /**
         * Trims a video and returns the buffer.
         *
         * Params:
         *      start (double): Start time in seconds.
         *      end (double): End time in seconds.
         *
         * Returns:
         *       string: The buffer of the file.
         */

        const trimed_filename = "trimed." + this.extension; // trimed.extension
        await this.worker.trim(this.filename, trimed_filename, start, end, "-c copy -y");
        const { data } = await this.worker.read(trimed_filename);
        await this.worker.remove(trimed_filename);
        return data.buffer;
    }

    async setUrl() {
        /**
         * Sets and returns URL for the video.
         * 
         * Returns:
         *      String: The url
         */

        const { data } = await this.worker.read(this.filename)
        const url = URL.createObjectURL(new Blob([data.buffer], { type: `video/${this.extension}` }));
        return url
    }
}

export default Checker;