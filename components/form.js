import styles from './form.module.css'
import Grid from '@material-ui/core/Grid';
import Start from './start'
import Progress from './progress'
import Download from './download'
import { useState, useEffect } from 'react'
import SubtitleParser from '../utils/subtitleParser'
import Checker from '../utils/checker'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';
import Dropzone from './dropzone'
import Languages from './languages'
import Contact from './contact'
import { readSubtitlesAsync } from '../utils/helpers';
import * as Constants from '../constants'


const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Form = (props) => {
    const hiddenOnly = ['xs', 'sm', 'md', 'lg', 'xl']

    const [progressOnly, setProgressOnly] = useState(hiddenOnly)
    const [downloadOnly, setDownloadOnly] = useState(hiddenOnly)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [errorOpen, setErrorOpen] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false)
    const [progress, setProgress] = useState(0)
    const [message, setMessage] = useState('Waiting to start')
    const [inputDisabled, setInputDisabled] = useState(false)
    const [videoSrc, setVideoSrc] = useState('')
    const [subSrc, setSubSrc] = useState('')
    const [globalChecker, setGlobalChecker] = useState()
    const [videoLanguage, setVideoLanguage] = useState('en')
    const [subtitlesLanguage, setSubtitlesLanguage] = useState('ad')
    const [innerWidth, setInnerWidth] = useState(undefined)

    useEffect(() => {
        setInnerWidth(window.innerWidth)
        console.log(window.innerWidth)
    })

    const handleSuccessClose = (event, reason) => {
        setSuccessOpen(false);
    };

    const handleErrorClose = (event, reason) => {
        setErrorOpen(false);
    };

    const alertSuccess = (msg) => {
        setMessage('Finished')
        setSuccess(msg)
        setErrorOpen(false)
        setSuccessOpen(true)
        props.setRunning(false)
    }

    const alertError = (msg) => {
        setError(msg)
        setSuccessOpen(false)
        setInputDisabled(false)
        setErrorOpen(true)
        props.setRunning(false)
        setProgress(0)
        setMessage('Waiting to start...')
    }


    const validate = () => {
        /**
         * Validates that the user input files are valid. 
         * 
         * Returns:
         *      Object: validated: Is validated. Error: The error if not validated.
         */

        const videoFile = document.getElementById('video-file').files
        const subtitlesFile = document.getElementById('subtitles-file').files
        if (Array.from(videoFile).length !== 1 || Array.from(subtitlesFile).length !== 1) {
            return {
                validation: false,
                error: 'Please upload both the subtitles and video files.'
            }
        }
        if (!videoLanguage || !subtitlesLanguage) {
            return {
                validation: false,
                error: 'Please select languages for the video and subtitles.'
            }
        }
        return { validated: true }
    }

    const main = async () => {
        /**
         * Main entry function for syncing the subtitles.
         */

        setDownloadOnly(hiddenOnly)
        const validation = validate()
        if (!validation.validated) {
            return alertError(validation.error)
        }
        const t0 = performance.now()
        console.log(`API Server: ${process.env.API_SERVER}`)
        const checker = new Checker(process.env.API_SERVER, setProgress, setMessage, alertError, videoLanguage, subtitlesLanguage)
        setProgressOnly([]) // Show progress
        setInputDisabled(true)
        props.setRunning(true)

        try {
            await checker.prepare()
        } catch (err) {
            alertError(`Unexpected error while preparing: ${err}`)
            return
        }

        await checkDelay(checker, false)
        const t1 = performance.now()
        console.log(`Finished in ${(t1 - t0) / 1000} seconds`)
    };

    const checkDelay = async (checker = globalChecker, isContinueCheckDelay = true) => {
        /**
         * Checks the delay and reacts accordinly on the UI.
         * 
         * Params:
         *      isContinueCheckDelay (Boolean): Whether this is the first run, or any run after that. Defaults to true, on first run is set to false.
         *      checker (Checker): The checker object. If not specified, use the global checker object.
         */

        setDownloadOnly(hiddenOnly)
        let delay, encoding, data
        try {
            if (isContinueCheckDelay) {
                data = await checker.continueCheckDelay()
            } else {
                data = await checker.checkDelay()
            }
        } catch (err) {
            alertError(`Unexpected error while checking delay: ${err}`)
            return
        }
        if (!data) {
            return alertError('Unable to find delay.')
        }
        ({ delay, encoding } = data)

        setProgress(100)
        setInputDisabled(false)
        alertSuccess('Finished')
        setDownloadOnly([])

        // Read subtitles, generate new file and set download button with download link
        const new_filename = checker.videoFile.name.split('.').slice(0, -1).join() + '.srt'
        const subtitlesFile = document.getElementById('subtitles-file').files[0]
        const subtitles = await readSubtitlesAsync(subtitlesFile, encoding)
        const sp = new SubtitleParser(subtitles)
        sp.setDownload(new_filename, delay)

        const subSrcResult = sp.setUrl()
        setSubSrc(subSrcResult)
        const videoSrcResult = await checker.setUrl()
        setVideoSrc(videoSrcResult)
        setGlobalChecker(checker)
    }

    return (
        <Grid container className={styles.container}>
            {/* Message boxes and upload files input */}
            <br />
            <Grid container className={styles.fileInputContainer}>
                <Grid item xl={4} lg={3} md={2} sm={1} xs={false}></Grid>
                <Grid item xl={2} lg={3} md={4} sm={5} xs={12} className={styles.videoDropzoneContainer}>
                    <Dropzone
                        disabled={inputDisabled}
                        alertError={alertError}
                        alertSuccess={alertSuccess}
                        accept={['video/*']}
                        extensions={['mp4', 'mkv', 'm4v', 'avi', 'webm', 'ogg']}
                        id="video-file"
                        text="Load Video" >
                    <img src="/play.svg" className={styles.playBackground} />
                    </Dropzone>
                </Grid>
                <Grid item xl={2} lg={3} md={4} sm={5} xs={12}>
                    <Dropzone
                        disabled={inputDisabled}
                        alertError={alertError}
                        alertSuccess={alertSuccess}
                        accept={['', 'plain/text']}
                        extensions={['srt']}
                        id="subtitles-file"
                        text="Load Subtitles">
                    <img src={innerWidth !== undefined && innerWidth < Constants.XS_BREAKPOINT ? 'stretchedSubtitles.svg' : 'subtitles.svg'} className={styles.subtitlesBackground} />
                    </Dropzone>
                </Grid>
            </Grid>
            <Languages setSubtitlesLanguage={setSubtitlesLanguage} setVideoLanguage={setVideoLanguage} />
            <Start sync={main} disabled={inputDisabled} />
            <Progress only={progressOnly} progress={progress} message={message} />
            <Download only={downloadOnly} videoSrc={videoSrc} subSrc={subSrc} continueCheckDelay={checkDelay} />

            {/* Alerts */}
            <Snackbar open={errorOpen} autoHideDuration={7000} onClose={handleErrorClose}>
                <Alert severity="error" onClose={handleErrorClose}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleSuccessClose}>
                <Alert severity="success" onClose={handleSuccessClose}>
                    {success}
                </Alert>
            </Snackbar>
            <Contact>
            </Contact>
        </Grid>
    )
}

export default Form