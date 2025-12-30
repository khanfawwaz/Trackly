# 📚 Trackly - Student Assistant Platform

<div align="center">

![Trackly Logo](./public/assets/trackly%20logo.png)

**Your all-in-one academic companion for managing assignments, projects, and internship applications.**

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-ffca28?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff?logo=vite)](https://vitejs.dev/)

[Live Demo](#) • [Report Bug](https://github.com/khanfawwaz/Trackly/issues) • [Request Feature](https://github.com/khanfawwaz/Trackly/issues)

</div>

---

## 🌟 Overview

**Trackly** is a modern, feature-rich student productivity platform designed to help students stay organized throughout their academic journey. Whether you're juggling multiple assignments, managing complex projects, or tracking internship applications, Trackly provides an intuitive dashboard to keep everything in one place.

### ✨ Key Features

- 📊 **Unified Dashboard** - Get a comprehensive overview of all your academic activities at a glance
- 📝 **Assignment Tracker** - Never miss a deadline with smart priority management and due date tracking
- 🚀 **Project Management** - Organize your academic and personal projects with status tracking (Todo, In Progress, Done)
- 💼 **Internship Tracker** - Monitor your job applications from "Applied" to "Offer" with detailed status tracking
- 📅 **Calendar Integration** - Visualize your workload with an integrated calendar view
- � **Secure Authentication** - Firebase-powered authentication with email/password support
- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations and dark mode
- ⚡ **Real-time Sync** - Cloud-based storage ensures your data is always up-to-date across devices

---

## 📸 Screenshots

### Dashboard
![Dashboard Screenshot](./screenshots/dashboard.png)
*Main dashboard showing overview of assignments, projects, and internship applications*

### Assignment Tracker
![Assignments Screenshot](./screenshots/assignments.png)
*Manage all your assignments with priority levels and due dates*

### Project Management
![Projects Screenshot](./screenshots/projects.png)
*Track your academic and personal projects with status updates*

### Internship Tracker
![Internships Screenshot](./screenshots/internships.png)
*Monitor your internship applications and interview progress*

### Calendar View
![Calendar Screenshot](./screenshots/calendar.png)
*Visualize all your deadlines and important dates in one place*

---

## �️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend framework for building the user interface |
| **TypeScript** | Type-safe JavaScript for better development experience |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **Firebase Auth** | Secure user authentication and authorization |
| **Firestore** | NoSQL cloud database for real-time data storage |
| **Framer Motion** | Smooth animations and transitions |
| **React Router** | Client-side routing and navigation |
| **date-fns** | Modern date utility library |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Firebase account** - [Sign up](https://firebase.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/khanfawwaz/Trackly.git
   cd Trackly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Email/Password** authentication in the Authentication section
   - Create a **Firestore Database** in production mode
   - Copy your Firebase configuration

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   
   > 💡 **Tip:** Use `.env.example` as a reference template

5. **Configure Firestore Security Rules**
   
   Add these rules in your Firebase Console under Firestore Database > Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /assignments/{assignmentId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       match /projects/{projectId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       match /internships/{internshipId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The optimized build will be in the `dist/` folder, ready to be deployed.

---

## 📁 Project Structure

```
Trackly/
├── public/
│   └── assets/          # Static assets (logo, images)
├── src/
│   ├── auth/            # Authentication components and context
│   ├── components/      # Reusable UI components
│   ├── dashboard/       # Dashboard page and components
│   ├── features/        # Feature-specific modules
│   │   ├── assignments/ # Assignment tracker
│   │   ├── projects/    # Project management
│   │   └── internships/ # Internship tracker
│   ├── firebase/        # Firebase configuration and utilities
│   ├── utils/           # Helper functions and utilities
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variable template
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

---

## 🔒 Security & Privacy

- **Environment Variables**: All sensitive Firebase credentials are stored in `.env` files, which are excluded from version control
- **Authentication**: Firebase Authentication ensures secure user login and registration
- **Data Privacy**: Firestore security rules ensure users can only access their own data
- **HTTPS**: All Firebase connections are encrypted with HTTPS

> ⚠️ **Important**: Never commit your `.env` file to version control. Always use `.env.example` as a template.

---

## 🎯 Features in Detail

### Assignment Tracker
- Add, edit, and delete assignments
- Set priority levels (Low, Medium, High)
- Track due dates with visual indicators
- Mark assignments as pending, in progress, or completed
- Automatic overdue detection

### Project Management
- Organize projects with detailed descriptions
- Add repository links for coding projects
- Track project status (Todo, In Progress, Done)
- Set deadlines and monitor progress

### Internship Tracker
- Log internship applications with company details
- Track application status (Applied, Shortlisted, Interview, Offer, Rejected)
- Add notes and follow-up reminders
- Monitor your job search progress

### Dashboard Analytics
- Quick overview of pending and overdue assignments
- Project status breakdown
- Internship application statistics
- Visual calendar with all important dates

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com/) and import your repository
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Configure environment variables in Netlify settings

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Fawwaz Khan**

- GitHub: [@khanfawwaz](https://github.com/khanfawwaz)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Icons and emojis from [Heroicons](https://heroicons.com/)
- UI inspiration from modern productivity apps
- Built with ❤️ for students everywhere

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Fawwaz Khan](https://github.com/khanfawwaz)

</div>
