import formData from 'form-data'
import { promises as fs } from 'fs'
import handlebars from 'handlebars'
import Mailgun, { MessageAttachment } from 'mailgun.js'
import { EmailType, TemplateData, emailTemplateFromType } from 'shared-types'

const mailgun = new Mailgun(formData)
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY as string })

// sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function sendEmail<T extends EmailType>(
  toEmail: string,
  subject: string,
  type: T,
  templateData: TemplateData[T],
  inline: { filename: string; data: Buffer }[] = [],
  attachment: MessageAttachment | null = null
) {
  const templateFile = await fs.readFile(emailTemplateFromType(type))
  const template = handlebars.compile(templateFile.toString())(templateData)

  // const mailer = createTransport({
  //   SES: {
  //     ses: new SESClient({
  //       region: process.env.SES_REGION as string,
  //       credentials: {
  //         accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
  //         secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
  //       }
  //     }),
  //     aws: {
  //       SendRawEmailCommand
  //     }
  //   }
  // })

  // const logoBuffer = await fs.readFile('src/assets/images/email-logo.png')
  // const logo = logoBuffer.toString('base64')

  // await sgMail.send({
  //   to: toEmail,
  //   from: 'help@rentyapps.com',
  //   subject,
  //   html: template,
  //   attachments: [
  //     new Attachment({
  //       content: logo,
  //       filename: 'logo.png',
  //       contentId: 'logo@rentyapps.com',
  //       disposition: 'inline',
  //       type: 'image/png'
  //     }),
  //     ...attachments
  //   ]
  // })

  // const result = await mailer.sendMail({
  //   from: 'help@rentyapps.com',
  //   to: toEmail,
  //   subject: subject,
  //   html: template,
  //   attachments: [
  //     {
  //       filename: 'email-logo.png',
  //       path: 'src/assets/images/email-logo.png',
  //       cid: 'logo@rentyapps.com'
  //     },
  //     ...attachments
  //   ]
  // })

  // console.log(result)

  const logo = {
    filename: 'logo.png',
    data: await fs.readFile('src/assets/images/email-logo.png')
  }

  await mg.messages.create('mg.42f.io', {
    from: '42 Finance <help@42f.io>',
    to: toEmail,
    subject,
    html: template,
    inline: [logo, ...inline],
    attachment: attachment ?? undefined
  })
}
