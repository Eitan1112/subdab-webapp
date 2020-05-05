import Grid from '@material-ui/core/Grid'
import styles from './modal.module.css'
import * as Constants from '../constants'

const Modal = (props) => {

    const handleContinueSync = async () => {
        await props.continueCheckDelay()
    }

    return (
    <Grid container className={styles.container}>
        <Grid item xs={false} lg={4} />
        <Grid item xs={12} lg={4}>
            <Grid container className={styles.modalBody}>
                <Grid item xs={12}>
                    <h1>View Sample</h1>
                </Grid>
                <Grid item xs={12}>
                    <video type={Constants.PREVIEW_FILE_MIMETYPE} className={styles.video} controls>
                        <source src={props.videoSrc}></source>
                        <track default src={props.subSrc} kind="subtitles" srcLang="en" label="English">
                        </track>
                    </video>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <a href={document.getElementById('download').href}
                       download={document.getElementById('download').download}
                       className={styles.removeUnderline}>
                        <button id="download-subtitles-modal" className={styles.button}>
                            Download Subtitles
                            </button>
                    </a>
                    {props.videoSrc}
                </Grid>
                <Grid item xs={12} lg={6}>
                    <button id="not-synced" className={styles.button} onClick={handleContinueSync}>
                        Not Synced - Continue
                    </button>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
    )
}

export default Modal