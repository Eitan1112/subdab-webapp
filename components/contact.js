import styles from './contact.module.css'
import Grid from '@material-ui/core/Grid'
import MailOutlineIcon from '@material-ui/icons/MailOutline';

const Contact = () => {
    return (
        <Grid container direction="row" alignItems="center">
            <Grid item md={4} xs={false} />
            <Grid item md={4} xs={12}>
                <Grid xs={12} className={styles.container}>
                    <h2>
                        Feedback is appreciated!
                    </h2>
                </Grid>
                <Grid xs={12} className={styles.container}>
                    <Grid item>
                        <MailOutlineIcon className={styles.emailIcon} />
                    </Grid>
                    <Grid item>
                        <a href="mailto:eitan1112@gmail.com" className={styles.email}>
                            Eitan1112@gmail.com
                        </a>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Contact