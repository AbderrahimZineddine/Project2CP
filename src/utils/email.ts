import nodemailer from 'nodemailer';
import pug from 'pug';
import htmlToText from 'html-to-text';
import { UserDoc } from 'models/UserDoc';
import catchAsync from './catchAsync';

export default class Email {
  to: string;
  firstName: any;
  otp: string;
  from: string;
  constructor(user: UserDoc, otp: string) {
    (this.to = user.email),
      (this.firstName = user.firstName),
      (this.otp = otp),
      (this.from = `Abderrahim Zineddine <${process.env.EMAIL_FROM}>`);
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async send(template: string, subject: string) {
    // 1) render the html based on a pub template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        otp: this.otp,
        subject,
      }
    );

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: html,
      text: ' text was errorr',
      // text: htmlToText.convert(html),
    };

    // 3) Create a transport and send the email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }
  async sendPassswordReset() {
    await this.send(
      'passwordReset',
      'Your Password reset token (valid for only 10 minutes)'
    );
  }
  async sendOTPEmail() {
    await this.send(
      'verifyEmail',
      'Your email verification code (valid for only 10 minutes)'
    );
  }
}
