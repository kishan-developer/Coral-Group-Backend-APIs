const nodemailer = require("nodemailer");

const sendMail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,      // your Gmail
        pass: process.env.MAIL_PASSWORD,  // your Gmail App Password
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: to,
      subject: subject,
      html: `<p>${message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent:", info.messageId);

    return {
      success: true,
      message: "Email sent successfully",
      info,
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      message: "Email sending failed",
      error,
    };
  }
};

module.exports = sendMail;
