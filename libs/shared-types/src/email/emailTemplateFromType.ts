import { EmailType } from '../enums/email-type'

export const emailTemplateFromType = (type: EmailType) => {
  switch (type) {
    case EmailType.EmailConfirmation:
      return 'src/assets/emailTemplates/emailConfirmation.html'
    case EmailType.ForgotPassword:
      return 'src/assets/emailTemplates/forgotPassword.html'
    case EmailType.Invitation:
      return 'src/assets/emailTemplates/invitation.html'
    case EmailType.Export:
      return 'src/assets/emailTemplates/export.html'
  }
}
