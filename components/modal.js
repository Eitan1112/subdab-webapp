import Grid from '@material-ui/core/Grid'
import styles from './modal.module.css'

const Modal = (props) => (
    <Grid container className={styles.container}>
        <Grid item xs={4} />
        <Grid item xs={4}>
            <Grid container className={styles.modalBody}>
                <Grid item xs={12}>
                    <h1>View Sample</h1>
                </Grid>
                <Grid item xs={12}>
                    <video src={props.videoSrc} className={styles.video} controls>
                        <track default src={props.subSrc} kind="subtitles" srcLang="en" label="English">
                        </track>
                    </video>
                </Grid>
                <Grid item xs={6}>
                    <a id="download2">
                        <button className={styles.button}>
                            Download Subtitles
                            </button>
                    </a>
                    {props.videoSrc}
                </Grid>
                <Grid item xs={6}>
                    <button className={styles.button}>
                        Not Synced - Continue
                    </button>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
)

export default Modal