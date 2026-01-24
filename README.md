<div align="center">

# Weare~Story●™

### *Every Chapter, Curated.*

[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**A premium AI-powered fashion e-commerce platform that redefines online shopping with personalized styling and luxury aesthetics.**

[Live Demo](#) • [Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started)

</div>

---

## ✨ Features

### 🤖 **AI-Powered Personal Stylist**
Meet **Lumi**, your AI fashion assistant powered by Google Gemini. Get personalized outfit recommendations, style advice, and product suggestions tailored to your preferences.

### 🛍️ **Seamless Shopping Experience**
- **Smart Product Catalog** with real-time filtering, search, and sorting
- **Shopping Cart & Wishlist** with persistent local storage
- **Secure Checkout** with transaction ID logging (PCI-DSS compliant)
- **Product Quick View** with detailed modals and styling suggestions

### 🔐 **Premium Authentication**
Custom-designed Clerk authentication with:
- Dark glass morphism UI
- Google & Apple social login
- Elegant brand-consistent styling
- Automatic redirect after login

### 📊 **Admin Dashboard**
- Product management (CRUD operations)
- Activity log monitoring (50 most recent entries)
- Real-time inventory updates via Supabase
- Secure admin access

### 🎨 **Luxury Brand Identity**
- Animated brand name reveal: **Weare~Story●™**
- Golden accent colors (#D4AF37)
- Serif typography (Playfair Display)
- Smooth animations and transitions
- Responsive design for all devices

### 📄 **Informational Pages**
- **About**: Brand story and mission
- **Collections**: Category showcase
- **Contact**: Business information and contact form
- **Privacy Policies**: Comprehensive privacy information

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS, Custom Animations |
| **Backend** | Supabase (PostgreSQL + Realtime) |
| **AI** | Google Gemini 1.5 Flash |
| **Authentication** | Clerk |
| **Icons** | Lucide React |
| **State Management** | React Hooks + Local Storage |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Clerk account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weare-story.git
   cd weare-story
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. **Set up Supabase database**
   
   Run the SQL scripts in your Supabase SQL editor:
   ```bash
   # Run these files in order:
   1. supabase_schema.sql
   2. create_logs_table.sql
   3. enable_realtime.sql
   4. bulk_products.sql (optional - sample data)
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
weare-story/
├── components/          # React components
│   ├── AdminPanel.tsx   # Admin dashboard
│   ├── AiStylist.tsx    # AI chatbot interface
│   ├── BrandLoginPage.tsx # Custom auth UI
│   ├── CartDrawer.tsx   # Shopping cart
│   ├── CheckoutModal.tsx # Payment interface
│   ├── Navbar.tsx       # Navigation bar
│   └── ...
├── services/            # Backend integrations
│   ├── geminiService.ts # AI service
│   ├── supabase.ts      # Database client
│   └── loggingService.ts # Activity logging
├── utils/               # Helper functions
├── types.ts             # TypeScript definitions
├── constants.ts         # App constants
└── App.tsx              # Main application
```

---

## 🎯 Key Highlights

### Real-Time Updates
Products sync automatically across all users via Supabase Realtime subscriptions.

### Secure Payment Logging
Only transaction IDs are stored - no sensitive card data is ever saved.

### AI-Powered Recommendations
Gemini AI analyzes user queries and product catalog to provide intelligent styling advice.

### Responsive Design
Fully optimized for desktop, tablet, and mobile devices.

### Performance Optimized
- Lazy loading for images
- Efficient state management
- Optimized bundle size with Vite

---

## 🔒 Security Features

- **PCI-DSS Compliant**: No credit card data storage
- **Transaction ID Logging**: Secure payment tracking
- **Environment Variables**: Sensitive keys protected
- **Clerk Authentication**: Industry-standard auth provider
- **Input Validation**: Form validation and sanitization

---

## 🎨 Design Philosophy

Weare-Story embodies luxury fashion through:
- **Minimalist Elegance**: Clean layouts with purposeful whitespace
- **Premium Typography**: Serif fonts for sophistication
- **Golden Accents**: Subtle luxury touches
- **Smooth Animations**: Delightful micro-interactions
- **Dark Mode Auth**: Premium glass morphism design

---

## 📝 Admin Access

**Default Admin Credentials:**
- Password: `admin123`

Access the admin panel via the footer link.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent styling recommendations
- **Supabase** for real-time database infrastructure
- **Clerk** for authentication services
- **Unsplash** for high-quality product imagery
- **Tailwind CSS** for utility-first styling

---

<div align="center">

### Made with ❤️ by [Your Name]

**Weare~Story●™** - *Wear Your Story*

[⬆ Back to Top](#wearestory)

</div>