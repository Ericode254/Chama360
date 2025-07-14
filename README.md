# 🌱 Chama360

> Build, manage, and grow your chama — together.

Chama360 is a modern, full-stack web application designed for *chamas* (informal savings groups and investment clubs common in Kenya and East Africa).  
It helps users create or join a chama, contribute money securely via **M-Pesa integration**, and track savings, loans, and shared goals in real time.

---

## ✨ Features

✅ **Create or Join a Chama**  
Start a new chama as an admin or join an existing chama using a unique invite code.

✅ **Secure Contributions via M-Pesa**  
Send your contributions directly to your chama's escrow paybill through integrated **M-Pesa STK Push**, with automatic tracking and receipts.

✅ **Real-time Tracking**  
View live updates of your chama balance, contributions, and member activity thanks to Convex’s real-time backend.

✅ **Loan Requests & Approvals**  
Request loans from the chama pool; admins can approve and disburse via **M-Pesa B2C API**.

✅ **Modern UI & UX**  
Built with React / Next.js and styled for clarity and ease of use.

---

## 🛠 Tech Stack

- 🧩 **Frontend:** React / Next.js + Tailwind CSS
- ⚡ **Backend:** [Convex](https://convex.dev) for real-time data and business logic
- 💰 **Payments:** Safaricom [Daraja API](https://developer.safaricom.co.ke/daraja/apis/post/safaricom-sandbox) (STK Push & B2C)
- ☁ **Serverless Functions:** Netlify Functions for handling M-Pesa callbacks securely

---

## 🚀 Getting Started

> ⚠ You need M-Pesa Daraja sandbox credentials and a Convex project set up.

```bash
# Clone the repo
git clone https://github.com/your-username/chama360.git
cd chama360

# Install dependencies
bun install

# Start the development server
npm run dev

## The architecture
Frontend (React, shadcnui, tailwindcss)
    │
    ├─ Convex queries (list chamas, members, contributions)
    ├─ Convex mutations (create chama, join chama, initiate payment, request loan)
    │
Small server (Node.js / serverless)
    ├─ Receives M-Pesa callbacks → updates Convex DB
    │
M-Pesa Daraja API
    ├─ STK Push (collect funds)
    └─ B2C (disburse funds: loans / payouts)


