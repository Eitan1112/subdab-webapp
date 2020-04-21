import { DropzoneArea } from 'material-ui-dropzone'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import styles from './form.module.css'

const Upload = () => (
    <div>
        {/* LG-XL Screens */}
        <Hidden mdDown>
            {/* Drag and Drop */}
            <DropzoneArea
                onChange={() => console.log('Hey')}
                acceptedFiles={['video/*', '']}
                maxFileSize={10737418240}
                showFileNames={true}
                filesLimit={2}
                dropzoneText={'Upload video and subtitles'}
            />
        </Hidden>

        {/* XS-DM Screens */}
        <Hidden lgUp>
            <Grid container>
            <Grid item xs={1}></Grid>                
                {/* Video Upload Button */}
                <Grid item xs={4}>
                    <input
                        accept="video/*"
                        id="video-button-file"
                        type="file"
                        className={styles.fileInput}
                    />
                    <label className={styles.fileInputLabel}  htmlFor="video-button-file">
                        <Button raised component="span">
                            Upload Video
                        </Button>
                    </label>

                </Grid>
                <Grid item xs={1}></Grid>
                {/* Subtitles Upload Button */}
                <Grid item xs={4}>
                    <input
                        accept=""
                        id="subtitles-button-file"
                        type="file"
                        className={styles.fileInput}
                    />
                    <label className={styles.fileInputLabel} htmlFor="subtitles-button-file">
                        <Button raised component="span">
                            Upload Subtitles
                        </Button>
                    </label>

                </Grid>
            </Grid>
        </Hidden>
    </div>
)


export default Upload