import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid'
import styles from './start.module.css'
import formStyles from './form.module.css'


const Start = (props) => (
    <Grid container>
        {/* Check Sync button */}
        <Grid container>
            <Grid item md={3} lg={4}></Grid>
            <Grid item md={6} lg={4}>
                <Checkbox
                    defaultChecked={true}
                    onClick={props.handleChange}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <span className={styles.checkSync}>Check Sync</span>
            </Grid>
        </Grid>
        {/* Start button */}
        <Grid container>
            <Grid item md={4}></Grid>
            <Grid item md={4}>
                <button onClick={props.sync} className={formStyles.formButton}>Start</button>
            </Grid>
        </Grid>
    </Grid>
)

export default Start