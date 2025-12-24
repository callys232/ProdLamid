import formidable from "formidable";
import { MongoClient } from "mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({
    keepExtensions: true,
    uploadDir: "./public/uploads",
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ message: "Form parsing error" });
    }

    const { formType, ...formData } = fields;

    if (!formType)
      return res.status(400).json({ message: "Missing form type" });

    const validTypes = [
      "recruitment",
      "talentcub",
      "event",
      "feedback",
      "contact",
    ];
    if (!validTypes.includes(formType.toLowerCase())) {
      return res.status(400).json({ message: "Invalid form type" });
    }

    try {
      const client = new MongoClient(process.env.MONGO_URI);
      await client.connect();

      const db = client.db("LamidForms");
      const collection = db.collection(getCollectionName(formType));

      await collection.insertOne({
        ...formData,
        cvFilename: files.cv?.[0]?.originalFilename || null,
        submittedAt: new Date(),
      });

      await client.close();
      res.status(200).json({ message: "Form submitted successfully" });
    } catch (err) {
      console.error("MongoDB error:", err);
      res.status(500).json({ message: "Database error" });
    }
  });
}

function getCollectionName(formType) {
  const map = {
    recruitment: "Recruitment",
    talentcub: "Talentcub",
    event: "eventRegistrations",
    feedback: "feedbackResponses",
    contact: "contactMessages",
  };
  return map[formType.toLowerCase()] || "miscForms";
}
