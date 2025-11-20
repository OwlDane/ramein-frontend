# 🎨 Ramein Frontend

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)  
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)  
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)  
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)  
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-0055FF?style=for-the-badge&logo=framer&logoColor=white)  
![Radix UI](https://img.shields.io/badge/Radix%20UI-Accessible-111111?style=for-the-badge&logo=radixui&logoColor=white)  
![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-000000?style=for-the-badge&logo=lucide&logoColor=white)  
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)  

---

## 📋 Deskripsi

**Ramein Frontend** adalah aplikasi web berbasis **Next.js 15** yang menjadi antarmuka utama pengguna untuk sistem manajemen kegiatan/event.  
Didesain dengan pendekatan **modern UI/UX** menggunakan TailwindCSS, Framer Motion, dan Radix UI sehingga responsif, interaktif, dan nyaman dipakai di semua perangkat.  

---

## ✨ Fitur Utama

- 🏠 **Landing Page Modern** dengan animasi & CTA  
- 🔐 **Auth System**: login, register, verifikasi email, reset password  
- 📊 **User Dashboard** dengan statistik & histori event  
- 📅 **Event Management**: daftar event, detail event, registrasi  
- 🏆 **Certificate System**: lihat & download sertifikat  
- 🎭 **UI Interaktif**: animasi micro-interaction (Framer Motion)  
- 📲 **PWA Support**: installable + offline mode  
- 🔍 **Search & Filter** untuk event & konten  
- ⚙️ **Admin Panel** untuk pengelolaan event (role-based access)  

---

## 🚀 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/OwlDane/ramein-frontend.git
cd ramein-frontend
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Konfigurasi Environment

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Ramein
```

### 4️⃣ Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan jalan di `http://localhost:3000`

### 5️⃣ Production Build

```bash
npm run build
npm start
```

---

## 📂 Struktur Proyek

```
src/
├── app/
│   ├── (auth)/         # Halaman auth (login/register)
│   ├── dashboard/      # User dashboard
│   ├── events/         # Event pages
│   ├── about/          # Tentang aplikasi
│   ├── terms/          # Syarat & ketentuan
│   └── layout.tsx      # Root layout
├── components/
│   ├── ui/             # UI components (button, modal, dsb)
│   ├── event/          # Komponen event
│   ├── layout/         # Navbar, Footer, Sidebar
│   └── shared/         # Komponen umum
├── lib/                # Utils & helper functions
├── contexts/           # Context API (auth, theme, dsb)
├── types/              # TypeScript types
└── styles/             # Global styles
```

---

## 📱 User Experience

* ✅ **Mobile-first design**
* 🚀 **Fast performance** (Next.js App Router + SSR/ISR)
* ♿ **Aksesibilitas terjaga** (Radix UI + ARIA)
* 🎨 **Customizable themes**

---

## 🔐 Authentication Flow

1. Register → email verification
2. Login → token disimpan di local storage
3. Protected routes dengan middleware Next.js
4. Reset password via email

---

## 🧪 Testing

```bash
npm run lint     # Linting
npm run typecheck # Type checking
npm run test     # Unit tests
```

---

## 📱 PWA Support

* ✅ Installable (Add to Home Screen)
* ✅ Offline caching
* ✅ Web app manifest

---

## 🌍 Deployment

### Railway Deployment (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

See [RAILWAY_DEPLOYMENT.md](../RAILWAY_DEPLOYMENT.md) for detailed instructions.

### Vercel (Alternative)

* Deploy to Vercel for static hosting
* Configure environment variables in Vercel dashboard

### Docker (Manual)

```bash
docker build -t ramein-frontend .
docker run -p 3000:3000 ramein-frontend
```

---

## 🤝 Contributing

1. Fork repository ini
2. Buat branch baru (`feature/namafitur`)
3. Commit perubahan
4. Push ke branch
5. Buka **Pull Request**

---

## 📄 License

Ramein Frontend dirilis di bawah lisensi **ISC License**

---

## 👥 Tim

* [@OwlDane](https://github.com/OwlDane) - Developer

---

## 🌟 Special Thanks

* Next.js Team
* Tailwind Labs
* Framer Motion
* Radix UI
* Open Source Contributors

---
