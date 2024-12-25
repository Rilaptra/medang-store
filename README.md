# 🏫 Medang Market - Platform E-commerce Sekolah 🛒✨

Medang Market itu kayak platform e-commerce buat sekolah, dibikin pake Next.js, Tailwind CSS, TypeScript, sama MongoDB. Dibuat dengan ❤️ sama **[Erzy.sh](https://github.com/Rilaptra)** (Rizqi) dan **[McWooden](https://github.com/McWooden)** (Huddin), anak-anak kelas XII SMAN 3 Magelang. 🎓

## 📝 Tentang

Medang Market tuh ibarat pasar digital 🛍️ buat anak-anak sekolah. Di sini, siswa, guru, sama staf bisa gampang jual barang, atur pesanan, dan nyambung satu sama lain. Anggep aja ini ekonomi sekolah yang keren dan efisien! 🚀

## 🌟 Fitur-fitur Kece

- **👤 Manajemen Pengguna:**

  - Daftar sama login, gampang! ✅
  - Bikin profil sendiri! 🖼️ Kasih nama, bio, kelas, foto profil, dan lainnya!
  - Ada macem-macem peran: member, penjual, sama admin, masing-masing punya kekuatan! 💪
  - Panel admin buat ngatur pengguna dan produk. 👮

- **📦 Manajemen Produk:**

  - Penjual bisa nambahin dan ngatur produk mereka! ✍️
  - Ada variasi produk (misalnya ukuran sama warna). 🌈
  - Tambahin foto 🖼️, set harga 💰, dan pantau stok! 📊
  - Bisa nyari produk dan filter berdasarkan kategori. 🔍

- **🛒 Keranjang Belanja dan Checkout:**

  - Tambahin barang ke keranjang! ➕
  - Atur keranjang: ganti jumlah atau hapus barang. 🗑️
  - Checkout gampang, total harga dihitung otomatis. 🧾

- **😎 Profil Pengguna yang Personal:**

  - Liat profil pengguna lain, produk mereka (kalo mereka penjual), dan follower. 👀
  - Bisa follow sama unfollow pengguna lain. 🫂

- **🛡️ Panel Admin:**

  - Ngatur semua pengguna dan peran mereka. 🧑‍💼
  - Ngatur semua produk. 📦
  - Verifikasi pengguna! ✅

- **🔎 Fitur Pencarian:**

  - Nyari produk berdasarkan nama! ⌨️
  - Filter produk berdasarkan kategori. 🗂️

- **✨ UI yang Dinamis:**

  - Tampilannya responsive di semua perangkat. 📱💻
  - Bisa ganti-ganti tema website! 🎨

- **⚙️ API Routes:**
  - Ada API buat pengguna, produk, keranjang, dan pesanan dengan operasi CRUD. 🚀

## 🛠️ Teknologi yang Dipakai

- **Frontend:**
  - [Next.js](https://nextjs.org/) - Framework React buat server-side rendering dan routing. ⚛️
  - [React](https://reactjs.org/) - Library buat bikin UI. 💻
  - [TypeScript](https://www.typescriptlang.org/) - JavaScript yang ada tipenya. ⌨️
  - [Tailwind CSS](https://tailwindcss.com/) - Framework CSS yang utility-first. 🎨
  - [Lucide React](https://lucide.dev/) - Library icon yang keren. ✨
  - [Zustand](https://zustand-demo.pmnd.rs/) - Library buat ngatur state. 🎛️
  - [React Hook Form](https://react-hook-form.com/) - Library buat form. 📝
  - [Next Auth](https://next-auth.js.org/) - Library buat autentikasi. 🔑
  - [Sonner](https://sonner.emilkowalski.com/) - Library toast. 🍞
  - [Next Theme](https://www.npmjs.com/package/next-theme) - Library tema. 🎨
- **Backend:**
  - [Node.js](https://nodejs.org/en) - JavaScript runtime. 🚀
  - [MongoDB](https://www.mongodb.com/) - Database NoSQL. 🗄️
  - [Mongoose](https://mongoosejs.com/) - Alat buat modeling MongoDB. 🧰
  - [Bcryptjs](https://www.npmjs.com/package/bcryptjs) - Buat hashing password. 🔒
- **Deployment:**
  - [Vercel](https://vercel.com/) - Platform buat deploy (atau yang sejenis). ☁️

## 🚀 Cara Mulai

1. **Clone repository-nya:**

   ```bash
   git clone https://github.com/usernamekamu/medang-market.git
   cd medang-market
   ```

2. **Install semua dependensi:**

   ```bash
   npm install
   ```

3. **Setting variabel environment:**

   - Bikin file `.env.local` di folder utama. 📂
   - Tambahin URI koneksi MongoDB sebagai `MONGODB_URI`, dan session secret sebagai `NEXTAUTH_SECRET`. Contoh:
     ```env
     MONGODB_URI=mongodb+srv://usernamekamu:passwordkamu@clusterkamu.mongodb.net/namadatabasemu
     NEXTAUTH_SECRET=secretkamu
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_URL_INTERNAL=http://localhost:3000
     ```
   - Ambil cloud name, api key, api secret Cloudinary, terus simpen sebagai `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, sama `CLOUDINARY_API_SECRET`.

4. **Jalanin server development:**

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser buat liat keajaibannya! ✨

## 🗂️ Struktur Folder

```
medang-market/
├── src/
│   ├── app/                     # Routes aplikasi Next.js 🧭
│   │   ├── api/                # Endpoint API 📡
│   │   │   ├── admin/
│   │   │   │   └── user/route.ts # API khusus admin 👮
│   │   │   ├── auth/
│   │   │   │   └── register/route.ts # API buat daftar pengguna ✍️
│   │   │   ├── cart/route.ts         # API buat keranjang belanja 🛒
│   │   │   ├── products/
│   │   │   │   └── [...user]/route.ts  # API dynamic buat produk 📦
│   │   │   └── search/route.ts    # API buat fitur pencarian 🔎
│   │   ├── auth/
│   │   │   ├── register/page.tsx      # Halaman daftar ✍️
│   │   │   └── signin/page.tsx        # Halaman login 🔑
│   │   ├── cart/page.tsx             # Halaman keranjang belanja 🛒
│   │   ├── products/page.tsx         # Halaman produk 📦
│   │   ├── [username]/page.tsx           # Halaman profil pengguna 😎
│   │   ├── [username]/[productTitle]/page.tsx       # Halaman detail produk 🖼️
│   │   ├── admin/[...route]/page.tsx # Halaman dashboard admin 🛡️
│   │   └── page.tsx                # Halaman utama 🏠
│   ├── components/              # Komponen-komponen yang bisa dipake lagi 🧩
│   │   ├── layout/              # Komponen terkait layout 📐
│   │   │   ├── header.tsx        # Komponen Header ⬆️
│   │   │   └── footer.tsx        # Komponen Footer ⬇️
│   │   ├── add-product-dialog.tsx # Modal buat nambahin produk ➕
│   │   ├── add-product-to-cart.tsx # Tombol tambah ke keranjang 🛒
│   │   ├── auth-provider.tsx # Provider autentikasi 🔑
│   │   ├── big-product-card.tsx   # Komponen untuk card produk 📦
│   │   ├── delete-product-dialog.tsx   # Modal konfirmasi buat hapus produk 🗑️
│   │   ├── display-product-card.tsx   # Komponen buat card produk di list produk 📦
│   │   ├── edit-product-dialog.tsx  # Dialog edit produk ✏️
│   │   ├── edit-profile.tsx  # Edit profil pengguna 😎
│   │   ├── error-dialog.tsx # Dialog error 🚨
│   │   ├── order-history.tsx # Komponen buat liat riwayat pesanan 🧾
│   │   ├── search-page.tsx    # Halaman pencarian dengan list produk 🔎
│   │   ├── seller-product-card.tsx    # Card produk buat penjual 🧑‍💼
│   │   └── user-card.tsx    # Komponen buat nampilin info pengguna 👤
│   ├── hooks/                 # Custom React hooks 🪝
│   │    └── use-toast.ts      # Custom hook toast 🍞
│   ├── lib/                   # File helper dan library 📚
│   │   ├── auth-options.ts      # Opsi untuk Next Auth 🔑
│   │   ├── db/                # Logika database MongoDB 🗄️
│   │   │   ├── connect.ts        # Koneksi ke MongoDB 🔌
│   │   │   ├── init.ts          # Inisialisasi model ⚙️
│   │   │   └── models/       # Model untuk skema data 📝
│   │   │      ├── banner.model.ts
│   │   │      ├── cart.model.ts
│   │   │      ├── order-item.model.ts
│   │   │      ├── order.model.ts
│   │   │      ├── product-ratings.model.ts
│   │   │      ├── product.model.ts
│   │   │      ├── user.model.ts
│   │   │      └── voucher.model.ts
│   │   └── utils.ts      # Fungsi-fungsi utilitas 🛠️
│   ├── store/               # State management Zustand 🎛️
│   │   └── cart-store.ts    # Store keranjang belanja 🛒
│   └── globals.css       # Style CSS global 🎨
│
├── next.config.js          # Konfigurasi Next.js ⚙️
├── package.json           # Dependensi dan script Node.js 📦
└── README.md            # Dokumentasi proyek 📜
```

## 🤝 Kontribusi

Kita seneng banget kalo ada yang mau berkontribusi! Kalo punya ide buat fitur atau nemuin bug, jangan ragu buat:

1. Fork repository-nya. 🍴
2. Bikin branch baru buat fitur atau perbaikan bug. 🌿
3. Implementasi perubahan dan commit dengan pesan yang jelas. ✍️
4. Bikin pull request! 🚀

## 🧑‍🎓 Penulis

- **Rizqi** (**[Erzy.sh](https://github.com/Rilaptra)**)
- **Huddin** (**[McWooden](https://github.com/McWooden)**)

Murid kelas XII SMAN 3 Magelang. 🎓

---
