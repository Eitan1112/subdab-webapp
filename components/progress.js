import Grid from '@material-ui/core/Grid'
import styles from './progress.module.css'
import LinearProgress from '@material-ui/core/LinearProgress';
import Hidden from '@material-ui/core/Hidden'

const Progress = (props) => (
    <Hidden only={props.only}>
        <Grid container>
            <Grid container className={styles.statusContainer}>
                <Grid item xs={false} lg={4}></Grid>
                <Grid item xs={12} lg={4}>
                    <LinearProgress variant="determinate" value={props.progress} />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={false} lg={4}></Grid>
                <Grid item xs={6} lg={2}>
                    <h3>
                        Progress: {props.progress}%
                    </h3>
                </Grid>
                <Grid item xs={6} lg={2} className={styles.message}>
                    <h3>
                        {props.message}
                    </h3>
                </Grid>
            </Grid>
        </Grid>
    </Hidden>
)

export default Progress