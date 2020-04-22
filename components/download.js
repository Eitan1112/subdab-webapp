import formStyles from './form.module.css'
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


    return (
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
                        <button onClick={handleOpen} className={formStyles.formButton}>
                            Preview
                        </button>
                    </a>
                    <MuiModal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                        <ModalBody videoSrc={props.videoSrc} subSrc={props.subSrc} />
                    </MuiModal>
                </Grid>
            </Grid>
        </Hidden>
    )
}


export default Download 