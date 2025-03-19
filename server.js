const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require("@prisma/client");

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3000;

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const prismaClient = new PrismaClient();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  io.on('connection', async (socket) => {
    console.log(`Kullanıcı bağlandı: ${socket.id}`);
    const ogrenciler = await prismaClient.ogrenci.findMany([]);
    socket.emit('ogrenciler_initial',JSON.stringify({ ogrenciler }));

    socket.on('ogrenci_logged_in', async (data) => {
        console.log(`${data} idli öğrenci giriş yaptı!`);
        const ogrenci = await prismaClient.ogrenci.findFirst({ where: { id: data } });
        io.emit(`ogrenci_logged_in_res`, JSON.stringify(ogrenci));
    })
    
    socket.on('disconnect', () => {
      console.log(`Kullanıcı bağlantısı koptu: ${socket.id}`);
    });
  });

  // Start the server
  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});