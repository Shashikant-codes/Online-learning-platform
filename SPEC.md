# LearnHub - Online Video Learning Platform

## Concept & Vision

LearnHub is a modern online learning platform where instructors can publish video courses and students can enroll to learn. It features a clean, professional design with a focus on content discovery and seamless video playback. The platform feels like a premium educational space — organized, trustworthy, and encouraging of learning momentum.

## Design Language

### Aesthetic Direction
Inspired by modern EdTech platforms like Udemy and Coursera — clean cards, generous whitespace, and a focus on content thumbnails and progress indicators.

### Color Palette
- **Primary**: `#6366F1` (Indigo - trust, learning)
- **Secondary**: `#8B5CF6` (Purple - creativity)
- **Accent**: `#F59E0B` (Amber - highlights, progress)
- **Background**: `#F8FAFC` (Light slate)
- **Surface**: `#FFFFFF` (Cards, modals)
- **Text Primary**: `#1E293B` (Slate 800)
- **Text Secondary**: `#64748B` (Slate 500)
- **Success**: `#10B981`
- **Error**: `#EF4444`

### Typography
- **Headings**: Inter (Google Font) - bold, modern
- **Body**: Inter - clean readability
- **Monospace**: For code snippets

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Border radius: 8px (cards), 12px (buttons), 16px (modals)
- Max content width: 1280px

### Motion Philosophy
- Subtle hover lifts on cards (translateY -2px, shadow increase)
- Smooth page transitions (300ms ease)
- Loading skeletons for content
- Progress bar animations

## Architecture

### Backend - Spring Boot
```
src/main/java/com/learnhub/
├── LearnHubApplication.java
├── model/
│   ├── User.java
│   ├── Course.java
│   ├── Lesson.java
│   └── Enrollment.java
├── repository/
│   ├── UserRepository.java
│   ├── CourseRepository.java
│   ├── LessonRepository.java
│   └── EnrollmentRepository.java
├── service/
│   ├── UserService.java
│   ├── CourseService.java
│   └── EnrollmentService.java
└── controller/
    ├── AuthController.java
    ├── CourseController.java
    └── EnrollmentController.java
```

### Database Schema (MySQL)
- **users**: id, name, email, password, role (INSTRUCTOR/STUDENT), created_at
- **courses**: id, title, description, thumbnail_url, price, instructor_id, created_at
- **lessons**: id, course_id, title, video_url, duration_seconds, order_index
- **enrollments**: id, user_id, course_id, progress_percent, enrolled_at

### API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/courses` - List all courses
- `GET /api/courses/{id}` - Get course details with lessons
- `POST /api/courses` - Create course (instructor)
- `POST /api/courses/{id}/lessons` - Add lesson to course
- `POST /api/enrollments` - Enroll in a course
- `GET /api/enrollments/my` - Get user's enrolled courses
- `PUT /api/enrollments/{id}/progress` - Update progress

## Features & Interactions

### Public Features
- **Course Catalog**: Browse all available courses with search/filter
- **Course Details**: View course info, curriculum, instructor, reviews
- **Video Player**: Embedded video playback with controls

### Student Features
- **Enrollment**: One-click enrollment in courses
- **Progress Tracking**: Visual progress bar per course
- **My Learning**: Dashboard of enrolled courses
- **Continue Learning**: Resume from last watched lesson

### Instructor Features
- **Course Creation**: Create courses with title, description, price
- **Lesson Management**: Add/edit/delete lessons with video URLs
- **Dashboard**: View enrollment numbers

## Component Inventory

### CourseCard
- Thumbnail image (16:9 aspect ratio)
- Title (max 2 lines, truncate)
- Instructor name
- Rating stars + review count
- Price badge
- Hover: lift + shadow increase

### LessonItem
- Play icon + lesson title
- Duration badge
- Completion checkmark
- States: locked, available, in-progress, completed

### VideoPlayer
- 16:9 responsive container
- Play/pause controls
- Progress scrubber
- Volume control
- Fullscreen toggle
- Quality selector

### EnrollmentButton
- Default: "Enroll Now" with price
- Enrolled: "Go to Course" 
- Loading: spinner
- Hover: background darken

### ProgressBar
- Track: gray-200
- Fill: gradient primary to secondary
- Animated width transition
- Percentage label

## Technical Approach

### Backend
- **Framework**: Spring Boot 3.x
- **Database**: MySQL with JPA/Hibernate
- **Security**: JWT-based authentication
- **Validation**: Spring Validation annotations

### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **State**: React hooks + Context
- **HTTP**: Axios
- **Routing**: React Router v6

### Data Flow
1. User registers/logs in → JWT token stored
2. Browse courses → GET /api/courses → CourseCard grid
3. Click course → GET /api/courses/{id} → Course detail + lessons
4. Enroll → POST /api/enrollments → Update UI
5. Watch video → Track progress → PUT /api/enrollments/{id}/progress
