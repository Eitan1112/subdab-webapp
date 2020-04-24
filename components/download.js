import formStyles from './form.module.css'
import styles from './download.module.css'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'
import MuiModal from '@material-ui/core/Modal';
import { useState } from 'react'
import ModalBody from './modal'


const Download = (props) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const modalBody = (<div><ModalBody videoSrc={props.videoSrc} subSrc={props.subSrc}/></div>)


    return (
        <Hidden only={props.only}>
            <Grid container>
                <Grid item xs={false} lg={4}></Grid>
                <Grid item xs={12} sm={6} lg={2}>
                    <a id="download">
                        <button className={[formStyles.formButton, styles.button].join(' ')}>
                            Download Subtitles
                    </button>
                    </a>
                </Grid>
                <Grid item xs={12} sm={6} lg={2}>
                    <a>
                        <button onClick={handleOpen} className={[formStyles.formButton, styles.button].join(' ')}>
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