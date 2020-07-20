import formStyles from './form.module.css'
import styles from './download.module.css'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'
import MuiModal from '@material-ui/core/Modal';
import { useState } from 'react'
import ModalBody from './modal'


const Download = (props) => {
    const [open, setOpen] = useState(true); // TODO CHange to false

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const modalBody = (<div><ModalBody 
        continueCheckDelay={props.continueCheckDelay} 
        videoSrc={props.videoSrc} 
        close={handleClose}
        subSrc={props.subSrc}/></div>)


    return (
        <Hidden only={props.only}>
            <Grid container className={styles.container}>
                <Grid item xl={4} lg={4} md={3} sm={2} xs={false}></Grid>
                <Grid item xl={2} lg={2} md={3} sm={4} xs={12}>
                    <a id="download">
                        <button id="download-subtitles" className={[formStyles.formButton, styles.button, styles.downloadButton].join(' ')}>
                            Download Subs
                    </button>
                    </a>
                </Grid>
                <Grid item xl={2} lg={2} md={3} sm={4} xs={12}>
                    <a>
                        <button id="preview" onClick={handleOpen} className={[formStyles.formButton, styles.button].join(' ')}>
                            Preview
                        </button>
                    </a>
                    <MuiModal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                    {modalBody}
                    </MuiModal>
                </Grid>
            </Grid>
        </Hidden>
    )
}


export default Download 