// supabase/functions/send-email/emails/StatusUpdate.tsx
import * as React from "npm:react";

interface StatusUpdateEmailProps {
  applicantName: string;
  jobTitle: string;
  status: string;
}

export const StatusUpdateEmail: React.FC<Readonly<StatusUpdateEmailProps>> = ({
  applicantName,
  jobTitle,
  status,
}) =>
  React.createElement(
    "div",
    null,
    React.createElement("h1", null, `Hi ${applicantName},`),
    React.createElement(
      "p",
      null,
      "We have an update on your application for the ",
      React.createElement("strong", null, jobTitle),
      " position."
    ),
    React.createElement(
      "p",
      null,
      "Your new status is: ",
      React.createElement("strong", null, status.toUpperCase()),
      "."
    ),
    React.createElement(
      "p",
      null,
      "We will keep you informed of any next steps."
    ),
    React.createElement("p", null, "Best regards,")
  );
