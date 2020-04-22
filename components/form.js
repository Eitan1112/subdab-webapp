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

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Form = () => {
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

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const alertSuccess = (msg) => {
        setSuccess(msg)
        setSuccessOpen(true)
        setMessage(msg)
        setStartDisabled(false)
    }

    const alertError = (msg) => {
        setError(msg)
        setErrorOpen(true)
        setMessage(msg)
        setStartDisabled(false)
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
            console.log(subsElement.type)
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

        const checker = new Checker(setProgress, setMessage, alertError)
        setStartDisabled(true)
        await checker.prepare()

        if (checked) { // If to check sync first
            const is_synced = await checker.checkSync()
            if (is_synced) {
                setProgress(100)
                return alertSuccess('The subtitles and video are already synced!')
            }
        }
        
        setMessage('Subtitles are not synced with video.')
        const delay = await checker.checkDelay()
        if (!delay) {
            return alertError('Unable to find delay.')
        }
        setMessage('Found delay')
        setProgress(100)
        setDownloadOnly([])
        const new_filename = checker.filename.split('.')[0] + '.srt'
        const download_ele = document.getElementById('download')
        checker.sp.setDownload(download_ele, new_filename, delay)
    };

    return (
        <Grid container className={styles.container}>
            {/* Message boxes and upload files input */}
            <Grid container>
                <Grid item md={0} lg={0} xl={1}></Grid>
                <HowItWorks />
                <Grid item lg={4} xs={12}>
                    <Upload></Upload>
                </Grid>
                <TimeItTakes />
            </Grid>
            <Start sync={sync} handleChange={handleChange} disabled={startDisabled}/>
            <Progress only={progressOnly} progress={progress} message={message} />
            <Download only={downloadOnly} />
            <HowItWorksMobile />

            {/* Alerts */}
            <TimeItTakesMobile />
            <Snackbar open={errorOpen} autoHideDuration={9000} >
                <Alert severity="error">
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={successOpen} autoHideDuration={6000} >
                <Alert severity="success">
                    {success}
                </Alert>
            </Snackbar>
        </Grid>
    )
}

export default Form