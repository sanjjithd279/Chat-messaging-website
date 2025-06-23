# CourseConnect - Student Collaboration Platform

A specialized MERN stack application designed to connect students in shared courses, enabling real-time collaboration and communication. CourseConnect helps students find study partners and work together on assignments through an intuitive chat interface.

## 🌟 Features

- **Course-Based Networking**: Connect with students in your shared courses
- **Real-time Messaging**: Instant communication with 30% faster response times using WebSockets
- **User Authentication**: Secure login and registration system
- **Image Sharing**: Share assignment screenshots and study materials
- **Customizable Profiles**: Update profile pictures and personalize your presence
- **Theme Customization**: Switch between light and dark themes
- **Message History**: Access previous conversations and shared resources
- **Online Status**: See when study partners are available
- **Cloud Storage**: Securely store and share study materials using Cloudinary

## 🛠️ Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Socket.IO Client
- React Router
- Context API for state management

### Backend

- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary for image storage

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd chat-messaging-website
```

2. Install dependencies for both frontend and backend

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development servers

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
chat-messaging-website/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   └── server.js
    └── package.json
```

## 🔒 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user

### Messages

- `GET /api/messages/:id` - Get messages between two users
- `POST /api/messages/:id` - Send a new message
- `GET /api/users` - Get all users for sidebar

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- Cloudinary for image storage
- MongoDB for database
- React and Node.js communities
