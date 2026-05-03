const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Medo500600700", 10);

  // 1. Create Core Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@elashry.com" },
    update: {},
    create: {
      username: "Medo",
      email: "admin@elashry.com",
      password: hashedPassword,
      name: "مدير الأكاديمية",
      role: "ADMIN",
    },
  });

  // 2. Create a Teacher
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@elashry.com" },
    update: {},
    create: {
      username: "AhmedTeacher",
      email: "teacher@elashry.com",
      password: hashedPassword,
      name: "أ/ أحمد محمد",
      role: "TEACHER",
    },
  });

  // 3. Create a Parent
  const parent = await prisma.user.upsert({
    where: { email: "parent@elashry.com" },
    update: {},
    create: {
      username: "HassanParent",
      email: "parent@elashry.com",
      password: hashedPassword,
      name: "أ/ حسن علي",
      role: "PARENT",
    },
  });

  // 4. Create a Student linked to the Parent
  const student = await prisma.user.upsert({
    where: { email: "student@elashry.com" },
    update: {},
    create: {
      username: "OmarStudent",
      email: "student@elashry.com",
      password: hashedPassword,
      name: "عمر حسن",
      role: "STUDENT",
      parentId: parent.id,
    },
  });

  // 5. Create professional courses
  const coursesData = [
    {
      title: "كورس احتراف Next.js 14",
      description: "دليلك الشامل لبناء تطبيقات حقيقية وقابلة للتوسع باستخدام أحدث تقنيات الويب.",
      price: 1200,
      published: true,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
      instructorId: teacher.id,
      lessons: {
        create: [
          { title: "مقدمة الدورة والأدوات", order: 1, content: "شرح هيكلية الكورس..." },
          { title: "أساسيات Server Components", order: 2, content: "شرح المفهوم الأساسي..." }
        ]
      }
    },
    {
      title: "تصميم واجهات المستخدم UI/UX",
      description: "تعلم مبادئ التصميم العصري وبناء تجربة مستخدم استثنائية.",
      price: 850,
      published: true,
      thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c",
      instructorId: admin.id,
      lessons: {
        create: [
          { title: "ما هو الـ UI/UX؟", order: 1, content: "تعريفات أساسية..." }
        ]
      }
    }
  ];

  for (const c of coursesData) {
    await prisma.course.create({ data: c });
  }

  console.log("Database seeded with professional roles and data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
