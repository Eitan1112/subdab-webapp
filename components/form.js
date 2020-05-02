import styles from './form.module.css'
import Grid from '@material-ui/core/Grid';
import Upload from './upload'
import { HowItWorks, TimeItTakes, HowItWorksMobile, TimeItTakesMobile } from './messageBoxes'
import Start from './start'
import Progress from './progress'
import Download from './download'
import { useState } from 'react'
import Checker from '../utils/checker'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';
import Dropzone from './dropzone'

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
    const [checked, setChecked] = useState(true);
    const [inputDisabled, setInputDisabled] = useState(false)
    const [videoSrc, setVideoSrc] = useState('')
    const [subSrc, setSubSrc] = useState('')
    const [checker, setChecker] = useState()

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
        if(Array.from(videoFile).length !== 1 || Array.from(subtitlesFile).length !== 1) {
            return {
                validation: false,
                error: 'Please upload both the subtitles and video files.'
            }
        }
        return { validated: true }
    }

    const sync = async () => {
        /**
         * Main entry function for syncing the subtitles.
         */

        const validation = validate()
        if (!validation.validated) {
            return alertError(validation.error)
        }

        setProgressOnly([]) // Show progress

        const checker = new Checker(process.env.API_SERVER, setProgress, setMessage, alertError)
        setInputDisabled(true)
        props.setRunning(true)

        try {
            await checker.prepare()
        } catch (err) {
            alertError(`Unexpect error: ${err}`)
            return
        }

        let delay
        try {
            delay = await checker.checkDelay()
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
        setChecker(checker)
    };


    const continueCheckDelay = async () => {
        setProgress(56)      
        setDownloadOnly(hiddenOnly)  
        let delay
        try {
            delay = await checker.continueCheckDelay()
        } catch (err) {
            alertError(`Unexpected error while checking delay: ${err}`)
            return
        }
        if (!delay) {
            return alertError('Unable to find delay.')
        }
        setProgress(100)
        setDownloadOnly([])
        const new_filename = checker.videoFile.name.split('.').slice(0, -1).join() + '.srt'
        checker.sp.setDownload(new_filename, delay)
        const subSrcResult = checker.sp.setUrl()
        setSubSrc(subSrcResult)
        const videoSrcResult = await checker.setUrl()
        setVideoSrc(videoSrcResult)
        setChecker(checker)
        setInputDisabled(false)
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
                        text="Load Video"  />
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
            <Start sync={sync} disabled={inputDisabled} />
            <Progress only={progressOnly} progress={progress} message={message} />
            <Download only={downloadOnly} videoSrc={videoSrc} subSrc={subSrc} continueCheckDelay={continueCheckDelay} />
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