import React, { useState } from 'react'
import styles from './dropzone.module.css'


const Dropzone = (props) => {
    /**
     * Dropzone component for Drag and Drop file input.
     * 
     * Props:
     *      alertError (function): Function for alerting an error.
     *      alertSuccess (function): Function for alerting success.
     *      accept (Array): Array of strings containing accepted MIME types.
     *      id (string): ID for the file input.
     *      text (string): Default text
     *      extension (string) (OPTIONAL): Extension to enforce on files.
     */

    const [file, setFile] = useState()
    const handleChange = () => {
        const files = document.getElementById(props.id).files
        const fileCount = Array.from(files).length
        if(fileCount === 0) {
            return setFile()
        } else if(fileCount === 1) {
            if(props.extension && files[0].name.slice(-3) !== props.extension) {
                document.getElementById(props.id).files = null
                return props.alertError(`Only file with '${props.extension}' extension are allowed.`)
            }
            setFile({
                name: files[0].name,
                type: files[0].type})
        }
        props.alertSuccess('Files loaded.')
    }

    return (
        <div className={styles.container}>
            <input className={styles.input} type="file" id={props.id} onChange={handleChange} accept={props.accept} />
            <div className={styles.text}>{
                file === undefined ? 
                    props.text
                    :
                    file.name
                    }
            </div>
        </div>
    )
}

export default Dropzone