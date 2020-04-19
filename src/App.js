import React, { useState } from 'react';
import { createWorker, setLogging } from '@ffmpeg/ffmpeg';
import SubtitlesParser from './subtitlesParser'

function App() {
  /*
  Main component.
  */

  const [message, setMessage] = useState('Message Comes here');
  const worker = createWorker({ logger: ({ message }) => console.log(message), })
  const client = new WebSocket('ws://127.0.0.1:5000')
  client.onopen = () => {
    console.log('Connected to server.')
  }

  const sync = async () => {
    console.log('Validating')
    if (!validate()) {
      console.log('Failed validation')
      return
    }

    console.log('Parsing subtitles...')
    const file = document.getElementById('subtitles-file').files[0]
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = (e) => {
      const regex = /(\d+)\r\n(\d\d:\d\d:\d\d,\d\d\d) --> (\d\d:\d\d:\d\d,\d\d\d)\r\n((?:.+\n)*.+)/gm
      const subtitles = e.target.result
      const re_subs = Array.from(subtitles.matchAll(regex))
      const sp = new SubtitlesParser(subtitles, re_subs)
      sync_callback(sp)
    }
  }

  const sync_callback = async (sp) => {
    readBlob(buffers_callback, sp)
  };

  const buffers_callback = async (base64data, sp) => {

    const valid_indexes = sp.get_valid_indexes()
    const timestamps = valid_indexes.map((index) => {
      const [subtitles, start, end] = sp.get_subtitles(index)
      return [start, end, index]
    })

    const buffers = await getBufferOfTimestamps(base64data, timestamps)
    console.log('Getting valid indexes')
    let videos = []
    console.log('Getting timestamps')
    console.log('gettings buffers')
    const msg = JSON.stringify({
      action: 'check_sync',
      buffers,
      subtitles: sp.subtitles
    })
    console.log('Sending msg')
    client.send(msg)
    console.log('Waiting for message')
  }


  client.onmessage = (msg) => {
    console.log(msg.data)
    alert(msg.data)
  }



  function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }


  const validate = () => {
    /*
    Used to validate the files.
    Checks that both file inputs were inputed with files.
    */

    const videoEle = document.getElementById('video-file')
    const subsEle = document.getElementById('subtitles-file')

    if (!videoEle.files[0] || !subsEle.files[0]) {
      setMessage('Please upload both files.')
      console.log('Please upload both files.')
      return false
    }
    return true
  }

  const readBlob = (callback, sp) => {
    /*
    Reads the video file and returns it's base64.

    Returns:
      string: base64 of the video file.
    */

    console.log('Reading blob...')
    const file = document.getElementById("video-file").files[0]
    if (file) {
      const reader = new FileReader()
      setMessage('Reading blob...')
      reader.onloadend = (evt) => {
        callback(reader.result, sp) // The base64 data
      }
      reader.onerror = (err) => {
        setMessage(`Error reading video file: ${err}`)
        console.log(`Error reading video file: ${err}`)
      }
      reader.readAsDataURL(file)
    }
  }

  const getBufferOfTimestamps = async (base64data, timestamps) => {
    /*
    Gets the video timestamps requested.

    Attributes:
      base64data (string): The base64data of the full video.
      timestamps (array): Array of arrays containing timestamps in seconds and index. (e.g. [[0.9, 3.2, 1], [4.8, 5.4, 2], [7.6, 9.8, 3]])

    Returns:
      Array: Containing the buffer of the requested timestamps according to the index. (e.g. [bufferOfFirstTimestamp, bufferOfSecondTimestamp...])
    */

    console.log(base64data.slice(0, 50))
    setMessage('Loading ffmpeg-core.js');
    await worker.load();

    setMessage('Start transcoding');
    await worker.write('video.mp4', base64data);

    console.log('triming...')
    setMessage('Triming...')


    console.log('Timestamps:', timestamps)
    const buffers = await trimVideo(worker, 10, 15)
    const base64buffer = arrayBufferToBase64(buffers)
    console.log('Bufff')
    console.log('Bufferrrr', base64buffer.slice(0, 50))
    // await timestamps.forEach(async ([start, end, index]) => {
    //   trimVideo(worker, start, end).then((buffer) => {
    //     buffers.push({ buffer, index })
    //   }).catch((err) => {
    //     setMessage(`Error while triming: ${err}`)
    //     console.log(`Error while triming: ${err}`)
    //   })
    // })

    await worker.remove('video.mp4')
    setMessage('finished')
    console.log('finished')
    return base64buffer

  }


  const trimVideo = async (worker, start, end) => {
    /**
    * Trims a video and returns the buffer.
    * 
    * Params:
    *      worker (worker): The worker (must be loaded and written into first).
    *      start (double): Start time in seconds.
    *      end (double): End time in seconds.
    * 
    * Returns:
    *       string: The buffer of the file.
    */

    await worker.trim('video.mp4', `trimedd.mp4`, start, end, '-c copy -y')
    const { data } = await worker.read(`trimedd.mp4`);
    await worker.remove('trimedd.mp4')


    console.log(`Trimmed ${start}-${end}`)
    return data.buffer
  }



  return (
    <div className="App" id="app">
      <p />
      <span>Video: </span><input type="file" id="video-file"></input><br />
      <span>Subtitles: </span><input type="file" id="subtitles-file"></input><br />
      <button onClick={sync}>Start</button>
      <p>{message}</p>
    </div>
  );
}


export default App;