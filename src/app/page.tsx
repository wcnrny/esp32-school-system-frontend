"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/lib/hooks/useSocket";
import { Ogrenci } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function SocketClient() {
  const { socket, isConnected } = useSocket();
  const [ogrenciler, setOgrenciler] = useState<Ogrenci[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("ogrenci_logged_in_res", (ogrenci) => {
      const data = JSON.parse(ogrenci) as Ogrenci;
      data.tcKimlikNo = `${data.tcKimlikNo.substr(
        0,
        3
      )}***${data.tcKimlikNo.substr(-3)}`;
      console.log(data);
      setOgrenciler((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message");
    };
  }, [socket]);

  return (
    <div className="p-4 px-8">
      <div className="flex flex-col space-y-2">
        {ogrenciler.length !== 0 && (
          <Card className="rounded-md">
            <CardHeader>
              <h2 className="font-bold text-lg">En Son Giriş Yapan Öğrenci</h2>
            </CardHeader>
            <CardContent className="flex flex-col space-y-1">
              <span>Adı: {ogrenciler[ogrenciler.length - 1].name}</span>
              <span>
                Öğrenci Numarası: {ogrenciler[ogrenciler.length - 1].ogrenciNo}
              </span>
              <span>
                Tc Kimlik Numarası:{" "}
                {ogrenciler[ogrenciler.length - 1].tcKimlikNo}
              </span>
              <span>Rol: {ogrenciler[ogrenciler.length - 1].role}</span>
              <span>
                Son Giriş:{" "}
                {(
                  new Date(ogrenciler[ogrenciler.length - 1].lastLogin) ??
                  new Date()
                ).toLocaleDateString("tr-TR", {
                  timeZone: "Europe/Istanbul",
                  dateStyle: "full",
                })}{" "}
                {new Date(
                  ogrenciler[ogrenciler.length - 1].lastLogin
                ).toLocaleTimeString("tr-TR")}
              </span>
            </CardContent>
          </Card>
        )}
        <br />
        {ogrenciler.length !== 0 && (
          <h1 className="font-bold text-xl">Son Girenler listesi</h1>
        )}
        {ogrenciler.length !== 0 ? (
          ogrenciler.map((ogrenci, index) => (
            <Card key={index} className="rounded-md">
              <CardContent className="flex flex-col space-y-1">
                <span>Adı: {ogrenci.name}</span>
                <span>Öğrenci Numarası: {ogrenci.ogrenciNo}</span>
                <span>Tc Kimlik Numarası: {ogrenci.tcKimlikNo}</span>
                <span>Rol: {ogrenci.role}</span>
                <span>
                  Son Giriş:{" "}
                  {(
                    new Date(ogrenci.lastLogin) ?? new Date()
                  ).toLocaleDateString("tr-TR", {
                    timeZone: "Europe/Istanbul",
                    dateStyle: "full",
                  })}{" "}
                  {new Date(ogrenci.lastLogin).toLocaleTimeString("tr-TR")}
                </span>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-lg">
            Henüz kimse giriş yapmadı ya da giriş yapan öğrenci kayıtlı değil.
          </div>
        )}
      </div>
    </div>
  );
}
