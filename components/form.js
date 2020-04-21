import styles from './form.module.css'
import Grid from '@material-ui/core/Grid';
import Upload from './upload'
import { HowItWorks, TimeItTakes } from './messageBoxes'
import Start from './start'
import Progress from './progress'
import Download from './download'


const Form = () => (
    <Grid container className={styles.container}>
        {/* Message boxes and upload files input */}
        <Grid container>
            <Grid item md={0} lg={0} xl={1}></Grid>
            <Grid item md={4} xl={3} className={styles.howItWorks}>
                <Grid className={styles.howItWorkInnerGrid}>
                    <HowItWorks />
                </Grid>
            </Grid>
            <Grid item md={4} xs={12}>
                <Upload></Upload>
            </Grid>
            <Grid item md={3} lg={4} xl={3} className={styles.howItWorks}>
                <Grid className={styles.howItWorkInnerGrid}>
                    <TimeItTakes />
                </Grid>
            </Grid>
        </Grid>
        <Start />
        <Progress />
        <Download />

    </Grid>
)

export default Form