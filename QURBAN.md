# Product Requirement Document (PRD)
## Sistem Informasi Manajemen Qurban Digital (Skala Masjid / RT-RW)

**Nama File:** QURBAN.md  
**Versi:** 1.2  
**Tanggal:** 3 Juni 2026  
**Penulis:** Adityo  
**Status:** Ready for Development (MVP)  

---

## 1. Latar Belakang & Tujuan
Pengelolaan ibadah qurban di tingkat RT/RW atau Dewan Masjid sering menghadapi tantangan berupa koordinasi kepanitiaan yang kurang terstruktur, pencatatan keuangan yang rawan selisih, serta kurangnya transparansi informasi bagi warga (*Mudhohi*) mengenai status pembayaran dan progres hewan qurban mereka.

**Tujuan Sistem:**
- **Transparansi Warga:** Menyediakan halaman publik agar warga bisa memantau status pembayaran dan progres penyembelihan hewan secara real-time.
- **Akuntabilitas Keuangan:** Membantu Bendahara Masjid mencatat iuran qurban dan pengeluaran operasional secara rapi.
- **Efisiensi Lapangan:** Menyediakan dashboard koordinasi untuk membagi tugas panitia berdasarkan PIC (Person In Charge) sub-tim masing-masing.
- **Tema website:** Bergaya islami lengkap dengan pernik-pernik masjid, bulan bintang, dan nuansa islam.

---

## 2. Struktur Pengguna (User Roles & Permissions)
1. **Warga / Mudhohi (Public User):** Tidak memerlukan login. Dapat melihat monitoring hewan, status slot patungan, dan *flag* pelunasan pembayaran.
2. **Panitia Lapangan (PIC User):** Login praktis menggunakan *Unique Token Link* (tanpa password) yang dikirim ke WhatsApp. Berwenang mengupdate progres kerja di lapangan melalui HP.
3. **Ketua Panitia / Admin Masjid (Super Admin):** Akses penuh (CRUD) ke seluruh data panitia, tugas PIC, validasi keuangan, dan pengaturan master hewan.

---

## 3. Ruang Lingkup Fitur (Feature Scope)

### A. Halaman Publik & Monitoring Hewan Qurban (Front-End Warga)
Halaman utama yang dapat diakses oleh seluruh warga untuk memantau pembagian kelompok hewan dan status pembayaran:

1. **Visualisasi Progres Ringkas:** *Donut/Bar Chart* yang menampilkan total hewan masuk vs jumlah hewan yang sudah selesai diproses pada hari H.
2. **Tab Sapi (Sistem Patungan Kelompok):**
   - Menampilkan data Sapi dalam bentuk *Card* besar yang berisi **maksimal 7 slot nama pekurban**.
   - Menampilkan *flag* indikator warna penanda status pembayaran per orang (e.g., 🟢 LUNAS, 🟡 BELUM LUNAS).
   - Menampilkan tombol *"Slot Kosong"* jika kuota patungan 7 orang belum terpenuhi agar warga lain bisa mendaftar.
3. **Tab Kambing (Sistem Mandiri/Keluarga):**
   - Menampilkan baris tunggal untuk setiap kambing dengan kapasitas **1 slot nama**.
   - Input teks bersifat fleksibel untuk mengakomodasi nama individu maupun kolektif (e.g., "Keluarga Besar Bpk. Joko").
   - Dilengkapi *flag* status pembayaran (🟢 LUNAS / 🔴 BELUM BAYAR).
4. **Status Progres Hewan:** Setiap hewan memiliki indikator pelacakan fisik: `Belum Datang` $\rightarrow$ `Di Kandang` $\rightarrow$ `Siap Sembelih` $\rightarrow$ `Selesai Sembelih`.

### B. Dashboard PIC Panitia (Manajemen Kerja Lapangan)
Menu khusus untuk mendistribusikan *job description* panitia dewan masjid dan pemuda RT/RW:
- **Pencatatan Profil Panitia:** Nama, nomor WhatsApp, dan penugasan sub-tim (Logistik, Jagal, Distribusi, Bendahara).
- **Aksi Lapangan Berbasis PIC:**
  - **PIC Logistik & Hewan:** Mengupdate kedatangan hewan dari tengkulak, status kesehatan, dan menginput nomor tag kuping hewan.
  - **PIC Penyembelihan & Kuliti:** Mengubah status progres hewan melalui HP saat hari H (*Belum $\rightarrow$ Sedang Diproses $\rightarrow$ Selesai*) serta mengunggah 1 foto bukti dokumentasi pasca-sembelih.
  - **PIC Distribusi & Kupon:** Mengelola data target penerima (data dhuafa/warga per RT) dan melakukan *check-list* distribusi daging agar tidak terjadi pembagian ganda atau terlewat.

### C. Dashboard Keuangan & Administrasi (Bendahara)
- **Manajemen Iuran:** Input nominal pembayaran qurban dari warga (Tunai/Transfer). Sistem otomatis mengubah *flag* menjadi 🟢 LUNAS jika nominal yang dibayar sudah memenuhi harga slot hewan.
- **Privasi Nominal:** Nominal uang kurang/sisa hanya terlihat di dashboard bendahara; halaman publik warga hanya menampilkan status teks murni ("Lunas" / "Belum Lunas").
- **Buku Kas Operasional:** Pencatatan pengeluaran tak terduga dan operasional (pembelian kantong daging ramah lingkungan, pisau, bumbu, konsumsi panitia, dan upah jagal profesional).
- **Kwitansi Digital:** Menghasilkan bukti bayar berbasis teks terformat yang siap disalin dan dibagikan langsung ke WhatsApp warga.

---

## 4. Karsitektur Data & Skema Database (PostgreSQL / MySQL)

Berikut adalah usulan struktur tabel database untuk mendukung relasi kelompok hewan, 7 slot nama sapi, dan tracking PIC Panitia:

```sql
-- 1. Tabel Master Data Panitia
CREATE TABLE IF NOT EXISTS panitia_profile (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_lengkap TEXT NOT NULL,
    no_whatsapp TEXT NOT NULL,
    sub_tim TEXT NOT NULL, -- 'Logistik', 'Jagal', 'Distribusi', 'Bendahara'
    is_active BOOLEAN DEFAULT true
);

-- 2. Tabel Tracking Tugas PIC
CREATE TABLE IF NOT EXISTS panitia_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_name TEXT NOT NULL, 
    pic_id UUID REFERENCES panitia_profile(id),
    status_tugas TEXT DEFAULT 'Belum Mulai', -- 'Belum Mulai', 'In Progress', 'Selesai'
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Data Fisik Hewan Qurban
CREATE TABLE IF NOT EXISTS qurban_animals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tag_number TEXT UNIQUE NOT NULL,       -- Contoh: 'SP01', 'KB01'
    jenis_hewan TEXT NOT NULL,             -- 'Sapi' atau 'Kambing'
    tipe_jenis TEXT,                       -- 'Limosin', 'Kambing Kibas', 'Etawa'
    status_hewan TEXT DEFAULT 'Di Kandang',-- 'Belum Datang', 'Di Kandang', 'Selesai Sembelih'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel Nama Pengurban & Status Pembayaran
CREATE TABLE IF NOT EXISTS pekurban_names (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    animal_id UUID REFERENCES qurban_animals(id) ON DELETE CASCADE,
    nama_pekurban TEXT NOT NULL,           -- 'Bpk. Ahmad' atau 'Keluarga Bpk. Joko'
    asal_rt_rw TEXT NOT NULL,              -- Contoh: 'RT 01 / RW 05'
    slot_number INT NOT NULL,              -- Sapi: 1 s.d 7 | Kambing: selalu 1
    payment_status TEXT DEFAULT 'Belum Bayar', -- 'Belum Bayar', 'Cicil', 'Lunas'
    amount_paid NUMERIC(12, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Proteksi ganda agar tidak ada bentrok pengisian slot di hewan yang sama
    CONSTRAINT unique_animal_slot UNIQUE (animal_id, slot_number)
);

CREATE INDEX IF NOT EXISTS idx_payment_status ON pekurban_names (payment_status);