import { DropzoneArea } from 'material-ui-dropzone'

const Upload = () => (
    <div>
        <DropzoneArea
            onChange={() => console.log('Hey')}
            acceptedFiles={['video/*', '']}
            maxFileSize={10737418240}
            showFileNames={true}
            filesLimit={2}
            dropzoneText={'Upload video and subtitles'}
        />
    </div>
)


export default Upload