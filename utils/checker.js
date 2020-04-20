import { createWorker, setLogging } from "@ffmpeg/ffmpeg";
import *  as Helpers from './helpers'
import * as Constants from '../constants'
import SubtitlesParser from './subtitleParser'

class Checker {
    /**
     * Class for reading files and making actions on these data.
     *
     * @param {Element} subsElement
     * @param {Element} videoElement
     * @param {Worker} worker
     * @param {SubtitlesParser} sp
     * @param {String} filename
     */

    constructor() {
        /**
         * Constructor for Readers class.
         */

        this.subsElement = document.getElementById('subtitles-file');
        this.videoElement = document.getElementById('video-file');
        this.sp = undefined
        this.filename = undefined
    }

    async prepare() {
        if (!this.subsElement.files || !this.videoElement.files) {
            throw Error('Please upload both files.')
        }

        const subtitles = await Helpers.readSubtitlesAsync(this.subsElement)
        this.sp = new SubtitlesParser(subtitles)

        const worker = createWorker({
            logger: ({ message }) => console.log(message),
        });

        console.log("Loading core...");
        await worker.load();

        console.log("Reading binary...");
        const binary = await Helpers.readVideoAsync(this.videoElement);

        const extension = this.videoElement.files[0].name.split('.')[1]
        this.filename = `video.${extension}`;
        console.log(`Filename: ${this.filename}`)
        console.log("Writing to fs...", this.filename);
        await worker.write(this.filename, binary);
        this.worker = worker
    }

    async syncSubtitles() {
        var t0 = performance.now();
        await this.prepare()
        const json_res = await this.checkSync()
        console.log('Is Synced:', json_res.is_synced)
        if (!json_res.is_synced) {
            console.log('Checking delay')
            let start = json_res.send_timestamp.start
            let end = json_res.send_timestamp.end
            const delay = await this.checkDelay(start, end)
            const new_filename = this.filename.split('.')[0] + '.srt'
            this.sp.download_subtitles(new_filename, delay)
            var t1 = performance.now();
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
        } else {
            console.log(json_res)
        }
    }

    async checkSync() {
        /**
         * 
         */

        const valid_subtitles_timestamps = this.sp.get_valid_subtitles_timestamps()
        const data = await this.getBuffersAndTimestamps(valid_subtitles_timestamps)
        const json_data = JSON.stringify(data)
        const check_sync_url = Constants.SERVER + Constants.CHECK_SYNC_ROUTE
        const request_content = {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: json_data
        }
        const res = await fetch(check_sync_url, request_content)

        const json_res = await res.json()
        return json_res
    }

    async checkDelay(start, end) {
        let delay = undefined

        while (!delay) {
            const buffer = await this.trimVideo(start, end)
            const base64str = Helpers.arrayBufferToBase64(buffer)
            const check_delay_url = Constants.SERVER + Constants.CHECK_DELAY_ROUTE
            const check_delay_body = JSON.stringify({
                base64str,
                timestamp: { start, end },
                subtitles: this.sp.subtitles
            })
            const request_content = {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: check_delay_body
            }
            console.log(check_delay_url,request_content)
            const res = await fetch(check_delay_url, request_content)
            const json_res = await res.json()
            if (json_res.hasOwnProperty('delay')) {
                delay = json_res.delay
            } else if (json_res.hasOwnProperty('send_timestamp')) {
                start = json_res.send_timestamp.start
                end = json_res.send_timestamp.end
            }
        }
        return delay
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
        console.log(`Triming.. filename: ${this.filename}`);

        for (const [subtitles, start, end] of subtitles_timestamps) {
            const buffer = await this.trimVideo(start, end);
            data.push([Helpers.arrayBufferToBase64(buffer), subtitles]);
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