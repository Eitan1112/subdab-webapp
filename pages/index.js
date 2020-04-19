import React, { useState } from "react";
import SubtitlesParser from "../utils/subtitleParser";
import Readers from '../utils/readers'
import * as Constants from '../constants'

function App() {
  const [message, setMessage] = useState("Here comes the message");

  const sync = async () => {
    /**
     * Main entry function for syncing the subtitles.
     */
    
    const videoEle = document.getElementById('video-file')
    const subsEle = document.getElementById('subtitles-file')
    const readers = new Readers(subsEle, videoEle)
    if(!readers.validate()) {
        console.log('Upload both files.')
    }

    const subtitles = await readers.readSubtitlesAsync()
    const sp = new SubtitlesParser(subtitles)

    const valid_subtitles_timestamps = sp.get_valid_subtitles_timestamps()
    const data = await readers.getData(valid_subtitles_timestamps)
    const json_data = JSON.stringify(data)
    fetch(Constants.SERVER + Constants.CHECK_SYNC_ROUTE, 
        {
            method: 'POST', 
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'}, 
            body: json_data})
    .then((res) => {
        console.log('Response from server')
        console.log(res.json())
    }).catch((err) => {
        console.log(err)
    })


  };

  return (
    <div className="App" id="app">
      <p />
      <span>Video: </span>
      <input type="file" id="video-file"></input>
      <br />
      <span>Subtitles: </span>
      <input type="file" id="subtitles-file"></input>
      <br />
      <button onClick={sync}>Start</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
