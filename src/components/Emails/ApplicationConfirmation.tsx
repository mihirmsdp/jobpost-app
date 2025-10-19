import * as React from 'react';

interface ApplicationConfirmationEmailProps {
  applicantName: string;
  jobTitle: string;
  companyName: string;
}

export const ApplicationConfirmationEmail: React.FC<Readonly<ApplicationConfirmationEmailProps>> = ({
  applicantName,
  jobTitle,
  companyName,
}) => (
  <div>
    <h1>Hi {applicantName},</h1>
    <p>
      Thank you for applying for the <strong>{jobTitle}</strong> position
      at <strong>{companyName}</strong>.
    </p>
    <p>
      We have received your application and will review it shortly. We appreciate your interest in joining our team.
    </p>
    <p>Best regards,</p>
    <p>The {companyName} Team</p>
  </div>
);