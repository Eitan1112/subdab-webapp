import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid'
import styles from './start.module.css'
import formStyles from './form.module.css'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';


const useStylesBootstrap = makeStyles((theme) => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
    },
}));

const BootstrapTooltip = (props) => {
    const classes = useStylesBootstrap();
    return <Tooltip arrow classes={classes} {...props} />;
}


const Start = (props) => (
    <Grid container className={styles.container}>
        {/* Check Sync button */}
        <Grid container>
            <Grid item xs={false} lg={4}></Grid>
            <Grid item xs={12} lg={4}>
                <Checkbox
                    defaultChecked={true}
                    className={styles.checkbox}
                    onClick={props.handleChange}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <BootstrapTooltip placement={'top'} arrow={false} className={styles.checkSync} title="Check if the subtitles are synced with the video before checking the delay.">
                    <span onClick={() => document.querySelector('input[type="checkbox"').click()}>Check Sync </span>
                </BootstrapTooltip>
            </Grid>
        </Grid>
        {/* Start button */}
        <Grid container>
            <Grid item lg={4} xs={false}></Grid>
            <Grid item lg={4} xs={12}>
                <button disabled={props.disabled} onClick={props.disabled ? null : props.sync} className={formStyles.formButton}>Start</button>
            </Grid>
        </Grid>
    </Grid>
)

export default Start