# Romantic Book + TikTok Combo v8

Tema final tetap biru muda/dark-blue seperti referensi yang dikirim user.

## Flow
1. Opening: digital rain biru + HAPPY BIRTHDAY + countdown hari/jam/menit/detik + tombol open my surprise.
2. PIN 6 digit + pesan error saat salah.
3. Greeting + pilihan yess/noo.
4. Birthday page memakai Photo 03 dan countdown dinner di halaman yang sama.
5. Dinner invitation + sticker + elemen party.
6. Aku ikut -> RSVP confirmation -> ajakan ke buku kenangan.
7. Buku 3D: konten halaman hanya terlihat saat halaman aktif, dengan fade in/fade out.
8. Music section (placeholder visual, siap diganti Spotify Embed resmi).
9. Letter closing.

## Custom
- Password: `src/main.js`, konstanta `PIN`.
- Countdown birthday: `src/main.js`, `BIRTHDAY_TARGET`.
- Countdown dinner: `src/main.js`, `DINNER_TARGET`.
- Foto: `public/photos/`.
- Musik: `public/music/music.mp3`.

## Run
npm install
npm run dev

## Deploy Vercel
Build: `npm run build`
Output: `dist`


## Musik
File `public/music/music.mp3` sudah diisi dengan lagu yang kamu upload. Musik dicoba autoplay setelah PIN benar; browser tetap bisa menolak autoplay di kondisi tertentu.
