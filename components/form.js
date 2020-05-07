import styles from './form.module.css'
import Grid from '@material-ui/core/Grid';
import { HowItWorks, TimeItTakes, HowItWorksMobile, TimeItTakesMobile } from './messageBoxes'
import Start from './start'
import Progress from './progress'
import Download from './download'
import { useState } from 'react'
import Checker from '../utils/checker'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';
import Dropzone from './dropzone'
import Languages from './languages'

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
    const [subtitlesLanguage, setSubtitlesLanguage] = useState('en')

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
        if(!videoLanguage || !subtitlesLanguage) {
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
        let delay
        try {
            if (isContinueCheckDelay) {
                delay = await checker.continueCheckDelay()
            } else {
                delay = await checker.checkDelay()
            }
        } catch (err) {
            alertError(`Unexpected error while checking delay: ${err}`)
            return
        }
        if (!delay) {
            return alertError('Unable to find delay.')
        }

        setProgress(100)
        setInputDisabled(false)
        alertSuccess('Finished')
        setDownloadOnly([])
        const new_filename = checker.videoFile.name.split('.').slice(0, -1).join() + '.srt'
        checker.sp.setDownload(new_filename, delay)
        const subSrcResult = checker.sp.setUrl()
        setSubSrc(subSrcResult)
        const videoSrcResult = await checker.setUrl()
        setVideoSrc(videoSrcResult)
        setGlobalChecker(checker)
    }

    return (
        <Grid container className={styles.container}>
            {/* Message boxes and upload files input */}
            <Grid container>
                <Grid item md={false} lg={false} xl={1}></Grid>
                <HowItWorks />
                <Grid item lg={2} xs={12}>
                    <Dropzone
                        disabled={inputDisabled}
                        alertError={alertError}
                        alertSuccess={alertSuccess}
                        accept={['video/*']}
                        id="video-file"
                        text="Load Video" />
                </Grid>
                <Grid item lg={2} xs={12}>
                    <Dropzone
                        disabled={inputDisabled}
                        alertError={alertError}
                        alertSuccess={alertSuccess}
                        accept={['', 'plain/text']}
                        extension={'srt'}
                        id="subtitles-file"
                        text="Load Subtitles" />
                </Grid>
                <TimeItTakes />
            </Grid>
            <Languages setSubtitlesLanguage={setSubtitlesLanguage} setVideoLanguage={setVideoLanguage} />
            <Start sync={main} disabled={inputDisabled} />
            <Progress only={progressOnly} progress={progress} message={message} />
            <Download only={downloadOnly} videoSrc={videoSrc} subSrc={subSrc} continueCheckDelay={checkDelay} />
            <HowItWorksMobile />

            {/* Alerts */}
            <TimeItTakesMobile />
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
        </Grid>
    )
}

export default Form