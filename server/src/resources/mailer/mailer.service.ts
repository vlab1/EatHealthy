const nodemailer = require('nodemailer');
import SendMail from '@/resources/mailer/mailer.interface';

class MailerService {
    public async sendActivationMail(
        to: string,
        link: string
    ): Promise<SendMail | Error> {
        try {
            const emailActivationLink = `${process.env.SERVER_URL}/api/user/email/activate?emailActivationLink=${link}`;
            const transporter = nodemailer.createTransport({
                host: process.env.MAILER_SMPT_HOST,
                port: process.env.MAILER_SMPT_PORT,
                secure: false,
                auth: {
                    user: process.env.MAILER_SMPT_USER,
                    pass: process.env.MAILER_SMPT_PASSWORD,
                },
            });
            const sendMail = (await transporter.sendMail({
                from: process.env.MAILER_SMPT_USER,
                to,
                subject:
                    'Activating an account on the site ' +
                    process.env.SERVER_URL,
                html: `
              <head>
              <title>Account confirmation</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f6f6f6;
                }
                .container {
                  width: 80%;
                  margin: auto;
                  background-color: #fff;
                  padding: 20px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  text-align: center;
                }
                h1 {
                  color: #333;
                  font-size: 24px;
                  margin-top: 0;
                  margin-bottom: 20px;
                  text-align: center;
                }
                p {
                  font-size: 16px;
                  line-height: 1.5;
                  margin-bottom: 20px;
                }
                .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #fff;
                  color: blue;
                  text-decoration: none;
                  border-radius: 4px;
                  font-size: 16px;
                  outline:none;
                  border: 1px solid;
                  cursor: pointer;
                }
                a{
                  color: white;
                  text-decoration: none;
                }
                .ii {
                  color: white;
                  text-decoration: none;
                }
              </style>
              </head>
              <body>
                <div class="container">
                  <h1>Account confirmation</h1>
                  <p>To confirm your account, please click on the button below</p>
                  <a href="${emailActivationLink}" class="button">Confirm</a>
                </div>
              </body>
            `,
            })) as SendMail;
            return sendMail;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default MailerService;
