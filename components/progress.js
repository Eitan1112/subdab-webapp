import Grid from '@material-ui/core/Grid'
import styles from './form.module.css'
import LinearProgress from '@material-ui/core/LinearProgress';
import { useState } from 'react';

const Progress = () => {
    const [status, setStatus] = useState(25)

    return (
        <Grid container>
            <Grid container className={styles.statusContainer}>
                <Grid item md={4}></Grid>
                <Grid item md={4}>
                    <LinearProgress variant="determinate" value={status} />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item md={4}></Grid>
                <Grid item md={2}>
                    <h3>
                        Progress: {status}%
                </h3>
                </Grid>
                <Grid item md={2} className={styles.message}>
                    <h3>
                        Waiting to start...
                </h3>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Progress