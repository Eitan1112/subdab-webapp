import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid'
import styles from './start.module.css'
import formStyles from './form.module.css'


const Start = (props) => (
    <Grid container>
        {/* Check Sync button */}
        <Grid container>
            <Grid item xs={0} lg={4}></Grid>
            <Grid item xs={12} lg={4}>
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
            <Grid item lg={4} xs={0}></Grid>
            <Grid item lg={4} xs={12}>
                <button onClick={props.sync} className={formStyles.formButton}>Start</button>
            </Grid>
        </Grid>
    </Grid>
)

export default Start