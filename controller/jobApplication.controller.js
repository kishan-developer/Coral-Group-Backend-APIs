const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const JobApplication = require("../model/JobApplication.model");

const SITE_URL = process.env.SITE_URL || "http://localhost:3000";
const LOGO_URL = `${SITE_URL}/Coral_Logo_White.png`;

const createTransporter = () =>
    nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
        tls: { rejectUnauthorized: false },
    });

// @desc    Submit job application
// @route   POST /api/v1/careers/apply
// @access  Public
exports.submitApplication = asyncHandler(async (req, res) => {
    const { fullName, email, phone, position, experience, coverLetter } = req.body;

    if (!fullName || !email || !phone) {
        return res.status(400).json({ success: false, message: "Full name, email and phone are required." });
    }

    const application = await JobApplication.create({ fullName, email, phone, position, experience, coverLetter });

    res.status(201).json({
        success: true,
        message: "Application submitted successfully. We will be in touch soon.",
        data: { _id: application._id, fullName, email, phone, position },
    });

    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return;

    const transporter = createTransporter();

    const candidateHtml = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#111;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111;padding:30px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#94cb3d,#5a8a1a);padding:36px 40px;text-align:center;">
        <img src="${LOGO_URL}" width="150" alt="Coral Group" style="display:block;margin:0 auto 10px;" />
        <p style="color:rgba(255,255,255,0.85);margin:0;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Careers at Coral Group</p>
      </td></tr>
      <tr><td style="background:#1a1a1a;padding:40px;">
        <h2 style="color:#94cb3d;margin:0 0 8px;font-size:20px;">Application Received ✓</h2>
        <p style="color:#ccc;margin:0 0 20px;">Dear <strong style="color:#fff;">${fullName}</strong>,</p>
        <p style="color:#aaa;font-size:14px;line-height:1.7;margin:0 0 24px;">
          Thank you for applying to <strong style="color:#fff;">${position || "Coral Group"}</strong>. We have received your application and our HR team will review it shortly.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#242424;border-left:4px solid #94cb3d;border-radius:0 8px 8px 0;margin-bottom:28px;">
          <tr><td style="padding:20px 24px;">
            <p style="color:#94cb3d;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 12px;">Application Summary</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="color:#888;font-size:13px;padding:5px 0;width:40%;">Position</td><td style="color:#fff;font-size:13px;padding:5px 0;">${position || "General Application"}</td></tr>
              <tr><td style="color:#888;font-size:13px;padding:5px 0;">Email</td><td style="color:#fff;font-size:13px;padding:5px 0;">${email}</td></tr>
              <tr><td style="color:#888;font-size:13px;padding:5px 0;">Phone</td><td style="color:#fff;font-size:13px;padding:5px 0;">${phone}</td></tr>
              ${experience ? `<tr><td style="color:#888;font-size:13px;padding:5px 0;">Experience</td><td style="color:#fff;font-size:13px;padding:5px 0;">${experience}</td></tr>` : ""}
            </table>
          </td></tr>
        </table>
        <p style="color:#aaa;font-size:13px;margin:0 0 30px;">Our team typically responds within 3–5 business days. We appreciate your patience.</p>
        <p style="color:#666;font-size:12px;margin:0;">Best regards,<br><strong style="color:#94cb3d;">Coral Group HR Team</strong></p>
      </td></tr>
      <tr><td style="background:#141414;padding:20px 40px;text-align:center;border-top:1px solid #2a2a2a;">
        <p style="color:#555;font-size:11px;margin:0;">Coral Group | info@coral-group.in | (+91) 780-000-0097</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

    const adminHtml = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#111;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111;padding:30px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;">
      <tr><td style="background:#1a1a1a;padding:24px 40px;border-bottom:3px solid #94cb3d;">
        <table width="100%"><tr>
          <td><img src="${LOGO_URL}" width="110" alt="Coral Group" style="display:block;" /></td>
          <td align="right"><span style="background:#94cb3d;color:#000;font-size:11px;font-weight:700;padding:6px 14px;border-radius:20px;">💼 New Application</span></td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#94cb3d;padding:14px 40px;text-align:center;">
        <h2 style="color:#000;margin:0;font-size:17px;font-weight:800;">New Job Application — Review Required</h2>
      </td></tr>
      <tr><td style="background:#1a1a1a;padding:36px 40px;">
        <p style="color:#aaa;font-size:14px;margin:0 0 20px;">Received on <strong style="color:#94cb3d;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</strong></p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#242424;border-radius:10px;overflow:hidden;margin-bottom:20px;">
          <tr><td style="background:#94cb3d;padding:10px 20px;"><p style="color:#000;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin:0;">👤 Applicant Details</p></td></tr>
          <tr><td style="padding:16px 20px 4px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="color:#666;font-size:13px;padding:7px 0;border-bottom:1px solid #2e2e2e;width:35%;">Name</td><td style="color:#fff;font-size:13px;padding:7px 0;border-bottom:1px solid #2e2e2e;font-weight:600;">${fullName}</td></tr>
              <tr><td style="color:#666;font-size:13px;padding:7px 0;border-bottom:1px solid #2e2e2e;">Email</td><td style="font-size:13px;padding:7px 0;border-bottom:1px solid #2e2e2e;"><a href="mailto:${email}" style="color:#94cb3d;text-decoration:none;">${email}</a></td></tr>
              <tr><td style="color:#666;font-size:13px;padding:7px 0;border-bottom:1px solid #2e2e2e;">Phone</td><td style="font-size:13px;padding:7px 0;border-bottom:1px solid #2e2e2e;"><a href="tel:${phone}" style="color:#94cb3d;text-decoration:none;">${phone}</a></td></tr>
              <tr><td style="color:#666;font-size:13px;padding:7px 0;border-bottom:1px solid #2e2e2e;">Position</td><td style="color:#fff;font-size:13px;padding:7px 0;border-bottom:1px solid #2e2e2e;">${position || "General Application"}</td></tr>
              ${experience ? `<tr><td style="color:#666;font-size:13px;padding:7px 0;border-bottom:1px solid #2e2e2e;">Experience</td><td style="color:#fff;font-size:13px;padding:7px 0;border-bottom:1px solid #2e2e2e;">${experience}</td></tr>` : ""}
              ${coverLetter ? `<tr><td style="color:#666;font-size:13px;padding:7px 0;vertical-align:top;">Cover Letter</td><td style="color:#fff;font-size:13px;padding:7px 0;">${coverLetter}</td></tr>` : ""}
            </table>
          </td></tr>
        </table>
        <p style="color:#888;font-size:13px;text-align:center;background:#242424;padding:12px;border-radius:8px;margin:0;">⚡ Review and respond within <strong style="color:#94cb3d;">3–5 business days</strong>.</p>
      </td></tr>
      <tr><td style="background:#141414;padding:18px 40px;text-align:center;border-top:1px solid #2a2a2a;">
        <p style="color:#444;font-size:11px;margin:0;">Coral Group HR Notification</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

    Promise.all([
        transporter.sendMail({
            from: `"Coral Group Careers" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `✅ Application Received — ${position || "Coral Group"}`,
            html: candidateHtml,
        }),
        transporter.sendMail({
            from: `"Coral Group Website" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || "info@coral-group.in",
            replyTo: `"${fullName}" <${email}>`,
            subject: `💼 New Job Application: ${fullName} — ${position || "General"}`,
            html: adminHtml,
        }),
    ])
        .then(() => console.log(`Job application emails sent: ${email}`))
        .catch((err) => console.error("Job application email failed:", err.message));
});
