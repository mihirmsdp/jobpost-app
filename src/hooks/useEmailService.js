// src/hooks/useEmailService.js
import { supabase } from "../lib/supabase";

export const useEmailService = () => {
  const sendApplicationConfirmation = async (
    applicantEmail,
    applicantName,
    jobTitle,
    companyName
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          to: applicantEmail,
          subject: `Application Received - ${jobTitle} at ${companyName}`,
          template: "application-confirmation",
          props: {
            applicantName,
            jobTitle,
            companyName,
          },
        },
      });

      if (error) throw error;
      console.log("Confirmation email sent:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
      return { success: false, error: error.message };
    }
  };

  const sendStatusUpdate = async (
    applicantEmail,
    applicantName,
    jobTitle,
    newStatus
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          to: applicantEmail,
          subject: `Application Status Update - ${jobTitle}`,
          template: "status-update",
          props: {
            applicantName,
            jobTitle,
            status: newStatus,
          },
        },
      });

      if (error) throw error;
      console.log("Status update email sent:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Failed to send status email:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    sendApplicationConfirmation,
    sendStatusUpdate,
  };
};