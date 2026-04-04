# 🎓 LearnHub - Online Learning Platform

A full-stack online learning platform similar to Udemy, built with Spring Boot, MySQL, and React.

## ✨ New Features!

### 📹 Direct Video Upload
- Upload videos directly from your computer
- Videos are stored locally on the server
- Support for MP4, MOV, AVI, WebM formats (up to 500MB)
- Drag & drop video upload

### 📊 Instructor Dashboard
- Complete dashboard for course management
- View statistics (courses, lessons, students, revenue)
- Create, edit, and delete courses
- Add, edit, and delete lessons with video
- Preview your own videos without enrollment

---

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (for Spring Boot)
- **Maven** (for Spring Boot)
- **Node.js 16+** (for React)
- **MySQL 8.0+**

### 1. Backend Setup (Spring Boot)

```bash
cd backend
```

**Configure MySQL Password:**
Open `src/main/resources/application.properties` and set your MySQL password:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

**Run the Backend:**
```bash
# Option 1: Using Maven
mvn spring-boot:run

# Option 2: In IntelliJ
# Right-click on LearnHubApplication.java → Run
```

The backend will start at **http://localhost:8080**

### 2. Frontend Setup (React)

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will start at **http://localhost:5173**

---

## 🎯 Key Features

### For Students 👨‍🎓
- Browse and search courses
- Enroll in courses
- Watch video lessons
- Track enrolled courses
- Progress through lessons

### For Instructors 👨‍🏫
- **Instructor Dashboard** with statistics
- Create unlimited courses
- Upload videos directly (stored locally)
- Add lessons to courses
- Edit/delete courses and lessons
- Preview own videos without enrollment
- Publish/unpublish courses

---

## 📁 Project Structure

```
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/learnhub/
│   │   ├── LearnHubApplication.java  # Main entry point
│   │   ├── config/                  # Security & CORS config
│   │   ├── controller/              # REST API endpoints
│   │   │   ├── AuthController.java
│   │   │   ├── CourseController.java
│   │   │   ├── LessonController.java
│   │   │   ├── EnrollmentController.java
│   │   │   └── VideoUploadController.java  # NEW: Video upload
│   │   ├── dto/                     # Data transfer objects
│   │   ├── model/                   # JPA entities
│   │   ├── repository/             # Database repositories
│   │   ├── security/               # JWT authentication
│   │   └── service/                # Business logic
│   └── src/main/resources/
│       └── application.properties  # Configuration
│
├── src/                              # React Frontend
│   ├── App.tsx                      # Main application
│   └── ...
│
└── uploads/videos/                  # NEW: Video storage (auto-created)
```

---

## 🔐 Test Accounts

| Role | Email | Password | How to Create |
|------|-------|----------|---------------|
| Student | Register in UI | Choose role "Student" | Sign up page |
| Instructor | Register in UI | Choose role "Instructor" | Sign up page |

---

## 🎥 Video Upload Feature

### How to Upload a Video:
1. Login as **Instructor**
2. Go to **Instructor Dashboard**
3. Click **Edit** on a course
4. Click **+ Add** in the Lessons section
5. **Drag & drop** a video file or click **Browse Files**
6. Wait for upload to complete
7. Fill in lesson details and save

### Video Storage:
- Videos are stored in: `backend/uploads/videos/`
- Videos are served at: `http://localhost:8080/api/videos/stream/{filename}`
- Supported formats: MP4, MOV, AVI, WebM
- Max file size: 500MB

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all published courses |
| GET | `/api/courses/{id}` | Get course details |
| POST | `/api/courses` | Create course (Instructor) |
| PUT | `/api/courses/{id}` | Update course (Owner) |
| DELETE | `/api/courses/{id}` | Delete course (Owner) |
| GET | `/api/courses/my-courses` | Get instructor's courses |
| GET | `/api/courses/instructor/dashboard` | Get dashboard stats |

### Lessons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lessons/course/{id}` | Get lessons for course |
| POST | `/api/lessons` | Create lesson (Course owner) |
| PUT | `/api/lessons/{id}` | Update lesson (Course owner) |
| DELETE | `/api/lessons/{id}` | Delete lesson (Course owner) |

### Video Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/videos/upload` | Upload video file |
| GET | `/api/videos/stream/{filename}` | Stream video |
| DELETE | `/api/videos/delete/{filename}` | Delete video |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/enrollments/{courseId}` | Enroll in course |
| GET | `/api/enrollments/my` | Get my enrollments |

---

## 🛠️ Troubleshooting

### Video not playing?
1. Check if video file exists in `backend/uploads/videos/`
2. Verify video format is supported (MP4 recommended)
3. Check browser console for errors
4. Ensure backend is running on port 8080

### Upload fails?
1. Check if `uploads/videos/` folder exists
2. Verify MySQL is running
3. Check backend console for errors
4. Ensure file size is under 500MB

### CORS errors?
1. Backend CORS is configured to allow all origins
2. Restart the backend if issues persist

---

## 📝 Future Enhancements
- [ ] Video progress tracking
- [ ] Course categories
- [ ] Reviews and ratings
- [ ] Payment integration
- [ ] Quizzes and assessments
- [ ] Certificates generation

---

**Built with ❤️ using Spring Boot, MySQL, React & Tailwind CSS**
