export const readVideoAsync = (element) => {
    /**
     * Read the video file and resolve the file content as ArrayBuffer object.
     * 
     * Params:
     *      element (Element): The file input element to read from.
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

        reader.readAsDataURL(element.files[0]);
    });
}

export const readSubtitlesAsync = (element) => {
    /**
     * Reads the subtitles file and resolves the subtitles file content.
     * 
     * Params:
     *      element (Element): The file input element to read from.
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

        reader.readAsText(element.files[0]);
    });
}

export const arrayBufferToBase64 = (buffer) => {
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

