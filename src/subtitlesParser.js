class SubtitlesParser {
    /**
    * Class for parsing the subtitles.
    * 
    * Attributes:
    * 
    *       re_subs (array): Array of arrays containing the subtitles in groups.
    *       subtitles (string): The subtitles
    */
   
    constructor(subtitles, re_subs) {
        /**
        * Constructor for the SubtitlesParser class.
        *
        * Params:
        *    subtitlesEle (element): The file input element of the subtitles.
        */
       
        this.subtitles = subtitles
        this.re_subs = re_subs
    }


    get_valid_indexes() {
        /**
         * Get valid indexes from the subtitles file. Valid indexes
         * are indexes where the cleaned text is not empty.
         * 
         * Returns:
         *      array: Containing the indexes.
         */

        // Gets number of rows in the subtitles
        const subs_length = this.re_subs.length

        // If there are less rows then the desired amount to check -> Set it to the number of rows
        let samples_to_check = 20

        if (subs_length < samples_to_check) {
            samples_to_check = subs_length - 1
        }

        // Gets random indexes from the range
        //indexes_to_check = random.sample(range(1, subs_length), samples_to_check)
        let invalids = []
        let indexes_to_check = []

        while (indexes_to_check.length != samples_to_check) {

            // If checked all the numbers in the range and not enough found valid -> raise
            if (indexes_to_check.length + invalids.length + 1 == subs_length) {
                throw Error('Unable to find enough samples to test.')
            }

            // Get random index
            const index = Math.floor(Math.random() * (subs_length - 1)) + 1

            // Check if it was already parsed
            if (!invalids.includes(index) && !indexes_to_check.includes(index)) {
                // Get cleaned subtitles
                const cleaned_subs = this.get_subtitles(index)[0]
                if (cleaned_subs == '') {
                    invalids.push(index)
                }
                else {
                    indexes_to_check.push(index)
                }
            }
        }

        return indexes_to_check
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

        text = text.replace('\n', ' ')
    
        // Remove HTML tags, text in curly, regular or square brackets and text in *
        text = text.replace(/((?:<|\[|\(|\*|\{).+?(?:>|\)|}|]|\*))/gi, '')

        text = text.toLowerCase()

        const punctuations_regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
        text = text.replace(punctuations_regex, '')
        text = text.replace('♪', '').replace('â™ª', '')
        text = text.replace(/ +/gi, ' ') // Replace multiple whitespaces in one
        text = text.trim()    
        return text
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

        const match = this.re_subs[index]
        const start = this.convert_subs_time(match[2])
        const end = this.convert_subs_time(match[3])
        let subtitles = match[4]
        subtitles = this.clean_text(subtitles)
        return [subtitles, start, end]
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
            const subs_splitted = subs_time.split(':')
            
            const hours = subs_splitted[0]
            const minutes = subs_splitted[1]
            const seconds = subs_splitted[2].split(',')[0]
            const miliseconds = subs_splitted[2].split(',')[1]

            const time = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds) + Number(miliseconds) / 1000
            return time

        } catch {
            throw Error(`Wrong time format in subtitles. Recieved: ${subs_time}`)
        }
    }
}


export default SubtitlesParser