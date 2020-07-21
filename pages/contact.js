import Navbar from '../components/navbar'
import Grid from '@material-ui/core/Grid'
import styles from './contact.module.css'
import formStyles from '../components/form.module.css'
import MuiAlert from '@material-ui/lab/Alert';
import {useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Contact = () => {
    const [successOpen, setSuccessOpen] = useState(false)
    const [errorOpen, setErrorOpen] = useState(false)
    const [error, setError] = useState()
    
    const submitForm = async () => {
        const name = document.getElementById('name').value
        const email = document.getElementById('email').value
        const message = document.getElementById('message').value

        // Validate
        if (email === "" || message === "") {
            setError('Please fill email address and message fields.')
            setErrorOpen(true)
            return
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
        
        setSuccessOpen(true)
        document.getElementById('name').value = ""
        document.getElementById('email').value = ""
        document.getElementById('message').value = ""
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
            <Snackbar open={errorOpen} autoHideDuration={4000} onClose={() => setErrorOpen(false)}>
                <Alert severity="error" onClose={() => setErrorOpen(false)}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={successOpen} autoHideDuration={4000} onClose={() => setSuccessOpen(false)}>
                <Alert severity="success" onClose={() => setSuccessOpen(false)}>
                    Response Sent!
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Contact