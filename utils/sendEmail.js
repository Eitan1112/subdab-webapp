import * as Constants from '../constants'
const fetch = require('node-fetch');

const sendEmail = async (name, email, message) => {
  const response = await fetch(Constants.SENDGRID_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: 'eitan1112@gmail.com'
            }
          ],
          subject: 'New Response in Subdab'
        }
      ],
      from: {
        email: 'noreply@subdab.com',
        name: 'Subdab'
      },
      content: [
        {
          type: 'text/html',
          value: `New response in subdab.\nName: ${name}.\nEmail: ${email}.\nMessage: ${message}`
        }
      ]
    })
  });
}

export { sendEmail }