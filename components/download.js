import styles from './form.module.css'
import Grid from '@material-ui/core/Grid'

const Download = () => (
    <Grid container>
        <Grid item md={4}></Grid>
        <Grid item md={2}>
            <button className={styles.formButton}>
                Download Subtitles
            </button>
        </Grid>
        <Grid item md={2}>
            <button className={styles.formButton}>
                View <br />Sample
            </button>
        </Grid>
    </Grid>
)


export default Download 