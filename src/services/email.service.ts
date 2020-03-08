import env from '../environment/env';
const mailgun = require('mailgun-js')({apiKey: env.MAILGUN_KEY, domain: 'app.multicryptominetrade.com'});
import * as mjml2html from 'mjml'


class EmailService {
    private companyName = 'Bureaudchange'
    private baseUrl = 'https://bureaudchange-1.firebaseapp.com'
    send(emailType: string, payload: {email?: string, token: string, firstName: string, baseUrl: string}) {     
      this.baseUrl =    payload.baseUrl || this.baseUrl;
        const data = {
            from: 'Bureaudchange <admin@Bureaudchange.com>',
            to: payload.email,
            subject: 'Verify Email Address',
            text: 'This is a test email',
            html: this.getHtmlTemplate({}, payload)
          };
          mailgun.messages().send(data, (error, body) => {
              if(error) {
                  console.log(body);
                   
                  return body
                } else { 
                    console.log(body);
                return body
            }
          });
    }
    private getHtmlTemplate(options: object, paylaod?: {firstName: string, token: string}) {
        const htmlOutput = mjml2html(`
        <mjml>
        <mj-body background-color="#ffffff" font-size="13px">
          <mj-section background-color="#009FE3" vertical-align="top" padding-bottom="0px" padding-top="0">
            <mj-column vertical-align="top" width="100%">
              <mj-text align="center" color="#ffffff" font-size="40px"  font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="30px" padding-top="50px">
                ${this.companyName}
              </mj-text>
            </mj-column>
          </mj-section>
          <mj-section background-color="#009fe3" padding-bottom="20px" padding-top="20px">
            <mj-column vertical-align="middle" width="100%">
              <mj-text align="left" color="#ffffff" font-size="22px" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px"><span style="color:#FEEB35">
                Hello ${paylaod.firstName}</span><br /><br /> Welcome to ${this.companyName}.</mj-text>
              <mj-text align="left" color="#ffffff" font-size="15px" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px">
               Thanks for joining ${this.companyName}, please confirm that your email address is correct to continue, 
               click the link below to get started
              </mj-text>
              <mj-button align="left" href="${this.baseUrl}/auth/comfirm-email/${paylaod.token}" font-size="22px" font-weight="bold" background-color="#ffffff" border-radius="10px" color="#1AA0E1" font-family="open Sans Helvetica, Arial, sans-serif">Confirm Email</mj-button>
              <mj-text align="left" color="#ffffff" font-size="15px" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px">Thanks, <br /> The ${this.companyName} Team</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
      `, options);      
      return htmlOutput.html
    }
}
export default new EmailService