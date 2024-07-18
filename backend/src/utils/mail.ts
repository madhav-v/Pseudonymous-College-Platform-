import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

class MailService {
  connection: any; // Adjust the type according to nodemailer.createTransport return type
  constructor() {
    this.connection = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "madhavdhungana36@gmail.com",
        pass: "dwdi dejm wgmy vsze",
      },
    });
  }

  sendMail = async (
    to: string,
    subject: string,
    content: string
  ): Promise<boolean> => {
    try {
      let msg = {
        from: "Admin User",
        to: to,
        subject: subject,
        html: content,
      };
      let response = await this.connection.sendMail(msg);
      return true;
    } catch (exception) {
      console.log("Email Exception", exception);
      return false;
    }
  };
}

const mailSvc = new MailService();
export default mailSvc;
