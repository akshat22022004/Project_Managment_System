import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendEmail = async (options) => {
   const mailGenerator =  new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://taskmanagerlink.com"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHtml = mailGenerator.generate(options.mailgenContent)
    
    const transporter =nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }

    })

    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    }

    try {
      await transporter.sendMail(mail)
    }catch(err){
        console.error("email service failed silently make sure that u have provided ur mail trap credentials in the  .env file" , err) 
    }
}
const emailVerficationMailgenContent = (username , verificationUrl) =>{
  return {
    body: {
        name: username,
        intro: "Welcome to our app ! We're very excited to have you on board.",
        action: {
          instructions: "To verify the email, please click here:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Verify your Email",
            link: verificationUrl
          },
        },
        outro: "Need help, or have questions? Just reply to this email, we'd love to help." 
    },
  };
}
const forgotPasswordMailgenContent = (username , passwordResetUrl) =>{
  return {
    body: {
        name: username,
        intro: "We got a request to reset your password",
        action: {
          instructions: "To reset your password, please click here:",
          button: {
            color: "#2d5c41ff", // Optional action button color
            text: "Verify your Email",
            link: passwordResetUrl
          },
        },
        outro: "Need help, or have questions? Just reply to this email, we'd love to help." 
    },
  };
}

export {emailVerficationMailgenContent , forgotPasswordMailgenContent , sendEmail}  

