import Grid from '@material-ui/core/Grid'
import styles from './modal.module.css'
import * as Constants from '../constants'

const Modal = (props) => {

    const handleContinueSync = async () => {
        await props.continueCheckDelay()
    }

    return (
        <Grid container className={styles.container}>
            <Grid container className={styles.closeWrapper}>
                <Grid item xs={11} />
                <Grid item xs={1}>
                    <a className={styles.close} onClick={props.close}>
                        X
                    </a>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <h1 className={styles.header}>Preview</h1>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <video type={Constants.PREVIEW_FILE_MIMETYPE} className={styles.video} controls>
                        <source src={props.videoSrc}></source>
                        <track default src={props.subSrc} kind="subtitles" srcLang="en" label="English">
                        </track>
                    </video>
                </Grid>
            </Grid>
            <Grid container className={styles.buttonsWrapper}>
                <Grid item xs={12} sm={6}>
                    <a href={document.getElementById('download').href}
                        download={document.getElementById('download').download}
                        className={styles.removeUnderline}>
                        <button id="download-subtitles-modal" className={[styles.button, styles.downloadButton].join(' ')}>
                            Download Subtitles
                        </button>
                    </a>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <button id="not-synced" className={[styles.button, styles.notSyncedButton].join(' ')} onClick={handleContinueSync}>
                        Not Synced - Continue
                    </button>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Modal