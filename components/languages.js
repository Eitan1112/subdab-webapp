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
            props.setVideoLanguage(null)
        }
    }

    return (
        <Grid container className={styles.container}>
            <Grid item xs={4} />
            <Grid item lg={2} xs={12}>
                <Autocomplete
                    id="video-language"
                    defaultValue={{code: 'en', name: 'English'}}
                    onChange={handleVideoLanguageChange}
                    options={videoLanguages}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Video Language" variant="outlined" />}
                />
            </Grid>
            <Grid item lg={2} xs={12}>
                <Autocomplete
                    id="subtitles-language"
                    defaultValue={{code: 'en', name: 'English'}}
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