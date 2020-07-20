import Grid from '@material-ui/core/Grid'
import styles from './progress.module.css'
import LinearProgress from '@material-ui/core/LinearProgress';
import Hidden from '@material-ui/core/Hidden'

const Progress = (props) => (
    <Hidden only={props.only}>
        <Grid container className={styles.container}>
            <Grid container>
                <Grid item lg={4} md={3} sm={2} xs={false}></Grid>
                <Grid item lg={4} md={6} sm={8} xs={12}>
                    <LinearProgress className={styles.progress} variant="determinate" value={props.progress} />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item lg={4} md={3} sm={2} xs={false}></Grid>
                <Grid item lg={2} md={3} sm={4} xs={6}>
                    <h3>
                        Progress: {props.progress}%
                    </h3>
                </Grid>
                <Grid item lg={2} md={3} sm={4} xs={6} className={styles.message}>
                    <h3>
                        {props.message}
                    </h3>
                </Grid>
            </Grid>
        </Grid>
    </Hidden>
)

export default Progress