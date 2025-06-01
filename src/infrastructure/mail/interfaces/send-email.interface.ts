import { EmailType } from '../enums/mail-type.enums';
import { Attachment } from 'nodemailer/lib/mailer';

/**
 * Send Email Options
 *
 * This defines how the structure of the email is going to be.
 */
export interface IEmailOptions {
  sendersEmail?: string;
  sendersName?: string;
  receiversEmail: string;
  receiversName: string;
  emailSubject: string;
  emailTemplate: EmailType;
  emailAttachments?: Attachment[];
  fullName: string;
  token?: number;
}
