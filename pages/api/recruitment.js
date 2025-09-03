import formidable from "formidable";
import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

const formTypeMap = {
  recruitment: "Recruitment",
  talentcub: "Talentcub",
  event: "eventRegistrations",
  feedback: "feedbackResponses",
  contact: "contactMessages",
  partnership: "Partnerships",
  sponsorship: "Sponsorships",
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: "./public/uploads",
      keepExtensions: true,
    });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

const sanitize = (str) =>
  String(str || "")
    .replace(/[<>]/g, "")
    .trim();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);
    const formType = sanitize(fields.formType || "").toLowerCase();
    const collectionName = formTypeMap[formType];

    if (!collectionName) {
      return res.status(400).json({ message: "Invalid form type" });
    }

    const fullName = sanitize(fields.fullName);
    const email = sanitize(fields.email);
    if (!fullName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const metadata = {
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
      submittedAt: new Date(),
    };

    const cvPath = files.cv?.[0]?.filepath || null;
    const cvFilename = files.cv?.[0]?.originalFilename || null;

    const sanitizedFields = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, sanitize(value)])
    );

    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db("LamidForms");

    await db.collection(collectionName).insertOne({
      ...sanitizedFields,
      cvFilename,
      ...metadata,
    });

    await client.close();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: `New ${collectionName} Submission: ${fullName}`,
      html: `
        <h3>New Submission Received</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Form Type:</strong> ${collectionName}</p>
        ${cvFilename ? `<p><strong>CV:</strong> ${cvFilename}</p>` : ""}
      `,
      attachments: cvPath ? [{ filename: cvFilename, path: cvPath }] : [],
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for your ${collectionName} submission`,
      html: `
        <p>Hi ${fullName},</p>
        <p>Thank you for submitting your ${collectionName} form. We’ve received it and will be in touch soon.</p>
        <p>Warm regards,<br/>Lamid Team</p>
      `,
    });

    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
