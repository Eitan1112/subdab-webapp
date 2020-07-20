import Navbar from '../components/navbar'
import Grid from '@material-ui/core/Grid'
import styles from './contact.module.css'
import formStyles from '../components/form.module.css'

const Contact = () => (
    <div>
        <Navbar />
        <Grid container className={styles.container}>
            <Grid item xs={false} sm={2} md={3} lg={4}/>
            <Grid item xs={12} sm={8} md={6} lg={4} className={styles.formWrapper}>
                <h1 className={styles.header}>Feedback is appreciated!</h1>
                <input className={styles.textInput} placeholder="Name (Optional)"></input>
                <input className={styles.textInput} placeholder="Email" type="email"></input>
                <textarea className={[styles.textInput, styles.textarea].join(' ')} placeholder="Message"></textarea>
                <button className={[formStyles.formButton, styles.button].join(' ')}>Send</button>
            </Grid>
        </Grid>
    </div>
)

export default Contact