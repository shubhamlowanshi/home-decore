import transporter
from "../services/mail.service.js";

export const sendMail = async ( req, res) => {
  try {
    const {
      email,
      subject,
      message,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Recipient email is required",
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Subject and message are required",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,

      to: email,

      subject,

      html: message,
    };

    const info =
      await transporter.sendMail(
        mailOptions
      );

    res.status(200).json({
      success: true,

      message:
        "Email sent successfully",

      messageId: info.messageId,
    });
  } catch (error) {
    console.error(
      "Email Error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to send email",
    });
  }
};