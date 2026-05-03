import { prisma } from "./prisma";

export async function logAction({
  userId,
  action,
  details,
  targetId,
  ipAddress
}: {
  userId: string;
  action: string;
  details?: string;
  targetId?: string;
  ipAddress?: string;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
        targetId,
        ipAddress
      }
    });
  } catch (error) {
    console.error("Failed to log audit action:", error);
  }
}

export const ACTIONS = {
  DELETE_COURSE: "حذف كورس",
  UPDATE_COURSE: "تعديل كورس",
  PUBLISH_COURSE: "نشر كورس",
  VERIFY_USER: "تفعيل مستخدم",
  DEACTIVATE_USER: "إلغاء تفعيل مستخدم",
  CHANGE_USER_ROLE: "تغيير رتبة مستخدم",
  CREATE_COUPON: "إنشاء كود خصم",
  DELETE_COUPON: "حذف كود خصم",
  UPDATE_SETTINGS: "تحديث الإعدادات العامة",
  CREATE_AD: "إضافة إعلان",
  DELETE_AD: "حذف إعلان",
  UPDATE_AD: "تعديل إعلان",
  ADD_MATERIAL: "إضافة مذكرة",
  DELETE_MATERIAL: "حذف مذكرة",
  SEND_NOTIFICATION: "إرسال إشعار جماعي",
};
