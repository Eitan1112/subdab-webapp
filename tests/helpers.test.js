import { cleanText, convertSubsTime, convertSecondsTime, addDelay } from '../utils/helpers'

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


test('Test addDelay', () => {
    const times = [
        '02:20:06,181',
        '02:20:06,100',
        '01:27:50,100',
        '00:00:03,177'        
    ]

    const delays = [
        -17.547,
        14.2408420,
        -6.4208420,
        -0.88
    ]

    const expected = [
        '02:19:48,634',
        '02:20:20,340',
        '01:27:43,679',
        '00:00:02,297'
    ]

    times.forEach((time, i) => {
        const delayedTime = addDelay(time, delays[i])
        expect(delayedTime).toBe(expected[i])
    })
})