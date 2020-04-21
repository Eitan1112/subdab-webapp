import formStyles from './form.module.css'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'

const Download = (props) => (
    <Hidden only={props.only}>
        <Grid container>
            <Grid item md={4}></Grid>
            <Grid item md={2}>
                <a id="download">
                    <button className={formStyles.formButton}>
                        Download Subtitles
                    </button>
                </a>
            </Grid>
            <Grid item md={2}>
                <a>
                    <button className={formStyles.formButton}>
                        View Sample
                    </button>
                </a>
            </Grid>
        </Grid>
    </Hidden>
)


export default Download 