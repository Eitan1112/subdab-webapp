import Navbar from '../components/navbar'
import styles from './about.module.css'
import Hidden from '@material-ui/core/Hidden'

const About = () => (
    <div>
        <Navbar />
        <div className={styles.container}>
            <h1>How Does It Work?</h1>
            <p className={styles.paragraph}>First, before uploading anything, the video is trimmed to a 5 minute section and that section is converted to audio. Then, this audio section (~5MB) is sent along with the subtitles to the server, where it is analyzed using speech recognition. The server finds the delay, and you get a newly generated synced subtitles file.</p>

            <h1>How Much Time Does It Take?</h1>
            <p className={styles.paragraph}>It takes about 1-3 minutes currently, with a 90 seconds average. Performance is still being worked on, but I hope you find it fast enough for you.</p>

            <h1>What Languages Are Supported?</h1>
            <p className={styles.paragraph}>Currently supported are 12 languages for the video, and 100+ languages for the subtitles.</p>

            <h1>What About Frame Rate Issues / Random Pauses?</h1>
            <p className={styles.paragraph}>Those problems are the main focus for future versions. Currently such subtitles will not be synced correctly.</p>
        </div>
        <Hidden only={["xs", "sm"]}>
        <img src="/magician.svg" className={styles.magician} />
        </Hidden>
    </div>
)

export default About