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
}

export default SubtitlesParser;
