import React, { useState } from 'react'
import styles from './dropzone.module.css'


const Dropzone = (props) => {
    const [files, setFiles] = useState([])

    const handleChange = () => {
        const currentFiles = document.getElementById('file-upload').files
        if (Array.from(currentFiles).length !== 2) {
            props.alertError('Please select 2 files.')
            document.getElementById('file-upload').files = null
            return
        }
        console.log(currentFiles[0].type, currentFiles[1].type)
        if (!((currentFiles[0].type.split('/')[0] === 'video' && currentFiles[1].type === "") ||
            (currentFiles[1].type.split('/')[0] === 'video' && currentFiles[0].type === ""))) {
            props.alertError('Please upload one subtitles file and one video file.')
            document.getElementById('file-upload').files = null
            return
        }
        props.alertSuccess('Files loaded.')
        setFiles(Array.from(currentFiles).map((file) => ({
            'name': file.name,
            'type': file.type
        })))
    }

    return (
        <div className={styles.container}>
            <input className={styles.input} type="file" id="file-upload" multiple onChange={handleChange} accept={['video/*', '', 'plain/text']} />
            <div className={styles.text}>{
                files.length === 0 ? 'Drag your files here or click in this area.'
                    :
                    files.map((file, index) => (
                        <div key={-index} className={styles.singleFile}>
                            {file.name}
                        </div>
                    ))
            }</div>
        </div>
    )
}

export default Dropzone