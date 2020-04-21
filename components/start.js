import { useState } from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid'
import styles from './form.module.css'


const Start = () => {
    const [checked, setChecked] = useState(true);

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const sync = async () => {
        /**
         * Main entry function for syncing the subtitles.
         */

        const skip_sync = document.getElementById('sync-check').checked
        const checker = new Checker()
        await checker.syncSubtitles(skip_sync)
    };


    return (
        <Grid container>
            {/* Check Sync button */}
            <Grid container>
                <Grid item md={3} lg={4}></Grid>
                <Grid item md={6} lg={4}>
                    <Checkbox
                        defaultChecked={true}
                        onClick={handleChange}
                        color="primary"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                    <span className={styles.checkSync}>Check Sync</span>
                </Grid>
            </Grid>
            {/* Start button */}
            <Grid container>
                <Grid item md={4}></Grid>
                <Grid item md={4}>
                    <button onClick={sync} className={styles.formButton}>Start</button>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Start