import Constants from "../constants";
import { createWorker, setLogging } from "@ffmpeg/ffmpeg";

class Readers {
  /**
   * Class for reading files and making actions on these data.
   *
   * @param {Element} subsElement
   * @param {Element} videoElement
   */

  constructor(subsElement, videoElement) {
    /**
     * Constructor for Readers class.
     *
     * Params:
     *    subsElement (Element): Input file element of the subtitles.
     *    videoElement (Element): Input file element of the video.
     */

    this.subsElement = subsElement;
    this.videoElement = videoElement;
  }

  validate() {
    /**
     * Validate both files are uploaded.
     *
     * Returns:
     *    bool: Whether both files are uploaded.
     */

    if (!this.subsElement.files || !this.videoElement.files) {
      return false;
    }
    return true;
  }

  readSubtitlesAsync() {
    /**
     * Reads the subtitles file and resolves the subtitles file content.
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

      reader.readAsText(this.subsElement.files[0]);
    });
  }

  async getData(subtitles_timestamps) {
    /**
     * Gets the buffers of the timestamps and formats the return to fit the API.
     *
     * Params:
     *    subtitles_timestamps (Array of Arrays): [[subtitles, start, end], [subtitles, start, end]...]
     *
     * Returns:
     *    Array of Arrays: [[buffer, subtitles], [buffer, subtitles]...]
     */
    const extension = this.videoElement.files[0].name.split(".")[1];
    const worker = createWorker({
      logger: ({ message }) => console.log(message),
    });
    console.log("Loading core...");
    await worker.load();

    console.log("Reading binary...");
    const binary = await this.readVideoAsync();
    console.log("Writing to fs...");
    const filename = `video.${extension}`;
    console.log("Filename:", filename);
    await worker.write(filename, binary);
    let data = [];
    console.log("Triming..");

    for (const [subtitles, start, end] of subtitles_timestamps) {
      const buffer = await this.trimVideo(worker, filename, start, end);
      data.push([this.arrayBufferToBase64(buffer), subtitles]);
    }

    console.log("Removing...");
    await worker.remove(filename, binary);
    return data;
  }

  async trimVideo(worker, filename, start, end) {
    /**
     * Trims a video and returns the buffer.
     *
     * Params:
     *      worker (worker): The worker (must be loaded and written into first).
     *      filename (string): The filename to trim
     *      start (double): Start time in seconds.
     *      end (double): End time in seconds.
     *
     * Returns:
     *       string: The buffer of the file.
     */

    const trimed_filename = "trimed." + filename.split(".")[1]; // trimed.extension
    await worker.trim(filename, trimed_filename, start, end, "-c copy -y");
    const { data } = await worker.read(trimed_filename);
    await worker.remove(trimed_filename);
    return data.buffer;
  }

  readVideoAsync() {
    /**
     * Read the video file and resolve the file content as ArrayBuffer object.
     *
     * Returns:
     *    ArrayBuffer: Binary of the file.
     */

    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onloadend = () => {
        console.log("Load finished. Length: ", reader.result.length);
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsDataURL(this.videoElement.files[0]);
    });
  }

  arrayBufferToBase64(buffer) {
    /**
     * Converts ArrayBuffer object to base64 string.
     *
     * Params:
     *    buffer (ArrayBuffer): The buffer to convert.
     *
     * Returns:
     *    string: base64 string of the buffer.
     */
    
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

export default Readers;
