import React, { useState } from "react";
import SubtitlesParser from "../utils/subtitleParser";
import Checker from '../utils/checker'
import * as Constants from '../constants'

function App() {
  const [message, setMessage] = useState("Here comes the message");

  const sync = async () => {
    /**
     * Main entry function for syncing the subtitles.
     */

     const checker = new Checker()
     await checker.syncSubtitles()
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
