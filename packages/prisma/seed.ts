import { PrismaClient } from "./generated/client";
import argon2 from "argon2";

const db = new PrismaClient();

async function start() {
  const pepper =
    process.env.API_SECRET_PEPPER || "cok_gizli_secret_pepper_env_e_ekle";

  // Şifreyi hashle
  const hashedPassword = await argon2.hash("123" + pepper);

  // DİKKAT: db.users değil, db.user kullanıyoruz (Model adı)
  const seedUser = await db.users.upsert({
    where: { email: "wcnrny@proton.me" }, // Varsa güncelle, yoksa oluştur (Hata almazsın)
    update: {}, // Zaten varsa hiçbir şeyi değiştirme
    create: {
      email: "wcnrny@proton.me",
      username: "wcnrny",
      firstName: "Furkan",
      lastName: "Erkara",
      role: "ADMIN",
      bio: "deneme",
      emailVerified: new Date(),
      accounts: {
        create: {
          provider: "local", // Auth.js'teki provider ID'si (credentials yerine local diyebilirsin)
          type: "credentials", // "idk" yerine standart tip
          providerAccountId: "wcnrny@proton.me", // Credentials için genelde email kullanılır
          password: hashedPassword,
        },
      },
    },
  });

  console.log(`[+] Kullanıcı hazır: ${seedUser.id}`);
}

start()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
