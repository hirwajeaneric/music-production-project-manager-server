const nodemailer = require('nodemailer');

exports.newEmail = async (req, res) => {
    try {
        const { email, subject, text } = req.body;
        const sent = await sendEmail(email, subject, text);
        res.status(200).send(`Email sent successful! : ${sent}`);
    } catch (error) {
        res.status(500).send(error);
    }
}

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hirwaminerve25@gmail.com',
                pass: 'yiudzvlcmksmzfer',
            },
        });

        const options = {
            from: "hirwaminerve25@gmail.com",
            to: email,
            subject: subject,
            text: text
        };

        //Send email
        await transporter.sendMail(options, function(error, infor) {
            if (error) {
                console.log("Failed to save email: "+error);
                return error;
            } else {
                console.log("Email Sent: "+infor.response);
                return "Email Sent: "+infor.response;
            }
        });
    } catch (error) {
        return error;
    }
}