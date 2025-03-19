import prisma from "@/lib/prisma";
import { io } from "socket.io-client";

export async function POST(request: Request) {
  const id = await request.text();
  const kullanici = await prisma.ogrenci.findFirst({
    where: {
      id,
    },
  });

  if (!kullanici) {
    return new Response(JSON.stringify({ error: "OGRENCI_BULUNAMADI" }), {
      status: 404,
    });
  }

  try {
    const socketInstance = io("http://localhost:3000");

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Bağlantı hatası"));
      }, 5000);

      socketInstance.on("connect", () => {
        console.log("Socket.IO bağlandı, event yollanıyor");

        socketInstance.emit("ogrenci_logged_in", kullanici.id);

        setTimeout(() => {
          socketInstance.disconnect();
          clearTimeout(timeout);
          resolve(true);
        }, 500);
      });

      socketInstance.on("connect_error", (err) => {
        console.error("Socket bağlantı hatası:", err);
        clearTimeout(timeout);
        reject(err);
      });
    });

    console.log("Mesaj başarıyla gönderildi");
  } catch (error) {
    console.error("Mesaj gönderirken hata:", error);
    // Hata durumunda bile işleme devam et, kritik bir hata değil
  }

  await prisma.ogrenci.update({
    where: { id },
    data: { lastLogin: new Date() },
  });

  return new Response(JSON.stringify(kullanici), { status: 200 });
}
