import sgMail from '@sendgrid/mail'
import { Mail } from './types/mailTypes'

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function sendEmail(mail: Mail) {
    const { to, subject, html} = mail
    const msg = {
        to: to,
        from: 'ida.lim@chasacademy.se',
        subject: subject,
        html: html
    }

    try {
        const [response] = await sgMail.send(msg)
        console.log("email sent")
        console.log("status", response.statusCode)

    } catch(err) {
        if(err instanceof Error){
            console.log("Failed to send email: ", err)
        }
    }
}

