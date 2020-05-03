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

export const clean_text = (text) => {
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