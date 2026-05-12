import { EmailJSResponseStatus } from "@emailjs/browser";
import emailjs from "@emailjs/browser";
import { supabase } from "../config/supabaseClient";

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

export const sendTestMail = async () => {
  const htmlContent = `
     <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f7;
        font-family: "Segoe UI", Arial, sans-serif;
        color: #333333;
      }

      table {
        border-spacing: 0;
      }

      .container {
        width: 100%;
        padding: 40px 20px;
        background-color: #f4f4f7;
      }

      .card {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .header {
        padding: 40px 40px 20px;
        text-align: center;
      }

      .logo-text {
        font-size: 28px;
        font-weight: 700;
        color: #b91c1c;
        margin: 0;
      }

      .content {
        padding: 0 40px 20px;
        font-size: 15px;
        line-height: 1.8;
        color: #555555;
      }

      .greeting {
        font-size: 16px;
        font-weight: 600;
        color: #222222;
        margin-bottom: 20px;
      }

      .button-container {
        text-align: center;
        padding: 10px 40px 30px;
      }

      .btn {
        display: inline-block;
        background-color: #b91c1c;
        color: #ffffff !important;
        text-decoration: none;
        padding: 14px 32px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        transition: background-color 0.2s ease;
      }

      .btn:hover {
        background-color: #991b1b !important;
      }

      .link-box {
        background: #f8f8f8;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        padding: 12px;
        margin-top: 10px;
        word-break: break-all;
        font-size: 13px;
      }

      .link-box a {
        color: #0066cc;
        text-decoration: none;
      }

      .warning {
        margin: 0 40px 30px;
        background: #fff7e6;
        border-left: 4px solid #f59e0b;
        padding: 14px 16px;
        border-radius: 6px;
        font-size: 13px;
        line-height: 1.6;
        color: #92400e;
      }

      .footer {
        text-align: center;
        padding: 24px 40px 40px;
        font-size: 12px;
        line-height: 1.6;
        color: #888888;
        border-top: 1px solid #eeeeee;
      }

      @media only screen and (max-width: 600px) {
        .header,
        .content,
        .button-container,
        .footer {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }

        .warning {
          margin-left: 20px !important;
          margin-right: 20px !important;
        }

        .btn {
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="card">

        <div class="header">
          <h1 class="logo-text">HS Japan Academy</h1>
        </div>

        <div class="content">
          <div class="greeting">
            Hello,
          </div>

          <p>
            We received a request to reset your account password.
            Click the button below to create a new password.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>

        <div class="button-container">
          <a href="${resetLink}" class="btn">
            Reset Password
          </a>
        </div>

        <div class="content">
          <p style="margin-bottom: 8px;">
            If the button above does not work, copy and paste the following link into your browser:
          </p>

          <div class="link-box">
            <a href="${resetLink}">
              ${resetLink}
            </a>
          </div>
        </div>

        <div class="warning">
          <strong>Security Notice:</strong>
          This password reset link will expire in 24 hours for your security.
          Never share this link with anyone.
        </div>

        <div class="content" style="padding-bottom: 10px;">
          <p style="margin: 0;">
            Best regards,<br />
            <strong>HS Japan Academy</strong>
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 8px;">
            This is an automated email. Please do not reply to this message.
          </p>

          <p style="margin: 0;">
            © 2026 HS Japan Academy. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  </body>
</html>
  `;

  const { data, error } = await supabase.functions.invoke(
    "password_mail_send_2",
    {
      body: {
        to: "seum.cse@aust.edu",
        subject: "Hello",
        // content: "<h1>Hello from React</h1>",
        content: htmlContent,
      },
    },
  );

  console.log(data, error);
};

export const sendPasswordResetEmail = async (email, token, name = "") => {
  const baseURL = import.meta.env.VITE_APP_BASE_URL;
  const resetLink = `${baseURL}/auth/reset-password?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f7;
            font-family: "Segoe UI", Arial, sans-serif;
            color: #333333;
          }

          table {
            border-spacing: 0;
          }

          .container {
            width: 100%;
            padding: 40px 20px;
            background-color: #f4f4f7;
          }

          .card {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          .header {
            padding: 40px 40px 20px;
            text-align: center;
          }

          .logo-text {
            font-size: 28px;
            font-weight: 700;
            color: #b91c1c;
            margin: 0;
          }

          .content {
            padding: 0 40px 20px;
            font-size: 15px;
            line-height: 1.8;
            color: #555555;
          }

          .greeting {
            font-size: 16px;
            font-weight: 600;
            color: #222222;
            margin-bottom: 20px;
          }

          .button-container {
            text-align: center;
            padding: 10px 40px 30px;
          }

          .btn {
            display: inline-block;
            background-color: #b91c1c;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            transition: background-color 0.2s ease;
          }

          .btn:hover {
            background-color: #991b1b !important;
          }

          .link-box {
            background: #f8f8f8;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 12px;
            margin-top: 10px;
            word-break: break-all;
            font-size: 13px;
          }

          .link-box a {
            color: #0066cc;
            text-decoration: none;
          }

          .warning {
            margin: 0 40px 30px;
            background: #fff7e6;
            border-left: 4px solid #f59e0b;
            padding: 14px 16px;
            border-radius: 6px;
            font-size: 13px;
            line-height: 1.6;
            color: #92400e;
          }

          .footer {
            text-align: center;
            padding: 24px 40px 40px;
            font-size: 12px;
            line-height: 1.6;
            color: #888888;
            border-top: 1px solid #eeeeee;
          }

          @media only screen and (max-width: 600px) {
            .header,
            .content,
            .button-container,
            .footer {
              padding-left: 20px !important;
              padding-right: 20px !important;
            }

            .warning {
              margin-left: 20px !important;
              margin-right: 20px !important;
            }

            .btn {
              width: 100%;
              box-sizing: border-box;
              text-align: center;
            }
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="card">

            <div class="header">
              <h1 class="logo-text">HS Japan Academy</h1>
            </div>

            <div class="content">
              <div class="greeting">
                Hello ${name || "User"},
              </div>

              <p>
                We received a request to reset your account password.
                Click the button below to create a new password.
              </p>

              <p>
                If you did not request a password reset, you can safely ignore this email.
              </p>
            </div>

            <div class="button-container">
              <a href="${resetLink}" class="btn">
                Reset Password
              </a>
            </div>

            <div class="content">
              <p style="margin-bottom: 8px;">
                If the button above does not work, copy and paste the following link into your browser:
              </p>

              <div class="link-box">
                <a href="${resetLink}">
                  ${resetLink}
                </a>
              </div>
            </div>

            <div class="warning">
              <strong>Security Notice:</strong>
              This password reset link will expire in 24 hours for your security.
              Never share this link with anyone.
            </div>

            <div class="content" style="padding-bottom: 10px;">
              <p style="margin: 0;">
                Best regards,<br />
                <strong>HS Japan Academy</strong>
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0 0 8px;">
                This is an automated email. Please do not reply to this message.
              </p>

              <p style="margin: 0;">
                © 2026 HS Japan Academy. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await supabase.functions.invoke(
      "password_mail_send_2",
      {
        body: {
          to: email,
          subject: "Reset Your Password - HS Japan Academy",
          content: htmlContent,
        },
      },
    );

    if (error) {
      console.error("Failed to send password reset email:", error);
      throw new Error(error.message || "Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
