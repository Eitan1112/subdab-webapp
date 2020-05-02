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
     *      subsFile (Element): The subtitles file input element.
     *      videoFile (Element): The video file input element.
     *      worker (Worker): The ffmpeg worker.
     *      sp (SubtitleParser): The subtitle parser object. (Only loads after prepare is called).
     *      filename (String): The video filename. (Only loads after prepare is called).
     *      setProgress (function): Function to set the progress.
     *      setMessage (function): Function to set message for the client.
     *      setError (function): Function to set error for the client.
     *      delaysFound (Array of objects): Array containing delays found (used if user decided the subtitles are not synced)
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

        this.subsFile = document.getElementById('subtitles-file').files[0]
        this.videoFile = document.getElementById('video-file').files[0]
        this.sp = undefined
        this.filename = undefined
        this.setProgress = setProgress
        this.setMessage = setMessage
        this.setError = setError
        this.server = server
        this.delaysFound = []
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
        this.setProgress(5)
        const worker = createWorker();
        this.setProgress(8)
        this.setMessage('Loading video editor...')
        await worker.load();
        this.setProgress(20)
        this.extension = this.videoFile.name.split('.').slice(-1)[0]
        this.filename = `video.${this.extension}`
        this.setMessage('Writing file for editing...')
        await worker.write(this.filename, this.videoFile);
        this.setProgress(25)
        this.worker = worker
    }

    async set_download(element) {
        /**
         * Sets the download file element with downloading the new subtitles
         */

        const new_filename = this.filename.split('.')[0] + '.srt'
        this.sp.set_download(element, new_filename, delay)

    }

    async continueCheckDelay() {
        const lastDelayFound = this.delaysFound[this.delaysFound.length - 1]
        const start = lastDelayFound.start + Constants.DEFAULT_SECTION_LENGTH
        const end = lastDelayFound.end + Constants.DEFAULT_SECTION_LENGTH
        const delay = await this.checkDelay(start, end)
        return delay
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

        const iteration = start / Constants.DEFAULT_SECTION_LENGTH

        // Progres: First iteration: 25, Second: 55, Third: 70, Fourth: 77, Fifth: 81 etc.
        let progress = 25 + Math.floor([...Array(iteration).keys()].map((num) => 30 / Math.pow(2, num)).reduce((a, b) => a + b, 0))
        const step = (30 / Math.pow(2, iteration))

        const buffer = await this.trimVideo(start, end)
        const base64str = Helpers.arrayBufferToBase64(buffer)
        this.setProgress(Math.floor(progress + (step / 3)))
        const check_delay_url = this.server + Constants.CHECK_DELAY_ROUTE
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
            this.delaysFound = this.delaysFound.concat({
                delay: json_res.delay, start, end
            })
            return json_res.delay
        } else {
            const new_start = start + Constants.DEFAULT_SECTION_LENGTH
            const new_end = end + Constants.DEFAULT_SECTION_LENGTH
            this.setProgress(Math.floor(progress + step))
            return this.checkDelay(new_start, new_end)
        }
    }

    async trimVideo(start, end, extension = undefined) {
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

        let trimed_filename = 'trimed.'
        if (extension === undefined) {
            trimed_filename += this.extension;
        }
        else {
            trimed_filename += extension
        }
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

        const buffer = await this.trimVideo(Constants.PREVIEW_START_TIME, Constants.PREVIEW_END_TIME, Constants.PREVIEW_FILE_EXTENSION)
        const url = URL.createObjectURL(new Blob([buffer], { type: Constants.PREVIEW_FILE_MIMETYPE }));
        return url
    }
}

export default Checker;