import * as Constants from "../constants";

class SubtitlesParser {
  /**
   * Class for parsing the subtitles.
   *
   * Attributes:
   *       re_subs (array): Array of arrays containing the subtitles in groups.
   *       subtitles (string): The subtitles
   */

  constructor(subtitles) {
    /**
     * Constructor for the SubtitlesParser class.
     *
     * Params:
     *     subtitles (string): The subtitles
     */

    this.subtitles = subtitles;
    const regex = /(\d+)\r\n(\d\d:\d\d:\d\d,\d\d\d) --> (\d\d:\d\d:\d\d,\d\d\d)\r\n((?:.+\n)*.+)/gm;
    this.re_subs = Array.from(this.subtitles.matchAll(regex));
  }

  download_subtitles(filename, delay) {
    const new_subtitles = this.generate_new_subtitles(delay)
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(new_subtitles));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }


  generate_new_subtitles(delay) {
    /**
     *  Generates new subtitle string with delay added.
     * 
     *   Params:
     *       delay (double): Delay to add.
     * 
     *   Returns:
     *       string: The subtitles with the delay added.
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
      const start_time = this.add_delay(match[0][1], delay)
      const end_time = this.add_delay(match[0][2], delay)
      const new_row = `${start_time} --> ${end_time}\r\n`
      new_subtitles += new_row
    }

    console.log(new_subtitles)
    return new_subtitles
  }

  get_valid_subtitles_timestamps() {
    /**
     * Get valid timestamps from the subtitles file. Valid timestamps
     * are timestamps where the cleaned text is not empty.
     *
     * Returns:
     *      Array of Arrays: [[subtitles, start_time, end_time], [subtitles, start_time, end_time]...]
     */

    // Gets number of rows in the subtitles
    const subs_length = this.re_subs.length;

    // If there are less rows then the desired amount to check -> Set it to the number of rows

    // Gets random indexes from the range
    //indexes_to_check = random.sample(range(1, subs_length), samples_to_check)
    let indexes_checked = []
    let subtitles_timestamps = [];

    while (subtitles_timestamps.length < Constants.MIN_VALID_INDEXES) {
      // If checked all the numbers in the range and not enough found valid -> Abort
      if (indexes_checked.length >= subs_length) {
        return alert("Unable to find enough samples to test.");
      }

      // Get random index in range 1 to subs_length
      const index = Math.floor(Math.random() * (subs_length - 1) + 1);

      // Check if it was already parsed
      if (!indexes_checked.includes(index)) {
        // Get cleaned subtitles and timestamps
        const [subtitles, start, end] = this.get_subtitles(index);

        if (subtitles != "") {
          subtitles_timestamps.push([subtitles, start, end]);
        }
        indexes_checked.push(index);
      }
    }
    return subtitles_timestamps;
  }

  clean_text(text) {
    /**
     * Cleans a string for better comparison.
     *
     * Params:
     *      text (str): The text to clean.
     *
     * Returns:
     *      str: The cleaned text.
     */

    text = text.replace("\n", " ");

    // Remove HTML tags, text in curly, regular or square brackets and text in *
    text = text.replace(/((?:<|\[|\(|\*|\{).+?(?:>|\)|}|]|\*))/gi, "");

    text = text.toLowerCase();

    const punctuations_regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    text = text.replace(punctuations_regex, "");
    text = text.replace("♪", "").replace("â™ª", "");
    text = text.replace(/ +/gi, " "); // Replace multiple whitespaces in one
    text = text.trim();
    return text;
  }

  get_subtitles(index) {
    /**
     * Get subtitles based on the index.
     *
     * Params:
     *      index (int): index of subtitles.
     *
     * Returns:
     *      Array: [subtitles: str, start: int, end: int]
     */

    const match = this.re_subs[index - 1]; // (index - 1) because the subtitles index 1 is in index 0 in the list
    const start = this.convert_subs_time(match[2]);
    const end = this.convert_subs_time(match[3]);
    let subtitles = match[4];
    subtitles = this.clean_text(subtitles);
    return [subtitles, start, end];
  }

  convert_subs_time(subs_time) {
    /**
     * Convert subtitles time (e.g.: 00:00:10,345) to seconds.
     *
     * Params:
     *      subs_time (string): The subtitles time.
     *
     * Returns:
     *      int: Seconds.
     */

    try {
      const subs_splitted = subs_time.split(":");

      const hours = subs_splitted[0];
      const minutes = subs_splitted[1];
      const seconds = subs_splitted[2].split(",")[0];
      const miliseconds = subs_splitted[2].split(",")[1];

      const time =
        Number(hours) * 3600 +
        Number(minutes) * 60 +
        Number(seconds) +
        Number(miliseconds) / 1000;
      return time;
    } catch {
      throw Error(`Wrong time format in subtitles. Recieved: ${subs_time}`);
    }
  }


  convert_seconds_time(seconds) {
    /**
     * Convert seconds time to subtitles time.
     *   Params:
     *       seconds (int): Seconds to convert.
     *   Returns:
     *       str: subtitles format time. (e.g: 00:00:06,181 --> 00:00:08,383)
     */

    if (seconds > 362439.999) {
      throw Error('Failed to convert seconds time. Number too large.')
    }

    const hours = String((Math.floor(seconds / 3600))).padStart(2, '0')
    seconds = seconds % 3600

    const minutes = String((Math.floor(seconds / 60))).padStart(2, '0')
    seconds = seconds % 60

    const miliseconds = String((Math.floor(seconds % 1 * 1000)))
    seconds = String(Math.floor(seconds)).padStart(2, '0')

    const time = `${hours}:${minutes}:${seconds},${miliseconds}`
    return time
  }


  add_delay(time, delay) {
    /**
    * Adds delay in seconds to subtitles time.
    * 
    * Params:
    *     time (str): time in subtitles format. (e.g.: 00:00:06,181)
    *     delay (float): delay to add in seconds.
    * 
    * Returns:
    *     str: time in subtitles format with the delay added.
    */

    let time_in_seconds = this.convert_subs_time(time)
    time_in_seconds += delay
    const new_time = this.convert_seconds_time(time_in_seconds)
    return new_time
  }
}

export default SubtitlesParser;
