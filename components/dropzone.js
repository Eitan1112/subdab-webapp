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
     *      extensions (Array) (OPTIONAL): Extensions to verify.
     */

    const [file, setFile] = useState()

    const handleChange = () => {
        const files = document.getElementById(props.id).files
        const fileCount = Array.from(files).length
        if(fileCount === 0) {
            return setFile()
        } else if(fileCount === 1) {
            if(props.extensions && !props.extensions.includes(files[0].name.slice(-3))) {
                document.getElementById(props.id).files = null
                const extensions_str = props.extensions.join(", ")
                extensions_str.substring(0, extensions_str.length - 1) // Remove last comma
                return props.alertError(`Only files with ${extensions_str} extension are allowed.`)
            }
            setFile({
                name: files[0].name,
                type: files[0].type})
        }
        props.alertSuccess('Files loaded.')
    }

    return (
        <div className={styles.container}>
            <input disabled={props.disabled} className={styles.input} type="file" id={props.id} onChange={handleChange} accept={props.accept} />
            <div className={file === undefined ? styles.text : [styles.text, styles.textFileLoaded].join(' ') }>{
                file === undefined ? 
                    props.text
                    :
                    file.name
                    }
            </div>
            {props.children}
        </div>
    )
}

export default Dropzone