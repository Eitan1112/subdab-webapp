import { cleanText, readSubtitlesAsync, convertSubsTime, convertSecondsTime } from '../utils/helpers'

test('Test for clean test', () => {
    const texts_to_clean = [
        '<i>(QUACK)</i>',
        'Some Text',
        '♪ Hello Hello ♪',
        '[Some text]',
        '<i><span font="helavica">Adios</span></i>',
        'What?\nThis is WHAT?',
        ' Some   text in   multiple     whitespaces ',
        '<i>*Quacks*</i>'
    ]

    const target_texts = [
        '',
        'some text',
        'hello hello',
        '',
        'adios',
        'what this is what',
        'some text in multiple whitespaces',
        ''
    ]

    texts_to_clean.forEach((text, i) => {
        const cleaned_text = cleanText(text)
        expect(cleaned_text).toBe(target_texts[i])
    })
})


test('Test for readSubtitlesAsync', async () => {
    const text = 'Lorem Ipsum'
    const file = new File([text], 'subtitles.srt')
    const recieved_text = await readSubtitlesAsync(file)
    expect(recieved_text).toBe(text)
})


test('Test convertSubsTime', () => {
    const subsTimes = [
        '02:20:06,181',
        '00:20:06,010',
        '02:20:06,100',
        '01:27:50,101',
        '00:00:03,014'
    ]
    const secondsTimes = [
        8406.181,
        1206.010,
        8406.1,
        5270.101,
        3.014
    ]

    subsTimes.forEach((time, i) => {
        const timeInSeconds = convertSubsTime(time)
        expect(timeInSeconds).toBe(secondsTimes[i])
    })
})


test('Test convertSecondsTime', () => {
    const subsTimes = [
        '02:20:06,181',
        '02:20:06,100',
        '01:27:50,100',
        '00:00:03,177'
    ]
    const secondsTimes = [
        8406.181,
        8406.1,
        5270.1,
        3.177
    ]

    secondsTimes.forEach((time, i) => {
        const timeInSubtitles = convertSecondsTime(time)
        expect(timeInSubtitles).toBe(subsTimes[i])
    })
})