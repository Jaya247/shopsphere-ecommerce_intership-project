# 🌐 ShopSphere Deployment & Hosting Guide

Follow this guide to deploy your full-featured MERN stack application to production. We will use **Render** to host the Express backend and **Vercel** to host the Vite React frontend. Both offer free hosting tiers.

---

## 🗄️ Step 1: Prepare MongoDB Atlas (Cloud Database)
Render and Vercel services run in the cloud, so they need authorization to read and write to your MongoDB Atlas cluster.

1. Log into [MongoDB Atlas](https://cloud.mongodb.com/).
2. Navigate to **Network Access** under the **Security** tab in the left sidebar.
3. Click **Add IP Address**.
4. Choose **Allow Access From Anywhere** (this adds `0.0.0.0/0` to your whitelist).
5. Click **Confirm**. 
   > [!IMPORTANT]
   > Whitelisting `0.0.0.0/0` is necessary because cloud hosting providers like Render use dynamic IP addresses. Without this, your backend will crash during connection attempts.

---

## 🖥️ Step 2: Deploy the Backend on Render
We will deploy the Node.js/Express backend to Render.

1. Create a free account at [Render](https://render.com/).
2. On your dashboard, click **New +** and select **Web Service**.
3. Link your GitHub account and select your repository: `shopsphere-ecommerce`.
4. Configure the Web Service settings:
   *   **Name**: `shopsphere-backend` (or any unique name).
   *   **Environment**: `Node`.
   *   **Region**: Select the closest region to your target audience.
   *   **Branch**: `main`.
   *   **Root Directory**: `server` (This points Render to compile directly inside the server folder).
   *   **Build Command**: `npm install`
   *   **Start Command**: `node server.js`
5. Click **Advanced** and add these **Environment Variables**:
   *   `NODE_ENV` = `production`
   *   `PORT` = `8000`
   *   `MONGO_URI` = *Your MongoDB Connection String* (Ensure you replace `<password>` with your real database password).
   *   `JWT_SECRET` = *Any secure random string key* (used to sign JWT session tokens).
   *   `GEMINI_API_KEY` = *Your Google AI Studio API Key* (to run the AI Chatbot and Outfit Stylist).
6. Click **Create Web Service**.
7. Render will install dependencies and start the backend. Once active, note the generated live URL (e.g., `https://shopsphere-backend.onrender.com`).

---

## 🎨 Step 3: Deploy the Frontend on Vercel
We will deploy the Vite React frontend to Vercel and link it to our Render backend API.

1. Create a free account at [Vercel](https://vercel.com/) (Sign in with your GitHub account).
2. Click **Add New** and select **Project**.
3. Import your repository: `shopsphere-ecommerce`.
4. Configure the Project settings:
   *   **Project Name**: `shopsphere-client`.
   *   **Framework Preset**: `Vite` (Vercel will detect it automatically).
   *   **Root Directory**: `client` (Click edit and point to the `client` directory to ignore backend code).
   *   **Build Command**: `npm run build`
   *   **Output Directory**: `dist`
5. Open the **Environment Variables** accordion and add the following variable:
   *   **Key**: `VITE_API_URL`
   *   **Value**: `https://your-render-backend-url.onrender.com/api` (Replace with your actual Render live URL from Step 2. Do not forget to append `/api` at the end).
6. Click **Deploy**.
7. Vercel will bundle the application and output a production build. Once completed, your e-commerce client will be live!

---

## 🧪 Step 4: Verification
1. Open the Vercel live URL in your browser.
2. Open your browser inspector/developer console (`F12`).
3. Click **Sign In** or **Register** to trigger a request to the Render backend. Verify that the network status returns a `200 OK` or `201 Created` code.
4. Try out the **Outfit AI** generator page to verify that Gemini API responses load correctly.
5. Create a test order, apply promo codes, and download the tax invoice PDF to confirm full MERN client-server operation!
