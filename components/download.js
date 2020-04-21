import formStyles from './form.module.css'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'

const Download = (props) => (
    <Hidden only={props.only}>
        <Grid container>
            <Grid item md={4}></Grid>
            <Grid item md={2}>
                <button className={formStyles.formButton}>
                    Download Subtitles
                </button>
            </Grid>
            <Grid item md={2}>
                <button className={formStyles.formButton}>
                    View <br />Sample
                </button>
            </Grid>
        </Grid>
    </Hidden>
)


export default Download 