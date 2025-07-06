# TaskBuddy - Your Personal Task Manager 📝

TaskBuddy is a full-stack task management application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It helps users efficiently manage their daily tasks with a modern, user-friendly interface.

![TaskBuddy Banner](https://ui-avatars.com/api/?name=Task+Buddy&size=220&background=random)

## ✨ Features

- 📌 Create, update, and delete tasks
- 🎯 Set task priorities (Low, Medium, High)
- 📅 Due date management
- 🔍 Filter tasks by status and priority
- 📊 Task statistics dashboard
- 🔒 Secure user authentication
- 💫 Modern and responsive UI

## 🚀 Live Demo

[Live Demo Link](https://task-buddy-mern.vercel.app/) - https://task-buddy-mern.vercel.app/

## 🛠️ Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)

## 📥 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/TaskBuddyMern.git
   cd TaskBuddyMern
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

## ⚙️ Configuration

1. In the server directory, create a `.env` file:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

2. In the client directory, create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:4000
   ```

## 🚀 Running the Application

1. Start the server:
   ```bash
   cd server
   npm start
   ```

2. In a new terminal, start the client:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and visit:
   ```
   http://localhost:5173
   ```

## 📱 Usage

1. **Sign Up/Login**:
   - Create a new account or login with existing credentials
   - Secure authentication using JWT

2. **Dashboard**:
   - View task statistics
   - Quick access to all, pending, and completed tasks
   - Filter tasks by priority and due date

3. **Task Management**:
   - Create new tasks with title, description, priority, and due date
   - Update existing tasks
   - Mark tasks as complete
   - Delete unwanted tasks

4. **Profile**:
   - View and update profile information
   - Manage account settings

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## 📁 Project Structure

```
TaskBuddyMern/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   └── assets/       # Static assets
│   └── public/           # Public assets
└── server/               # Backend Node.js application
    ├── config/          # Configuration files
    ├── controllers/     # Request handlers
    ├── models/         # Database models
    ├── routes/         # API routes
    └── middleware/     # Custom middleware
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Your Name
- GitHub: [@saurabhjaykar1603](https://github.com/saurabhjaykar1603)
- LinkedIn: [Saurabh Jaykar](https://www.linkedin.com/in/saurabh-jaykar/)

## 🙏 Acknowledgments

- [React Icons](https://react-icons.github.io/react-icons/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
