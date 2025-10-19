import * as React from 'react';

interface StatusUpdateEmailProps {
  applicantName: string;
  jobTitle: string;
  status: string;
}

export const StatusUpdateEmail: React.FC<Readonly<StatusUpdateEmailProps>> = ({
  applicantName,
  jobTitle,
  status,
}) => (
  <div>
    <h1>Hi {applicantName},</h1>
    <p>
      We have an update on your application for the <strong>{jobTitle}</strong> position.
    </p>
    <p>
      Your new status is: <strong>{status.toUpperCase()}</strong>.
    </p>
    <p>We will keep you informed of any next steps.</p>
    <p>Best regards,</p>
  </div>
);