import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'
import styles from './messageBoxes.module.css'

export const HowItWorks = () => (
    <Hidden mdDown>
        <Grid item md={4} xl={3} className={styles.messageBox}>
            <Grid className={styles.messageBoxInnerGrid}>
                <div>
                    <h3>
                        How does it work?
                        </h3>
                    <p>
                        The video file is being trimmed to small sections on your computer automatically, and only those sections are being sent to the server.
                        The server analyzes the video using speech recognition to determine the subtitles delay, and gives you a synced subtitles file.
                        </p>
                </div>
            </Grid>
        </Grid>
    </Hidden>
)

export const TimeItTakes = () => (
    <Hidden mdDown>
        <Grid item md={3} lg={4} xl={3} className={styles.messageBox}>
            <Grid className={styles.messageBoxInnerGrid}>
                <div>
                    <h3>
                        How much time will it take?
                        </h3>
                    <p>
                        It usually takes 2-3 minutes. <br />
                            However, it can take longer if there are a lot of background noises or poor audio quality. Anyway, don't be worried if the progres bar gets stuck for a minute, it is waiting for the server response.
                        </p>
                </div>
            </Grid>
        </Grid>
    </Hidden>
)

export const HowItWorksMobile = () => (
    <Hidden lgUp>
        <Grid container>
            <Grid item xs={12} className={styles.messageBoxMobile}>
                <Grid className={styles.messageBoxInnerGridMobile}>
                    <div>
                        <h3>
                            How does it work?
                        </h3>
                        <p>
                            The video file is being trimmed to small sections and only those sections are being sent to the server.
                            The server analyzes the video and subtitles to determine the delay, and finally you get a synced subtitles file.
                        </p>
                    </div>
                </Grid>
            </Grid>
        </Grid>
    </Hidden>
)

export const TimeItTakesMobile = () => (
    <Hidden lgUp>
        <Grid container>
            <Grid item xs={12} className={styles.messageBoxMobile}>
                <Grid className={styles.messageBoxInnerGridMobile}>
                    <div>
                        <h3>
                            How much time will it take?
                        </h3>
                        <p>
                            It usually take 2-3 about minutes. <br />
                            However, it can take longer if there are a lot of background noises or poor audio quality. Anyway, there is a progress bar to keep track and make sure nothing got stuck.
                        </p>
                    </div>
                </Grid>
            </Grid>
        </Grid>
    </Hidden>
)