// supabase/functions/send-email/emails/ApplicationConfirmation.tsx
import * as React from "npm:react";

interface ApplicationConfirmationEmailProps {
  applicantName: string;
  jobTitle: string;
  companyName: string;
}

export default function ApplicationConfirmationEmail({
  applicantName,
  jobTitle,
  companyName,
}: ApplicationConfirmationEmailProps) {
  return React.createElement(
    "div",
    {
      style: {
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9fafb",
        padding: "40px 0",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
        },
      },
      React.createElement("h1", null, `Hi ${applicantName},`),
      React.createElement(
        "p",
        null,
        `Thank you for applying for the `,
        React.createElement("strong", null, jobTitle),
        ` position at `,
        React.createElement("strong", null, companyName),
        `.`
      ),
      React.createElement(
        "p",
        null,
        "We have received your application and will review it shortly. We appreciate your interest in joining our team."
      ),
      React.createElement("p", null, "Best regards,"),
      React.createElement("p", null, `The ${companyName} Team`)
    )
  );
}
