export const readSubtitlesAsync = (file) => {
    /**
     * Reads the subtitles file and resolves the subtitles file content.
     * 
     * Params:
     *      file (File): The file to read from.
     *
     * Returns:
     *    string: The subtitles.
     */

    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsText(file);
    });
}

export const cleanText = (text) => {
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
    text = text.replace(/♪/g, "").replace(/â™ª/g, "");
    text = text.replace(/ +/gi, " "); // Replace multiple whitespaces in one
    text = text.trim();
    return text;
}


export const convertSubsTime = (subs_time) => {
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


  export const convertSecondsTime = (seconds) => {
    /**
     * Convert seconds time to subtitles time.
     *   Params:
     *       seconds (int): Seconds to convert.
     *   Returns:
     *       str: subtitles format time. (e.g: 00:00:06,181 --> 00:00:08,383)
     */

    if (seconds > 362439.999) {
      throw 'Failed to convert seconds time. Number too large.'
    }

    const hours = String((Math.floor(seconds / 3600))).padStart(2, '0')
    seconds = seconds % 3600

    const minutes = String((Math.floor(seconds / 60))).padStart(2, '0')
    seconds = seconds % 60

    const miliseconds = String((Math.floor(seconds % 1 * 1000))).padStart(3, '0')
    seconds = String(Math.floor(seconds)).padStart(2, '0')

    const time = `${hours}:${minutes}:${seconds},${miliseconds}`
    return time
  }


  export const addDelay = (time, delay) => {
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

    let time_in_seconds = convertSubsTime(time)
    time_in_seconds += delay
    const new_time = convertSecondsTime(time_in_seconds)
    return new_time
  }
