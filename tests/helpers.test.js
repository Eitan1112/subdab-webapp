import { clean_text } from '../utils/helpers'

/* Test clean_text */
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
        const cleaned_text = clean_text(text)
        expect(cleaned_text).toBe(target_texts[i])
    })
})