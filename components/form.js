import styles from './form.module.css'
import Grid from '@material-ui/core/Grid';
import Upload from './upload'
import { HowItWorks, TimeItTakes, HowItWorksMobile, TimeItTakesMobile } from './messageBoxes'
import Start from './start'
import Progress from './progress'
import Download from './download'
import { useState } from 'react'


const Form = () => {
    const hiddenOnly = ['xs', 'sm', 'md', 'lg', 'xl']

    const [progressOnly, setProgressOnly] = useState(hiddenOnly)
    const [downloadOnly, setDownloadOnly] = useState(hiddenOnly)
    const [message, setMessage] = useState('Waiting to start')
    const [checked, setChecked] = useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const sync = async () => {
        /**
         * Main entry function for syncing the subtitles.
         */

        setProgressOnly([])
        const skip_sync = document.getElementById('sync-check').checked
        const checker = new Checker()
        await checker.syncSubtitles(skip_sync)
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
            <Start sync={sync} handleChange={handleChange} />
            <Progress only={progressOnly} status={0} message={message} />
            <Download only={downloadOnly} />
            <HowItWorksMobile />
            <TimeItTakesMobile />
        </Grid>
    )
}

export default Form