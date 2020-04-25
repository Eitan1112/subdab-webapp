import { DropzoneArea } from 'material-ui-dropzone'
import styles from './upload.module.css'
import Dropzone from './dropzone'

const Upload = () => (
<div className={styles.container}>
        <Dropzone />
    </div>
)

export default Upload