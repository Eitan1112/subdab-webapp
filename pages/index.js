import React, { useState } from "react";
import SubtitlesParser from "../utils/subtitleParser";
import Checker from '../utils/checker'
import * as Constants from '../constants'

function App() {
  const sync = async () => {
    /**
     * Main entry function for syncing the subtitles.
     */
    
     const skip_sync = document.getElementById('sync-check').checked
     console.log(skip_sync)
     const checker = new Checker()
     await checker.syncSubtitles(skip_sync)
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
      <input type="checkbox" id="sync-check"/><span>Skip Sync Check</span><br />
      <button onClick={sync}>Start</button>
    </div>
  );
}

export default App;
