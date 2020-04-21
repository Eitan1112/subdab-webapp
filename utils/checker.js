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
     *      subsElement (Element): The subtitles file input element.
     *      videoElement (Element): The video file input element.
     *      worker (Worker): The ffmpeg worker.
     *      sp (SubtitleParser): The subtitle parser object. (Only loads after prepare is called).
     *      filename (String): The video filename. (Only loads after prepare is called).
     *      setProgress (function): Function to set the progress.
     *      setMessage (function): Function to set message for the client.
     *      setError (function): Function to set error for the client.
     */

    constructor(setProgress, setMessage, setError) {
        /**
         * Constructor for Readers class.
         * 
         * Params:
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
        const worker = createWorker({
            logger: ({ message }) => console.log(message),
        });
        this.setMessage('Loading video editor...')
        await worker.load();
        this.setProgress(15)
        const extension = this.videoFile.name.split('.')[1]
        this.filename = `video.${extension}`;
        this.setMessage('Transcoding file...')
        await worker.write(this.filename, this.videoFile);
        this.setProgress(17)
        this.worker = worker
    }

    async set_download(element) {
        /**
         * Sets the download file element with downloading the new subtitles
         */

        const new_filename = this.filename.split('.')[0] + '.srt'
        this.sp.set_download(element, new_filename, delay)

    }

    async syncSubtitles(skip_sync) {
        /**
         * The main entry point which checks the sync of video and subtitles, and if they
         * are not synced -> checks delay and downloads new subtitles file.
         * 
         * Params:
         *      skip_sync (bool): If to skip the sync check (jump to delay check)
         */

        var t0 = performance.now();
        console.log('Preparing...')
        await this.prepare()
        console.log('Finished preparing...')
        if (!skip_sync) {
            const json_res = await this.checkSync()
            if (json_res.hasOwnProperty('error')) {
                console.log(`Error: ${json_res.error}`)
                return
            }
            if (json_res.hasOwnProperty('is_synced') && !json_res.is_synced) {
                console.log('Checking delay')
                let start = json_res.send_timestamp.start
                let end = json_res.send_timestamp.end
                const delay = await this.checkDelay(start, end)
                var t1 = performance.now();
                console.log("Call to sync took " + (t1 - t0) + " milliseconds.");
            } else if (json_res.hasOwnProperty('is_synced') && json_res.is_synced) {
                console.log('Synced!')
            } else {
                console.log(`Misformed response. ${json_res}`)
            }
        } else {
            let start = 0
            let end = Constants.DEFAULT_SECTION_LENGTH
            const delay = await this.checkDelay(start, end)
            const new_filename = this.filename.split('.')[0] + '.srt'
            this.sp.download_subtitles(new_filename, delay)
            var t1 = performance.now();
            console.log("Call to sync took " + (t1 - t0) + " milliseconds.");
        }
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
            extension: this.filename.split('.')[1]
        })
        const check_sync_url = Constants.SERVER + Constants.CHECK_SYNC_ROUTE
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

        const buffer = await this.trimVideo(start, end)
        const base64str = Helpers.arrayBufferToBase64(buffer)
        const check_delay_url = Constants.SERVER + Constants.CHECK_DELAY_ROUTE
        const check_delay_body = JSON.stringify({
            base64str,
            timestamp: { start, end },
            subtitles: this.sp.subtitles,
            extension: this.filename.split('.')[1]
        })
        const request_content = {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: check_delay_body
        }
        this.setMessage('Checking delay...')
        const res = await fetch(check_delay_url, request_content)
        if(res.status !== 200) {
            return this.setError('Error occured - unable to find delay.')
        }

        const json_res = await res.json()
        if (json_res.hasOwnProperty('delay')) {
            return json_res.delay
        } else {
            const new_start = start + Constants.DEFAULT_SECTION_LENGTH
            const new_end = end+ Constants.DEFAULT_SECTION_LENGTH
            return this.checkDelay(start, end)
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

        const trimed_filename = "trimed." + this.filename.split(".")[1]; // trimed.extension
        await this.worker.trim(this.filename, trimed_filename, start, end, "-c copy -y");
        const { data } = await this.worker.read(trimed_filename);
        await this.worker.remove(trimed_filename);
        return data.buffer;
    }
}

export default Checker;