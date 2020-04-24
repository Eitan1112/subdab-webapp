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
import SubtitlesParser from '../utils/subtitleParser';

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
    const [startDisabled, setStartDisabled] = useState(false)
    const [videoSrc, setVideoSrc] = useState('')
    const [subSrc, setSubSrc] = useState('')

    const handleSuccessClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessOpen(false)
    };

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorOpen(false);
    };

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const alertSuccess = (msg) => {
        setMessage('Finished')
        setSuccess(msg)
        setSuccessOpen(true)
        setStartDisabled(false)
        setProgress(100)
        props.setRunning(false)
    }

    const alertError = (msg) => {
        setError(msg)
        setErrorOpen(true)
        setStartDisabled(false)
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
        
        const input = document.querySelector('input[type=file]')
        if (Array.from(input.files).length !== 2) {
            return { validated: false, error: 'Please upload both the subtitles and video files.' }
        }
        let subsElement
        let videoElement
        try {
            subsElement = (Array.from(document.querySelector('input[type="file"]').files).filter((file) => file.type.split('/')[0] !== 'video'))[0];
            videoElement = (Array.from(document.querySelector('input[type="file"]').files).filter((file) => file.type.split('/')[0] === 'video'))[0];
        } catch {
            return { validated: false, error: 'Please upload one video file and one subtitles file.' }
        }
        if (subsElement === undefined || subsElement.type !== '') {
            return { validated: false, error: 'Please upload a valid subtitles file.' }

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
        setStartDisabled(true)
        props.setRunning(true)

        try {
            await checker.prepare()
        } catch (err) {
            alertError(`Unexpect error: ${err}`)
            return
        }

        if (checked) { // If to check sync first
            let is_synced
            try {
                is_synced = await checker.checkSync()
            } catch (err) {
                alertError(`Unexpected error while checking sync: ${err}`)
                return
            }
            if (is_synced) {
                setProgress(100)
                return alertSuccess('The subtitles and video are already synced!')
            }
        }

        setMessage('Subtitles are not synced with video.')
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

        alertSuccess('Finished')
        setDownloadOnly([])
        const new_filename = checker.videoFile.name.split('.').slice(0, -1).join() + '.srt'
        checker.sp.setDownload(new_filename, delay)
        const subSrcResult = checker.sp.setUrl()
        setSubSrc(subSrcResult)
        const videoSrcResult = await checker.setUrl()
        setVideoSrc(videoSrcResult)
    };

    return (
        <Grid container className={styles.container}>
            {/* Message boxes and upload files input */}
            <Grid container>
                <Grid item md={false} lg={false} xl={1}></Grid>
                <HowItWorks />
                <Grid item lg={4} xs={12}>
                    <Upload></Upload>
                </Grid>
                <TimeItTakes />
            </Grid>
            <Start sync={sync} handleChange={handleChange} disabled={startDisabled} />
            <Progress only={progressOnly} progress={progress} message={message} />
            <Download only={downloadOnly} videoSrc={videoSrc} subSrc={subSrc} />
            <HowItWorksMobile />

            {/* Alerts */}
            <TimeItTakesMobile />
            <Snackbar open={errorOpen} className={styles.alert} autoHideDuration={9000} onClose={handleErrorClose}>
                <Alert severity="error" onClose={handleErrorClose}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={successOpen} className={styles.alert} autoHideDuration={6000} onClose={handleSuccessClose}>
                <Alert severity="success" onClose={handleSuccessClose}>
                    {success}
                </Alert>
            </Snackbar>
            {process.env.API_SERVER}
        </Grid>
    )
}

export default Form