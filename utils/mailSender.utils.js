const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    console.log("Email:", email);
    console.log("Title:", title);
    console.log("Body:", body);
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: "gunnikij1665@gmail.com",
                pass: "siqruurwyjeyefru",
            },
        });

        // send mail by using transporter
        let info = await transporter.sendMail({
            from: "Himalaya Carpets",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        return info;
    } catch (error) {
        console.log("Error From Mail Sender - >", error.message);
        throw new Error("Error While Sending The Email");
    }
};

module.exports = mailSender;
