const nodeMailer = require("nodemailer");

exports.sendEmail = async (options) => {
    // const transporter = nodeMailer.createTransport({
        // host: process.env.SMPT_HOST,
        // port: 465,
        // auth: {
        //   user: process.env.SMPT_MAIL,
        //   pass: process.env.SMPT_PASSWORD,
        // },
        // service:process.env.SMPT_SERVICE
    const transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "9254df525c72b2",
          pass: "2f2b58c7742d2b"
        }
      });

  const mailOptions = {
    from: process.env.SMPT_MAIL, //our mail from which we are sending
    to: options.email,
    subject: options.subject,
    text: options.message, //send message in body og options
  };

  await transporter.sendMail(mailOptions);
};