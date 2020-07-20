import Navbar from '../components/navbar'
import Grid from '@material-ui/core/Grid'
import styles from './contact.module.css'
import formStyles from '../components/form.module.css'

const Contact = () => {
    const submitForm = async () => {
        // Validate
        const name = document.getElementById('name').value
        const email = document.getElementById('email').value
        const message = document.getElementById('message').value
        console.log(name, email, message)
        if (email === "" || message === "") {
            return alert('False')
        }
        await fetch('/api/email',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            }
        )
        console.log('Finsihed')
    }

    return (
        <div>
            <Navbar />
            <Grid container className={styles.container}>
                <Grid item xs={false} sm={2} md={3} lg={4} />
                <Grid item xs={12} sm={8} md={6} lg={4} className={styles.formWrapper}>
                    <h1 className={styles.header}>Feedback is appreciated!</h1>
                    <input id="name" className={styles.textInput} placeholder="Name (Optional)"></input>
                    <input id="email" className={styles.textInput} placeholder="Email" type="email"></input>
                    <textarea id="message" className={[styles.textInput, styles.textarea].join(' ')} placeholder="Message"></textarea>
                    <button className={[formStyles.formButton, styles.button].join(' ')} onClick={submitForm}>Send</button>
                </Grid>
            </Grid>
        </div>
    )
}

export default Contact