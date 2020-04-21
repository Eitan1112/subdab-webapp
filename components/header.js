import styles from './header.module.css'
import Grid from '@material-ui/core/Grid';

const Header = () => (
    <Grid container className={styles.container}>
        <Grid item xs={12}>
            <img src="/logo.png" />
        </Grid>
        <Grid item xs={12}>
            <h3>Automatically syncs your videos and subtitles!</h3>
        </Grid>
    </Grid>
)

export default Header