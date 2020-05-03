import { cleanText, readSubtitlesAsync, convertSubsTime } from '../utils/helpers'

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

test('Test Convert Subs Time', () => {
    const times = [
        '02:20:06,181',
        '00:20:06,001',
        '02:20:06,100',
        '01:27:50,101',
        '00:00:03,014'
    ]
    const expectedTimes = [
        8406.181,
        1206.001,
        8406.1,
        5270.101,
        3.014
    ]

    times.forEach((time, i) => {
        const timeInSeconds = convertSubsTime(time)
        expect(timeInSeconds).toBe(expectedTimes[i])
    })
})