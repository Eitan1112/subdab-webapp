import { createWorker } from "@ffmpeg/ffmpeg";
import * as Constants from '../constants'

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
     *      filename (String): The video filename. (Only loads after prepare is called).
     *      setProgress (function): Function to set the progress.
     *      setMessage (function): Function to set message for the client.
     *      setError (function): Function to set error for the client.
     *      delaysFound (Array of objects): Array containing delays found (used if user decided the subtitles are not synced)
     *      videoLanguage (str): The video language code.
     *      subtitlesLanguage (str): The subtitles language code.
     */

    constructor(server, setProgress, setMessage, setError, videoLanguage, subtitlesLanguage) {
        /**
         * Constructor for Readers class.
         * 
         * Params:
         *      server (String): The API server.
         *      setProgress (function): Function to set the progress.
         *      setMessage (function): Function to set message for the client.
         *      setError (function): Function to set error for the client.
         *      videoLanguage (str): The video language code.
         *      subtitlesLanguage (str): The subtitles language code.
         */

        this.filename = undefined
        this.setProgress = setProgress
        this.setMessage = setMessage
        this.setError = setError
        this.server = server
        this.delaysFound = []
        this.videoLanguage = videoLanguage
        this.subtitlesLanguage = subtitlesLanguage        
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

        this.subsFile = document.getElementById('subtitles-file').files[0]
        this.videoFile = document.getElementById('video-file').files[0]
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

    // async set_download(element) {
    //     /**
    //      * Sets the download file element with downloading the new subtitles
    //      */

    //     const new_filename = this.filename.split('.')[0] + '.srt'
    //     this.sp.set_download(element, new_filename, delay)

    // }

    async continueCheckDelay() {
        const lastDelayFound = this.delaysFound[this.delaysFound.length - 1]
        const start = lastDelayFound.start + Constants.DEFAULT_SECTION_LENGTH
        const end = lastDelayFound.end + Constants.DEFAULT_SECTION_LENGTH
        const delay = await this.checkDelay(start, end)
        return delay
    }

    async checkDelay(start = 0, end = Constants.DEFAULT_SECTION_LENGTH) {
        /**
         * Checks the delay of the subtitles compared to the audio.
         * 
         * Params:
         *      start (int): The start time to trim the video. (Sent by server)
         *      end (int): The end time to trim the video. (Sent by server)
         * 
         * Returns:
         *      Object: {delay (str), encoding (str)}
         */

        return 0 // TOOD Remove
        const iteration = start / Constants.DEFAULT_SECTION_LENGTH
        if(iteration >= Constants.MAX_ITERATION) {
            throw 'Unable to find delay'
        }

        // Progres: First iteration: 25, Second: 55, Third: 70, Fourth: 77, Fifth: 81 etc.
        let progress = 25 + Math.floor([...Array(iteration).keys()].map((num) => 30 / Math.pow(2, num)).reduce((a, b) => a + b, 0))
        this.setProgress(Math.floor(progress))
        this.setMessage('Checking delay...')
        const step = (30 / Math.pow(2, iteration))

        const buffer = await this.trimAudio(start, end)
        this.setProgress(Math.floor(progress + (step / 3)))
        const check_delay_url = this.server + Constants.CHECK_DELAY_ROUTE
        const check_delay_body = new FormData()
        check_delay_body.append('audio', new Blob([buffer], { type: Constants.AUDIO_MIME }))
        check_delay_body.append('start', start)
        check_delay_body.append('end', end)
        check_delay_body.append('subtitles_language', this.subtitlesLanguage)
        check_delay_body.append('video_language', this.videoLanguage)
        check_delay_body.append('subtitles', new Blob([this.subsFile], { type: 'plain/text'}))

        const request_content = {
            method: 'POST',
            body: check_delay_body
        }
        this.setMessage('Checking delay...')
        const res = await fetch(check_delay_url, request_content)
        if (res.status !== 200) {
            return this.setError('Error occured - unable to find delay.')
        }

        const json_res = await res.json()
        if (json_res.hasOwnProperty('delay') && json_res.hasOwnProperty('encoding')) {
            const delay = json_res.delay
            const encoding = json_res.encoding
            this.delaysFound = this.delaysFound.concat({
                delay: delay, start, end
            })
            return {delay, encoding}
        } else {
            const new_start = start + Constants.DEFAULT_SECTION_LENGTH
            const new_end = end + Constants.DEFAULT_SECTION_LENGTH
            this.setProgress(Math.floor(progress + step))
            return this.checkDelay(new_start, new_end)
        }
    }

    async trimAudio(start, end) {
        /**
         * Trims the audio and returns the buffer.
         *
         * Params:
         *      start (double): Start time in seconds.
         *      end (double): End time in seconds.
         *
         * Returns:
         *       string: The buffer of the file.
         */

        const audioFilename = `trimmed_audio.${Constants.AUDIO_EXTENSION}`
        await this.worker.trim(this.filename, audioFilename, start, end, '-map 0:a -c copy -y');
        const { data } = await this.worker.read(audioFilename);
        await this.worker.remove(audioFilename);
        return data.buffer;
    }

    async setUrl() {
        /**
         * Creates and returns URL for the video.
         * 
         * Returns:
         *      String: The url
         */

        let videoToRead = this.filename

        if (this.extension !== Constants.PREVIEW_FILE_EXTENSION) {
            const transcodedVideoFilename = `transcoded.${Constants.PREVIEW_FILE_EXTENSION}`
            await this.worker.transcode(this.filename, transcodedVideoFilename, '-c copy -y')
            videoToRead = transcodedVideoFilename
        }

        const { data } = await this.worker.read(videoToRead)
        const url = URL.createObjectURL(new Blob([data.buffer], { type: Constants.PREVIEW_FILE_MIMETYPE }));
        return url
    }
}

export default Checker;