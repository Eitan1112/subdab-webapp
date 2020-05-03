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