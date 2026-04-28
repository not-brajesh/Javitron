# EmailJS Setup Guide for JAVITRON Team Submission

This guide will help you set up EmailJS to receive team member submissions directly to your email.

---

## 📋 Prerequisites

- An EmailJS account (free tier available)
- A Gmail account or any email service

---

## 🚀 Step-by-Step Setup

### 1. Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 2. Create an Email Service

1. After logging in, go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Select **Gmail** (or your preferred email service)
4. Follow the instructions to connect your email account
5. Copy the **Service ID** (you'll need this later)

### 3. Create an Email Template

1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Give it a name (e.g., "Team Member Submission")
4. Set the **To Email** to your admin email (e.g., `admin@javitron.com`)
5. Set the **Subject** to something like: `New Team Member Submission: {{name}}`

### 4. Configure Template Content

In the template content section, use these variables:

```
New Team Member Submission

Name: {{name}}
Email: {{email}}
Role: {{role}}
Department: {{department}}

Social Links:
LinkedIn: {{linkedin}}
Instagram: {{instagram}}

About:
{{bio}}

---
Submitted via JAVITRON Website
```

### 5. Copy Template ID

1. Save the template
2. Copy the **Template ID** from the template page

### 6. Get Your Public Key

1. Go to **Account** → **General** in EmailJS dashboard
2. Copy your **Public Key**

---

## 🔧 Update profile-form.html

Open `profile-form.html` and replace these placeholder values:

```javascript
// Line ~267
emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // Replace with your Public Key

// Line ~315
await emailjs.send(
    'YOUR_EMAILJS_SERVICE_ID', // Replace with your Service ID
    'YOUR_EMAILJS_TEMPLATE_ID', // Replace with your Template ID
    templateParams
);

// Line ~307
to_email: 'admin@javitron.com' // Replace with your admin email
```

---

## ✅ Test the System

1. Open `login-simple.html` in your browser
2. Enter your name and email
3. Fill out the profile form
4. Submit
5. Check your email for the submission

---

## 📧 Email Template Variables

The form sends these variables to EmailJS:

| Variable | Description |
|----------|-------------|
| `name` | User's full name |
| `email` | User's email address |
| `role` | Selected role (Team Member, Team Lead, etc.) |
| `department` | Selected department (Mechanical, Electrical, etc.) |
| `linkedin` | LinkedIn URL |
| `instagram` | Instagram URL |
| `bio` | User's about/bio text |
| `to_email` | Admin email address |

---

## 🎯 How to Add New Team Members

After receiving submissions via email:

1. Review the submission
2. If approved:
   - Add member's photo to `assets/team-images/` (name: `lowercase-nospace.jpg`)
   - Go to the website (as admin)
   - Click "Add Member" button
   - Fill in the details
   - Submit

The member will appear in the Team section automatically.

---

## 🔒 Security Notes

- EmailJS free tier has a limit of 200 emails/month
- Consider adding form validation to prevent spam
- You can add CAPTCHA if needed (EmailJS supports reCAPTCHA)

---

## 📞 Support

If you encounter issues:
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- Check browser console for error messages
- Verify all IDs are correct in profile-form.html

---

## ✨ Done!

Your form-based submission system is now ready. Users can submit their details, and you'll receive them via email without any database or backend costs!
