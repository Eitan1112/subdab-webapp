import Constants from "../constants";
import { createWorker, setLogging } from "@ffmpeg/ffmpeg";

class Readers {
  /**
   * @param {Element} subsElement
   * @param {Element} videoElement
   */

  constructor(subsElement, videoElement) {
    this.subsElement = subsElement;
    this.videoElement = videoElement;
  }

  validate() {
    if (!this.subsElement.files || !this.videoElement.files) {
      return false;
    }
    return true;
  }

  readSubtitlesAsync() {
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
      data.push([this.arrayBufferToBase64(buffer).slice(0, 50), subtitles]);
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
     *      start (double): Start time in seconds.
     *      end (double): End time in seconds.
     *
     * Returns:
     *       string: The buffer of the file.
     */

    const trimed_filename = "trimed." + filename.split(".")[1];
    await worker.trim(filename, trimed_filename, 15, 17, "-c copy -y");
    const { data } = await worker.read(trimed_filename);
    await worker.remove(trimed_filename);
    return data.buffer;
  }

  readVideoAsync() {
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
