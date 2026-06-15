# ExpenseWise - Frontend

ExpenseWise is a modern, premium personal finance and savings tracking application. It features a sleek glassmorphism UI, interactive 3D animations, and robust financial tracking capabilities to help you achieve your financial freedom.

## ✨ Features

- **Premium UI/UX:** Dark mode aesthetics with neon green accents and smooth micro-animations.
- **3D Animations:** Custom 3D cube loading screens and interactive animated backgrounds.
- **Smart Dashboard:** Real-time data visualization of expenses vs. budgets using Chart.js.
- **Secure Authentication:** JWT-based login and registration with strong password enforcement.
- **Goal Tracking:** Visualize your progress towards customized savings goals.
- **Responsive Design:** Completely mobile-friendly experience.

## 🛠️ Tech Stack

- **Framework:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Routing:** React Router DOM
- **Styling:** Custom Vanilla CSS (Glassmorphism & Flexbox/Grid)
- **Data Fetching:** Axios (with dynamic interceptors)
- **Visuals:** Chart.js (via react-chartjs-2)

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/expensewise-frontend.git
   cd expensewise-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root of the project and add your backend API URL (it defaults to `/api` for production or `http://localhost:8080/api` for local development):
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to see the app in action!

## 📦 Deployment (Vercel / Netlify)

This project is fully optimized for platforms like Vercel. 
Simply connect your GitHub repository, ensure the build command is set to `npm run build`, and add the `VITE_API_URL` pointing to your live Spring Boot backend server in the platform's Environment Variables dashboard.
