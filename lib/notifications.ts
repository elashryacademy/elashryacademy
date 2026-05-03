import { prisma } from "./prisma";

export async function sendWhatsAppMessage(phone: string, message: string) {
  try {
    // Get WhatsApp settings from database
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: ["whatsapp_api_url", "whatsapp_api_token", "whatsapp_enabled"]
        }
      }
    });

    const config: Record<string, string> = {};
    settings.forEach(s => config[s.key] = s.value);

    if (config.whatsapp_enabled !== "true") {
      console.log("WhatsApp notifications are disabled.");
      return;
    }

    if (!config.whatsapp_api_url || !config.whatsapp_api_token) {
      console.warn("WhatsApp API settings are missing.");
      return;
    }

    // Example implementation for a common WhatsApp API like UltraMsg or similar
    // You can adapt this to your specific provider
    const response = await fetch(config.whatsapp_api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: config.whatsapp_api_token,
        to: phone,
        body: message,
      }),
    });

    const result = await response.json();
    console.log("WhatsApp API response:", result);
    return result;
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
  }
}

export async function sendEmail(to: string, subject: string, content: string) {
  try {
    console.log(`Sending Email to ${to}: ${subject}`);
    // Integration point for Resend/Nodemailer
    // For now we log, in production you'd use a real transporter
  } catch (error) {
    console.error("Failed to send Email:", error);
  }
}

export async function createInAppNotification(userId: string, title: string, message: string) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
      }
    });
  } catch (error) {
    console.error("Failed to create in-app notification:", error);
  }
}

export async function sendNotification({
  userId,
  userPhone,
  userEmail,
  title,
  message,
  channels = ["platform"]
}: {
  userId: string,
  userPhone?: string | null,
  userEmail?: string | null,
  title: string,
  message: string,
  channels: ("platform" | "whatsapp" | "email")[]
}) {
  const results: any = {};

  if (channels.includes("platform")) {
    results.platform = await createInAppNotification(userId, title, message);
  }

  if (channels.includes("whatsapp") && userPhone) {
    results.whatsapp = await sendWhatsAppMessage(userPhone, message);
  }

  if (channels.includes("email") && userEmail) {
    results.email = await sendEmail(userEmail, title, message);
  }

  return results;
}

export async function sendEmailOTP(email: string, code: string) {
  try {
    const message = `كود التفعيل الخاص بك هو: ${code}`;
    await sendEmail(email, "تفعيل الحساب", message);
  } catch (error) {
    console.error("Failed to send Email OTP:", error);
  }
}

export async function sendRegistrationOTP(user: { 
  email: string, 
  phone: string, 
  verificationCode: string,
  sendEmail?: boolean,
  sendWhatsApp?: boolean
}) {
  const message = `كود التفعيل الخاص بك في أكاديمية العشري هو: ${user.verificationCode}`;
  
  // Send via WhatsApp
  if (user.sendWhatsApp !== false) {
    await sendWhatsAppMessage(user.phone, message);
  }
  
  // Send via Email
  if (user.sendEmail !== false) {
    await sendEmailOTP(user.email, user.verificationCode);
  }
}
