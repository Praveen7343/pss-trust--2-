import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import nodemailer from "nodemailer";
import fs from "fs";
import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase env vars')
const supabase = createClient(supabaseUrl, supabaseKey)
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/students", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.post("/api/fee-applications", upload.single('file'), async (req, res) => {
    try {
      const appData = JSON.parse(req.body.data);
      let fileUrl = null;

      if (req.file) {
        const fileBuffer = fs.readFileSync(req.file.path);
        const fileName = `${Date.now()}-${req.file.originalname}`;

        const { data: storageData, error: storageError } = await supabase
          .storage
          .from('faces')         // reuse the existing bucket, or create a new one
          .upload(`applications/${fileName}`, fileBuffer, {
            contentType: req.file.mimetype,
          });

        if (storageError) throw storageError;

        const { data: urlData } = supabase
          .storage
          .from('faces')
          .getPublicUrl(`applications/${fileName}`);

        fileUrl = urlData.publicUrl;
        fs.unlinkSync(req.file.path); // delete temp local file
      }

      const { error } = await supabase
        .from('applications')
        .insert([{ ...appData, file_url: fileUrl, academic_data: appData.academicRecords }]);

      if (error) throw error;
      res.status(201).json({ message: "Fee application submitted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save fee application" });
    }
  });

  // Serve uploads
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.post("/api/fee-applications", upload.single('file'), async (req, res) => {
    try {
      const appData = JSON.parse(req.body.data);
      const fileName = req.file ? req.file.filename : null;

      // In a real app, we would upload the file to Supabase Storage
      // For now, we'll keep it local or just store the filename
      
      const { error } = await supabase
        .from('applications')
        .insert([{
          ...appData,
          file_url: fileName ? `/uploads/${fileName}` : null,
          academic_data: appData.academicRecords
        }]);

      if (error) throw error;
      res.status(201).json({ message: "Fee application submitted successfully" });
    } catch (error) {
      console.error("Error saving fee application:", error);
      res.status(500).json({ error: "Failed to save fee application" });
    }
  });

  app.post("/api/verify-student", async (req, res) => {
    try {
      const { fullName, trustId } = req.body;
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('full_name', fullName)
        .eq('sid', trustId)    // ← was trust_id, must be sid
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

      if (data) {
        res.json({ success: true, student: data });
      } else {
        res.status(404).json({ success: false, message: "Student not found with these credentials." });
      }
    } catch (error) {
      console.error("Error verifying student:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  app.get("/api/fee-applications", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data.map(app => ({
        ...app,
        academicRecords: app.academic_data || []
      })));
    } catch (error) {
      console.error("Error fetching fee applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.patch("/api/fee-applications/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const { data: application, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !application) {
        return res.status(404).json({ error: "Application not found" });
      }

      const { error: updateError } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;

      if (status === 'approved' && process.env.SMTP_USER) {
        const mailOptions = {
          from: `"PSS Trust" <${process.env.SMTP_USER}>`,
          to: application.email,
          subject: "Fee Application Approved - PSS Trust",
          text: `Dear ${application.full_name},\n\nYour fee application (ID: ${application.trust_id}) has been approved by the Chairman.\n\nPlease contact the office for further instructions.\n\nRegards,\nPSS Trust Team`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #0f172a;">Application Approved</h2>
              <p>Dear <strong>${application.full_name}</strong>,</p>
              <p>Your fee application (ID: <strong>${application.trust_id}</strong>) has been <strong>approved</strong> by the Chairman.</p>
              <p>Please contact the office for further instructions regarding the next steps.</p>
              <br/>
              <p>Regards,<br/><strong>PSS Trust Team</strong></p>
            </div>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      } else if (status === 'approved') {
        console.log(`[MOCK EMAIL] To: ${application.email}`);
        console.log(`Subject: Fee Application Approved - PSS Trust`);
        console.log(`Body: Dear ${application.full_name}, your fee application (ID: ${application.trust_id}) has been approved by the Chairman. Please contact the office for further details.`);
      }

      res.json({ success: true, message: `Application ${status.toLowerCase()} successfully` });
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  // Email notification for approval
  app.post('/api/notify-approval', async (req, res) => {
    const { email, fullName, trustId } = req.body;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Fee Application Approved - PSS Trust',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #059669;">Application Approved!</h2>
          <p>Dear <strong>${fullName}</strong> (Trust ID: ${trustId}),</p>
          <p>Your application has been approved. You can proceed with fee payment.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
            <p>This is an automated message from PSS Trust. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error('Error sending approval email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
