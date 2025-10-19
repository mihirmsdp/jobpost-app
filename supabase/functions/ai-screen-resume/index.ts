import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.21.0";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY not configured");
}

Deno.serve(async (req: Request) => {
  try {
    console.log("=== AI Resume Screening Started ===");

    const authHeader = req.headers.get("Authorization");
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    const payload = await req.json();
    const applicationId = payload.applicationId;

    if (!applicationId) {
      throw new Error("Missing applicationId");
    }

    console.log("Processing application:", applicationId);

    // Get application data
    const { data: appData, error: appError } = await supabaseClient
      .from("applications")
      .select("resume_url, job_id")
      .eq("id", applicationId)
      .single();

    if (appError || !appData) {
      throw new Error("Application not found");
    }

    // Extract resume path
    const resumeUrl = appData.resume_url;
    if (!resumeUrl || resumeUrl === "pending") {
      throw new Error("Resume URL not ready");
    }

    const urlObj = new URL(resumeUrl);
    const pathParts = urlObj.pathname.split("/applications/");
    const resumePath = pathParts[1];

    console.log("Downloading resume:", resumePath);

    // Download resume
    const { data: fileData, error: downloadError } =
      await supabaseClient.storage.from("applications").download(resumePath);

    if (downloadError) {
      throw new Error("Failed to download resume");
    }

    const fileSizeInMB = fileData.size / (1024 * 1024);
    console.log("File size:", fileSizeInMB.toFixed(2), "MB");

    if (fileSizeInMB > 10) {
      throw new Error("File too large (max 10MB)");
    }

    // Convert to base64 in chunks
    const buffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    let binaryString = "";
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(
        i,
        Math.min(i + chunkSize, uint8Array.length)
      );
      binaryString += String.fromCharCode(...chunk);
    }
    const base64Data = btoa(binaryString);

    console.log("Base64 conversion complete");

    // Get job data
    const { data: jobData, error: jobError } = await supabaseClient
      .from("jobs")
      .select("title, description, requirements")
      .eq("id", appData.job_id)
      .single();

    if (jobError) {
      throw new Error("Job not found");
    }

    console.log("Job found:", jobData.title);

    // Initialize Gemini with the official SDK
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const prompt = `You are an AI recruiter. Analyze this resume against the job posting below.

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "score": <number 0-100>,
  "summary": "<brief 2-3 sentence explanation>"
}

JOB POSTING:
Title: ${jobData.title}

Description:
${jobData.description}

Requirements:
${jobData.requirements}

Evaluate the candidate's experience, skills, and fit for this role.`;

    console.log("Calling Gemini 2.0 Flash via SDK...");

    // Generate content with PDF
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Data,
        },
      },
    ]);

    const response = await result.response;
    const responseText = response.text();

    console.log("Raw AI response:", responseText.substring(0, 150));

    // Parse JSON
    const cleanedText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let aiResponse;
    try {
      aiResponse = JSON.parse(cleanedText);

      if (
        typeof aiResponse.score !== "number" ||
        aiResponse.score < 0 ||
        aiResponse.score > 100
      ) {
        throw new Error("Invalid score");
      }
      if (
        typeof aiResponse.summary !== "string" ||
        !aiResponse.summary.trim()
      ) {
        throw new Error("Invalid summary");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      throw new Error("Failed to parse AI response");
    }

    console.log("AI Score:", aiResponse.score);

    // Update application
    const { error: updateError } = await supabaseClient
      .from("applications")
      .update({
        ai_score: aiResponse.score,
        ai_summary: aiResponse.summary,
        ai_raw_response: aiResponse,
      })
      .eq("id", applicationId);

    if (updateError) {
      throw new Error("Failed to update application");
    }

    console.log("=== Success ===");

    return new Response(
      JSON.stringify({
        success: true,
        applicationId,
        score: aiResponse.score,
        summary: aiResponse.summary,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("=== ERROR ===");
    console.error("Message:", error.message);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
