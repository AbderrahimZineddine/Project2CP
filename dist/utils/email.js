"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const pug_1 = __importDefault(require("pug"));
class Email {
    to;
    firstName;
    otp;
    from;
    constructor(user, otp) {
        (this.to = user.email),
            (this.firstName = user.firstName),
            (this.otp = otp),
            (this.from = `Abderrahim Zineddine <${process.env.EMAIL_FROM}>`);
    }
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer_1.default.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
        }
        else {
            return nodemailer_1.default.createTransport({
                host: 'sandbox.smtp.mailtrap.io',
                port: 2525,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }
    }
    async send(template, subject) {
        // 1) render the html based on a pub template
        const html = pug_1.default.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            otp: this.otp,
            subject,
        });
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
        await this.send('welcome', 'Welcome to the EasyHome Family');
    }
    async sendPassswordReset() {
        await this.send('passwordReset', 'Your Password reset token (valid for only 10 minutes)');
    }
    async sendOTPEmail() {
        await this.send('verifyEmail', 'Your email verification code (valid for only 10 minutes)');
    }
}
exports.default = Email;
//# sourceMappingURL=email.js.map