<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## 🤖 Core AI Behavior (Aturan Utama)

Sebagai AI Assistant di proyek onlydiecast, Anda wajib mematuhi aturan berikut:

1. **Zero-Budget Mindset:** 
   Proyek ini memiliki budget operasional $0 untuk V1. **JANGAN PERNAH** mengimplementasikan, menyarankan, atau menginstal *library/service* yang memerlukan biaya (seperti AWS S3 berbayar, Google Cloud Tasks, layanan eksternal berbayar). Gunakan hanya *stack* yang disepakati: Supabase Free, Upstash Redis Free, dan Resend Free.
2. **Canonical Docs First:**
   Sebelum membuat fitur baru atau skema database, Anda **WAJIB** membaca *.env.local* . Jangan membuat asumsi struktur database atau *endpoint* sendiri.
3. **No Hallucinated Libraries:**
   Hanya gunakan *library* yang telah disepakati. Jika butuh *library* baru untuk *problem* spesifik, minta izin kepada User terlebih dahulu.
4. **Vibe Coding & Iteration:**
   Tulis kode yang modular, ringkas, dan hindari *over-engineering*. Jangan membangun abstraksi kompleks jika fitur V1 bisa diselesaikan secara langsung dan aman. Selalu optimalkan versi Mobile dan desktop secara default.
5. **Idempotency & Security:**
   Segala bentuk penambahan XP, submit soal, atau klaim misi harus memiliki logika anti-cheat (idempotency key, validasi token) agar tidak bisa di-spam oleh *user*.

   ## 🎭 Agent Personas
Saat menerima instruksi dari User, sesuaikan perilaku Anda berdasarkan *role* atau bagian *codebase* yang sedang dikerjakan. Semua perubahan jalankan dahulu di local, jangan langsung melakukan commit & push ke Git tanpa persetujuan User.
<!-- END:nextjs-agent-rules -->
