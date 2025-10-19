// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { renderAsync } from "npm:@react-email/render";
import * as React from "npm:react";

// Import email components
import ApplicationConfirmationEmail from "./emails/ApplicationConfirmation.tsx";
import { StatusUpdateEmail } from "./emails/StatusUpdate.tsx";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, subject, template, props } = await req.json();

    // Validate required fields
    if (!to || !subject || !template) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: to, subject, template",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Render the appropriate email template
    let emailHtml: string;

    if (template === "application-confirmation") {
      emailHtml = await renderAsync(
        React.createElement(ApplicationConfirmationEmail, props)
      );
    } else if (template === "status-update") {
      emailHtml = await renderAsync(
        React.createElement(StatusUpdateEmail, props)
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid email template specified" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "JobPost <onboarding@resend.dev>", // Change to your verified domain
        to: to,
        subject: subject,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API Error:", data);
      return new Response(JSON.stringify({ error: data.message }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
