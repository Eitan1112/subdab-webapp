import { addDelay } from './helpers'

class SubtitlesParser {
  /**
   * Class for parsing the subtitles.
   *
   * Attributes:
   *       subtitles (string): The subtitles
   *       re_subs (array): Array of arrays containing the subtitles in groups.
   *       synced_subtitles (string): When finds synced subtitles.
   *       re_synced_subtitles (array): Array of arrays containing the synced subtitles in groups.
   */

  constructor(subtitles) {
    /**
     * Constructor for the SubtitlesParser class.
     *
     * Params:
     *     subtitles (String): The subtitles
     */

    this.subtitles = subtitles;
    const regex = /(\d+)\r\n(\d\d:\d\d:\d\d,\d\d\d) --> (\d\d:\d\d:\d\d,\d\d\d)\r\n((?:.+\n)*.+)/gm;
    this.re_subs = Array.from(this.subtitles.matchAll(regex));
  }

  setDownload(filename, delay) {
    /**
     * Downloads newly generated subtitles file based on the delay.
     * 
     * Params:
     *    filename (String): The video filename.
     *    delay (float): The delay.
     */
     
    const download_ele = document.getElementById('download')
    const new_subtitles = this.generateNewSubtitles(delay)
    download_ele.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(new_subtitles));
    download_ele.setAttribute('download', filename);
  }


  generateNewSubtitles(delay) {
    /**
     *  Generates new subtitle string with delay added.
     * 
     *   Params:
     *       delay (double): Delay to add.
     * 
     *   Returns:
     *       String: The subtitles with the delay added.
     * */

    const rows = this.subtitles.split('\r\n')
    let new_subtitles = ''

    for (const row of rows) {
      // Search for timestamps
      const timestamps_pattern = /(\d\d:\d\d:\d\d,\d{3}) --> (\d\d:\d\d:\d\d,\d{3})/gim // Match a pattern like: 00: 00: 06, 181 -- > 00: 00: 08, 383
      const match = Array.from(row.matchAll(timestamps_pattern))

      // If row is not timestamp
      if (match === undefined || match.length == 0) {
        new_subtitles += row + '\r\n'
        continue
      }


      // If row is timestamp -> Calculate new time and append
      const start_time = addDelay(match[0][1], delay)
      const end_time = addDelay(match[0][2], delay)
      const new_row = `${start_time} --> ${end_time}\r\n`
      new_subtitles += new_row
    }
    // Set synced subtitles
    this.synced_subtitles = new_subtitles
    const regex = /(\d+)\r\n(\d\d:\d\d:\d\d,\d\d\d) --> (\d\d:\d\d:\d\d,\d\d\d)\r\n((?:.+\n)*.+)/gm;
    this.re_synced_subtitles = Array.from(new_subtitles.matchAll(regex));

    return new_subtitles
  }

  setUrl(setUrl) {
    /**
     * Sets url for the first six subtitles and sets the url, and returns the start and end time of the subs and the url.
     * 
     * Returns:
     *    String: The url to the subtitles.
     */

    // Convert to vvt format
    let subs = 'WEBVTT\r\n\r\n' + this.synced_subtitles
    subs = subs.replace(/,/g, '.')

    // Create file
    const subSrc = URL.createObjectURL(new Blob([subs], { type: 'text/vtt' }))
    return subSrc
  }
}

export default SubtitlesParser;

