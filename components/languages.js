import { Grid } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { videoLanguages, subtitlesLanguages } from '../utils/languages'
import TextField from '@material-ui/core/TextField';
import styles from './languages.module.css'

const Languages = (props) => {
    const handleVideoLanguageChange = (event, value) => {
        if (value !== null) {
            props.setVideoLanguage(value.code)
        } else {
            props.setVideoLanguage(null)
        }
    }

    const handleSubtitlesLanguageChange = (event, value) => {
        if (value !== null) {
            props.setSubtitlesLanguage(value.code)
        } else {
            props.setSubtitlesLanguage(null)
        }
    }

    return (
        <Grid container className={styles.container}>
            <Grid item xl={4} lg={4} md={3} sm={2} xs={false} />
            <Grid item xl={2} lg={2} md={3} sm={4} xs={12} className={styles.videoLanguageWrapper}>
                <Autocomplete
                    className={styles.autoComplete}
                    id="video-language"
                    defaultValue={videoLanguages[0]}
                    onChange={handleVideoLanguageChange}
                    options={videoLanguages}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Video Language" variant="outlined" />}
                />
            </Grid>
            <Grid item xl={2} lg={2} md={3} sm={4} xs={12} className={styles.subtitlesLanguageWrapper}>
                <Autocomplete
                className={styles.autoComplete}
                    id="subtitles-language"
                    defaultValue={subtitlesLanguages[0]}
                    onChange={handleSubtitlesLanguageChange}
                    options={subtitlesLanguages}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Subtitles Language" variant="outlined" />}
                />
            </Grid>
        </Grid>
    )
}

export default Languages