import { EmailJSResponseStatus } from "@emailjs/browser";
import emailjs from "@emailjs/browser";

export const sendInviteEmail = async (email, token, name = "") => {
  // const baseURL = import.meta.env.VITE_APP_BASE_URL_DEV; 
  const baseURL = import.meta.env.VITE_APP_BASE_URL; 
  const inviteLink = `${baseURL}/auth/setup-password?token=${token}`;

  const templateParams = {
    user_name: name || "User", // Falls back to "User" if name is empty
    to_email: email,
    link: inviteLink, // This replaces {{link}} in your EmailJS template
  };

  try {
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_SET_PASS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      },
    );

    // console.log(" Invite email sent successfully!", response.text);
    return response;
  } catch (error) {
    console.error(" Failed to send invite email:", error.text || error);
    throw error; // Let the caller handle the error if needed
  }
};
