# 🏫 Medang Market - School E-commerce Platform 🛒✨

A school e-commerce platform built with Next.js, Tailwind CSS, TypeScript, and MongoDB. Developed with ❤️ by **[Erzy.sh](https://github.com/Rilaptra)** (Rizqi) and **[McWooden](https://github.com/McWooden)** (Huddin), students of SMAN 3 Magelang, class XII. 🎓

## 📝 About

Medang Market is like a digital marketplace 🛍️ designed for our school community. It's a place where students, teachers, and staff can easily list products, manage orders, and connect with each other. Think of it as a vibrant and efficient school economy! 🚀

## 🌟 Features

- **👤 User Management:**

  - Register and log in! ✅
  - Create your own profile! 🖼️ Add your name, bio, class, profile picture, and more!
  - Different roles: member, seller, and admin, each with their own powers! 💪
  - Admin panel to manage users and products. 👮

- **📦 Product Management:**

  - Sellers can add and manage their products! ✍️
  - Supports product variations (like sizes and colors). 🌈
  - Add images 🖼️, set prices 💰, and track stock! 📊
  - Search for products and filter by category. 🔍

- **🛒 Cart and Checkout:**

  - Add items to your cart! ➕
  - Manage your cart: change quantity or remove items. 🗑️
  - Easy checkout with total amount calculation. 🧾

- **😎 Personalized User Profiles:**

  - See other users' profiles with their products (if they're a seller) and followers. 👀
  - Follow and unfollow users. 🫂

- **🛡️ Admin Panel:**

  - Manage all users and their roles. 🧑‍💼
  - Manage all products. 📦
  - Verify users! ✅

- **🔎 Search Functionality:**

  - Search products by their name! ⌨️
  - Filter products by category. 🗂️

- **✨ Dynamic UI:**

  - Responsive design for all devices. 📱💻
  - Change the website's appearance with theming support! 🎨

- **⚙️ API Routes:**
  - API routes for users, products, carts, and orders with CRUD operations. 🚀

## 🛠️ Technologies Used

- **Frontend:**
  - [Next.js](https://nextjs.org/) - React framework for server-side rendering and routing. ⚛️
  - [React](https://reactjs.org/) - User interface building library. 💻
  - [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript. ⌨️
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework. 🎨
  - [Lucide React](https://lucide.dev/) - Awesome icon library. ✨
  - [Zustand](https://zustand-demo.pmnd.rs/) - State management library. 🎛️
  - [React Hook Form](https://react-hook-form.com/) - Forms library. 📝
  - [Next Auth](https://next-auth.js.org/) - Authentication library. 🔑
  - [Sonner](https://sonner.emilkowalski.com/) - Toast library. 🍞
  - [Next Theme](https://www.npmjs.com/package/next-theme) - Theme library. 🎨
- **Backend:**
  - [Node.js](https://nodejs.org/en) - JavaScript runtime. 🚀
  - [MongoDB](https://www.mongodb.com/) - NoSQL database. 🗄️
  - [Mongoose](https://mongoosejs.com/) - MongoDB modeling tool. 🧰
  - [Bcryptjs](https://www.npmjs.com/package/bcryptjs) - Password hashing. 🔒
- **Deployment:**
  - [Vercel](https://vercel.com/) - Platform for deployment (or similar services). ☁️

## 🚀 Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/medang-market.git
   cd medang-market
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Create a `.env.local` file in the root directory. 📂
   - Add your MongoDB connection URI as `MONGODB_URI`, and the session secret as `NEXTAUTH_SECRET`. Example:
     ```env
     MONGODB_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/yourdbname
     NEXTAUTH_SECRET=your_secret
     NEXTAUTH_URL=http://localhost:3000
     NEXTAUTH_URL_INTERNAL=http://localhost:3000
     ```
   - Get your Cloudinary cloud name, api key, api secret, and save as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` respectively.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the magic! ✨

## 🗂️ Directory Structure

```
medang-market/
├── src/
│   ├── app/                     # Next.js Application routes 🧭
│   │   ├── api/                # API endpoints 📡
│   │   │   ├── admin/
│   │   │   │   └── user/route.ts # Admin-specific API routes 👮
│   │   │   ├── auth/
│   │   │   │   └── register/route.ts # User registration API route ✍️
│   │   │   ├── cart/route.ts         # API routes for cart 🛒
│   │   │   ├── products/
│   │   │   │   └── [...user]/route.ts  # Dynamic product API routes 📦
│   │   │   └── search/route.ts    # API for search functionality 🔎
│   │   ├── auth/
│   │   │   ├── register/page.tsx      # Register page ✍️
│   │   │   └── signin/page.tsx        # Signin page 🔑
│   │   ├── cart/page.tsx             # Cart page 🛒
│   │   ├── products/page.tsx         # Products page 📦
│   │   ├── [username]/page.tsx           # User profile page 😎
│   │   ├── [username]/[productTitle]/page.tsx       # Individual product page 🖼️
│   │   ├── admin/[...route]/page.tsx # Admin dashboard page 🛡️
│   │   └── page.tsx                # Homepage 🏠
│   ├── components/              # Reusable components 🧩
│   │   ├── layout/              # Layout related components 📐
│   │   │   ├── header.tsx        # Header Component ⬆️
│   │   │   └── footer.tsx        # Footer Component ⬇️
│   │   ├── add-product-dialog.tsx # Modal for adding product ➕
│   │   ├── add-product-to-cart.tsx # Add to cart button 🛒
│   │   ├── auth-provider.tsx # Authentication provider 🔑
│   │   ├── big-product-card.tsx   # Component for product cards 📦
│   │   ├── delete-product-dialog.tsx   # Confirmation modal for product deletion 🗑️
│   │   ├── display-product-card.tsx   # Component for product cards in product list 📦
│   │   ├── edit-product-dialog.tsx  # Edit product dialog ✏️
│   │   ├── edit-profile.tsx  # Edit user profile 😎
│   │   ├── error-dialog.tsx # Error dialog 🚨
│   │   ├── order-history.tsx # Component to view order history 🧾
│   │   ├── search-page.tsx    # Search page with product listings 🔎
│   │   ├── seller-product-card.tsx    # Product card for sellers 🧑‍💼
│   │   └── user-card.tsx    # Component to render user information 👤
│   ├── hooks/                 # Custom React hooks 🪝
│   │    └── use-toast.ts      # Custom toast hook 🍞
│   ├── lib/                   # Helper and library files 📚
│   │   ├── auth-options.ts      # Options for Next Auth 🔑
│   │   ├── db/                # MongoDB database logic 🗄️
│   │   │   ├── connect.ts        # Connection to MongoDB 🔌
│   │   │   ├── init.ts          # Initialize models ⚙️
│   │   │   └── models/       # Models for data schema 📝
│   │   │      ├── banner.model.ts
│   │   │      ├── cart.model.ts
│   │   │      ├── order-item.model.ts
│   │   │      ├── order.model.ts
│   │   │      ├── product-ratings.model.ts
│   │   │      ├── product.model.ts
│   │   │      ├── user.model.ts
│   │   │      └── voucher.model.ts
│   │   └── utils.ts      # Utility functions 🛠️
│   ├── store/               # Zustand state management 🎛️
│   │   └── cart-store.ts    # Cart store 🛒
│   └── globals.css       # Global css styles 🎨
│
├── next.config.js          # Next.js Configuration ⚙️
├── package.json           # Node.js dependencies and scripts 📦
└── README.md            # Project documentation 📜
```

## 🤝 Contributing

We love contributions! If you have an idea for a feature, or you found a bug, feel free to:

1. Fork the repository. 🍴
2. Create a new branch for your feature or bug fix. 🌿
3. Implement the changes and commit them with clear messages. ✍️
4. Create a pull request! 🚀

## 🧑‍🎓 Authors

- **Rizqi** (**[Erzy.sh](https://github.com/Rilaptra)**)
- **Huddin** (**[McWooden](https://github.com/McWooden)**)

Students of SMAN 3 Magelang, class XII. 🎓

---

Let me know if you want any further modifications! 😊
