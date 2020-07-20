import Grid from '@material-ui/core/Grid'
import styles from './start.module.css'
import formStyles from './form.module.css'

const Start = (props) => (
    <Grid container className={styles.container}>
        {/* Start button */}
        <Grid container>
            <Grid item lg={4} xs={false}></Grid>
            <Grid item lg={4} xs={12}>
                <button 
                id="start-button" 
                disabled={props.disabled} 
                onClick={props.disabled ? null : props.sync} 
                className={formStyles.formButton}
                >
                    {props.running ? "Stop" : "Start"}
                </button>
            </Grid>
        </Grid>
    </Grid>
)

export default Start