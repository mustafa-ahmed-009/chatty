# 💬 Chatty - Real-Time Chat Application

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://chatty-umber-psi.vercel.app)
![Tech Stack](https://img.shields.io/badge/stack-MERN-61DAFB?logo=react&logoColor=white)

A WhatsApp-like messaging platform with real-time functionality, built with React 19, Socket.IO, and Express 5.

![Description of image](https://drive.google.com/uc?export=view&id=1b29f2OYFyvsiIhqN9NAAL25Uqy13fYzt)
![Description](https://drive.google.com/uc?export=view&id=1q8WqSx_KcgLIOVSs6lh0oiGWowRVxtf7)
![Description](https://drive.google.com/uc?export=view&id=1yP1ZIo4KgJUfSzkcJXe6TOQfxHMnc8uh)


## ✨ Features

### 💌 Messaging
- Real-time message delivery with Socket.IO
- Message status indicators (sent/delivered/read)
- Typing indicators
- Message history persistence

### 👤 User Experience
- Light/dark theme switching
- Online presence detection
- Profile customization with Cloudinary avatars
- Responsive design for all devices

### 🔒 Security
- JWT authentication with cookie storage
- Password encryption with bcrypt

## 🛠️ Tech Stack

**Frontend:**
- React 19 (Vite)
- TypeScript
- Zustand state management
- Tailwind CSS + DaisyUI
- Socket.IO client
- React Hook Form + Zod

**Backend:**
- Express 5
- MongoDB (Mongoose)
- Socket.IO server
- JWT authentication
- Cloudinary integration

## 🚀 Live Demo

Experience the app live: [https://chatty-umber-psi.vercel.app](https://chatty-umber-psi.vercel.app)

## 🚀 Testing Instructions

To fully experience the real-time chat functionality, please follow these steps:

1. **Open two different browsers** (e.g., Chrome + Firefox) or use **Incognito/Private windows**
2. **Create two test accounts**

## 💻 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas or local instance
- Cloudinary account (for avatars)

### Installation
```bash
# Clone repository
git clone https://github.com/mustafa-ahmed-009/chatty.git
cd chatty

# Install backend dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit with your credentials

# Start backend
npm run dev

# Setup frontend
cd ../frontend
npm install
npm run dev
