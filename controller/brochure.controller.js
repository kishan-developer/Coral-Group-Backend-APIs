const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const BrochureRequest = require("../model/BrochureRequest.model");

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Submit brochure request
exports.submitBrochureRequest = asyncHandler(async (req, res) => {
  const { name, email, phone, address, message, budget, projectType, brochureType, brochureTitle } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !address || !projectType || !brochureType || !brochureTitle) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  try {
    // Save to database
    const brochureRequest = await BrochureRequest.create({
      name,
      email,
      phone,
      address,
      message,
      budget,
      projectType,
      brochureType,
      brochureTitle,
    });

    // Send email to user
    const userMailOptions = {
      from: `"Coral Group" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your ${brochureTitle} Brochure - Coral Group`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #94cb3d 0%, #7ab532 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Coral Group</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Thank you for your interest</p>
          </div>
          <div style="background: #1e1e1e; padding: 30px; border-radius: 0 0 10px 10px; color: white;">
            <h2 style="color: #94cb3d; margin-top: 0;">Brochure Request Confirmed</h2>
            <p>Dear ${name},</p>
            <p>Thank you for requesting the <strong>${brochureTitle}</strong> brochure from Coral Group.</p>
            <p>Your request has been received and our team will contact you shortly to discuss your requirements.</p>
            <div style="background: rgba(148, 203, 61, 0.1); border-left: 4px solid #94cb3d; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Request Details:</strong></p>
              <p style="margin: 5px 0;">Brochure: ${brochureTitle}</p>
              <p style="margin: 5px 0;">Email: ${email}</p>
              <p style="margin: 5px 0;">Phone: ${phone}</p>
              <p style="margin: 5px 0;">Address: ${address}</p>
              <p style="margin: 5px 0;">Project Type: ${projectType.toUpperCase()}</p>
              ${budget ? `<p style="margin: 5px 0;">Budget: ${budget}</p>` : ''}
              ${message ? `<p style="margin: 5px 0;">Message: ${message}</p>` : ''}
            </div>
            <p>You can download the brochure directly from our website or wait for our executive to assist you.</p>
            <p style="margin-top: 30px; color: #888;">Best regards,<br>Coral Group Team</p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Phone: (+91) 780-000-0097 | Email: info@coral-group.in
            </p>
          </div>
        </div>
      `,
    };

    // Send email to admin
    const adminMailOptions = {
      from: `"Coral Group Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || "info@coral-group.in",
      subject: `New Brochure Request - ${brochureTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #94cb3d 0%, #7ab532 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Coral Group</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">New Brochure Request</p>
          </div>
          <div style="background: #1e1e1e; padding: 30px; border-radius: 0 0 10px 10px; color: white;">
            <h2 style="color: #94cb3d; margin-top: 0;">Lead Details</h2>
            <div style="background: rgba(148, 203, 61, 0.1); border-left: 4px solid #94cb3d; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 5px 0;"><strong>Address:</strong> ${address}</p>
              <p style="margin: 5px 0;"><strong>Project Type:</strong> ${projectType.toUpperCase()}</p>
              ${budget ? `<p style="margin: 5px 0;"><strong>Budget:</strong> ${budget}</p>` : ''}
              ${message ? `<p style="margin: 5px 0;"><strong>Message:</strong> ${message}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Brochure Requested:</strong> ${brochureTitle}</p>
              <p style="margin: 5px 0;"><strong>Brochure Type:</strong> ${brochureType}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p style="color: #888;">Please follow up with this lead promptly.</p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    res.status(200).json({
      success: true,
      message: "Brochure request submitted successfully. Please check your email for confirmation.",
      data: {
        name,
        email,
        phone,
        address,
        message,
        budget,
        projectType,
        brochureType,
        brochureTitle,
      },
    });
  } catch (error) {
    console.error("Brochure request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit brochure request. Please try again later.",
    });
  }
});
