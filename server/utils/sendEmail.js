const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
   
    // console.log(`>>>> Attempting to send OTP to: ${options.email}`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_MAIL,     // Your Gmail (The Sender)
            pass: process.env.SMTP_PASSWORD, // Your 16-digit App Password
        },
    });

    const mailOptions = {
        from: `"ChatApp Support" <${process.env.SMTP_MAIL}>`,
        to: options.email, 
        subject: options.subject,
        text: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`>>>> Email successfully sent to: ${options.email}`);
    } catch (error) {
        console.error(">>>> SMTP ERROR:", error.message);
        throw new Error("Email could not be sent. Check your App Password.");
    }
};

module.exports = sendEmail;