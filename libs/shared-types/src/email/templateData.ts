import { EmailType } from '../enums/email-type'
import { EmailConfirmationData } from './emailConfirmationData'
import { ExportData } from './exportData'
import { ForgotPasswordData } from './forgotPasswordData'
import { InvitationData } from './invitationData'

export type TemplateData = {
  [EmailType.EmailConfirmation]: EmailConfirmationData
  [EmailType.ForgotPassword]: ForgotPasswordData
  [EmailType.Invitation]: InvitationData
  [EmailType.Export]: ExportData
}
