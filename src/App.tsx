import { useState, useEffect, useRef } from 'react'

const API_URL = 'http://localhost:8080/api';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR';
}

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  published: boolean;
  instructor: User;
  category?: Category;
  lessons?: Lesson[];
  enrollments?: any[];
  createdAt: string;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  orderIndex: number;
  course?: Course;
}

interface DashboardStats {
  totalCourses: number;
  totalLessons: number;
  totalStudents: number;
  totalRevenue: number;
  courses: any[];
}

// Auth Helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('userEmail');
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (email) headers['X-User-Email'] = email;
  return headers;
};

// Navbar Component
function Navbar({ user, onPageChange, currentPage }: { user: User | null; onPageChange: (page: string) => void; currentPage: string }) {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 
              className="text-2xl font-bold cursor-pointer hover:text-indigo-200" 
              onClick={() => onPageChange('home')}
            >
              🎓 LearnHub
            </h1>
            <div className="hidden md:flex space-x-4">
              <button 
                onClick={() => onPageChange('home')}
                className={`px-3 py-2 rounded-md ${currentPage === 'home' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
              >
                Home
              </button>
              <button 
                onClick={() => onPageChange('courses')}
                className={`px-3 py-2 rounded-md ${currentPage === 'courses' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
              >
                Courses
              </button>
              {user?.role === 'INSTRUCTOR' && (
                <button 
                  onClick={() => onPageChange('instructor')}
                  className={`px-3 py-2 rounded-md ${currentPage === 'instructor' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
                >
                  📚 Instructor Dashboard
                </button>
              )}
              {user && (
                <button 
                  onClick={() => onPageChange('my-learning')}
                  className={`px-3 py-2 rounded-md ${currentPage === 'my-learning' ? 'bg-indigo-700' : 'hover:bg-indigo-500'}`}
                >
                  📖 My Learning
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">👤 {user.name}</span>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onPageChange('login')}
                  className="hover:bg-indigo-500 px-4 py-2 rounded-md"
                >
                  Login
                </button>
                <button 
                  onClick={() => onPageChange('register')}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Login Page
function LoginPage({ onPageChange, onLogin }: { onPageChange: (page: string) => void; onLogin: (user: User) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        onLogin(data.user);
        onPageChange('home');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Welcome Back!</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <button onClick={() => onPageChange('register')} className="text-indigo-600 hover:underline">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

// Register Page
function RegisterPage({ onPageChange, onLogin }: { onPageChange: (page: string) => void; onLogin: (user: User) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        onLogin(data.user);
        onPageChange('home');
      } else {
        setError('Registration failed. Email may already be in use.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Create Account</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
              minLength={6}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">I want to:</label>
            <div className="flex gap-4">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer flex-1">
                <input
                  type="radio"
                  value="STUDENT"
                  checked={role === 'STUDENT'}
                  onChange={() => setRole('STUDENT')}
                  className="mr-2"
                />
                <span>Learn</span>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer flex-1">
                <input
                  type="radio"
                  value="INSTRUCTOR"
                  checked={role === 'INSTRUCTOR'}
                  onChange={() => setRole('INSTRUCTOR')}
                  className="mr-2"
                />
                <span>Teach</span>
              </label>
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">
            Create Account
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <button onClick={() => onPageChange('login')} className="text-indigo-600 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

// Home Page
function HomePage({ onPageChange }: { onPageChange: (page: string) => void }) {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Failed to load courses:', err));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Learn Without Limits</h1>
          <p className="text-xl mb-8">Build skills with courses, lectures, and videos from expert instructors</p>
          <button 
            onClick={() => onPageChange('courses')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-100 transition"
          >
            Explore Courses
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold mb-2">Video Lessons</h3>
            <p className="text-gray-600">Learn from high-quality video content</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-gray-600">Learn from industry professionals</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold mb-2">Certificates</h3>
            <p className="text-gray-600">Earn certificates upon completion</p>
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Courses</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {courses.slice(0, 6).map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl">📚</span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-600 font-bold">${course.price}</span>
                    <button 
                      onClick={() => onPageChange(`course-${course.id}`)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Type
interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

// Courses Catalog Page
function CoursesPage({ onPageChange }: { onPageChange: (page: string) => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCategories();
    loadCourses();
  }, []);

  const loadCategories = () => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to load categories:', err));
  };

  const loadCourses = () => {
    fetch(`${API_URL}/courses`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Failed to load courses:', err));
  };

  const handleSearch = () => {
    if (search.trim()) {
      fetch(`${API_URL}/courses/search?keyword=${search}`)
        .then(res => res.json())
        .then(data => setCourses(data))
        .catch(err => console.error('Search failed:', err));
    } else {
      loadCourses();
    }
  };

  const filteredCourses = selectedCategory
    ? courses.filter(c => c.category?.id === selectedCategory)
    : courses;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Courses</h1>
      
      {/* Search Bar */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search courses..."
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full transition ${
              selectedCategory === null 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Courses
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full transition ${
                selectedCategory === cat.id 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-4">{filteredCourses.length} courses found</p>

      {/* Course Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
            <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">📚</span>
              )}
            </div>
            <div className="p-6">
              {course.category && (
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                  {course.category.icon} {course.category.name}
                </span>
              )}
              <h3 className="font-semibold text-lg mb-2 mt-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{course.instructor?.name}</p>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-indigo-600 font-bold text-lg">${course.price}</span>
                <button 
                  onClick={() => onPageChange(`course-${course.id}`)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">No courses found in this category!</p>
        </div>
      )}
    </div>
  );
}

// Video Player Component
function VideoPlayer({ videoUrl }: { videoUrl: string; title?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Convert relative paths to full URL
  const getFullVideoUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        controls
        preload="metadata"
        className="w-full aspect-video"
        src={getFullVideoUrl(videoUrl)}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

// Course Detail Page
// ─────────────────────────────────────────────────────────────
// REPLACE the entire CourseDetailPage function in your App.tsx
// ─────────────────────────────────────────────────────────────

function CourseDetailPage({ courseId, user, onPageChange }: {
  courseId: number;
  user: User | null;
  onPageChange: (page: string) => void;
}) {
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourseDetails();
  }, [courseId]);

  const loadCourseDetails = () => {
    fetch(`${API_URL}/courses/${courseId}/details`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        setCourse(data.course);
        setLessons(data.lessons || []);
        setIsEnrolled(data.isEnrolled);
        setIsOwner(data.isOwner);
        // Only auto-select first lesson if user has access
        if ((data.isEnrolled || data.isOwner) && data.lessons?.length > 0) {
          setSelectedLesson(data.lessons[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load course:', err);
        setLoading(false);
      });
  };

  const handleEnroll = async () => {
    if (!user) {
      onPageChange('login');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/enrollments/${courseId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        alert('Successfully enrolled! You can now watch all lessons.');
        loadCourseDetails(); // Reload to get videoUrls now that user is enrolled
      }
    } catch (err) {
      console.error('Enrollment failed:', err);
    }
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (!course) return <div className="text-center py-16">Course not found</div>;

  const hasAccess = isEnrolled || isOwner;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-2">

          {/* Video player or preview area */}
          {hasAccess && selectedLesson?.videoUrl ? (
            <div>
              <VideoPlayer videoUrl={selectedLesson.videoUrl} title={selectedLesson.title} />
              <div className="mt-4">
                <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
                <p className="text-gray-600 mt-2">{selectedLesson.description}</p>
              </div>
            </div>
          ) : (
            // Course preview for unenrolled users
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-12 text-center text-white">
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
              <p className="text-indigo-100 mb-6">
                Enroll to unlock {lessons.length} lesson{lessons.length !== 1 ? 's' : ''} and start learning
              </p>
              {!hasAccess && (
                <div className="bg-white bg-opacity-20 rounded-lg p-4 inline-block">
                  <p className="text-sm text-indigo-100">🔒 Enroll below to access all video lessons</p>
                </div>
              )}
            </div>
          )}

          {/* Course Info */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">About This Course</h2>
            <p className="text-gray-600">{course.description}</p>
            <div className="mt-4 flex gap-6 text-sm text-gray-500">
              <p><strong className="text-gray-700">Instructor:</strong> {course.instructor?.name}</p>
              <p><strong className="text-gray-700">Lessons:</strong> {lessons.length}</p>
              {course.level && <p><strong className="text-gray-700">Level:</strong> {course.level}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">

            {/* Price */}
            <div className="text-center mb-6">
              <span className="text-4xl font-bold text-indigo-600">${course.price}</span>
            </div>

            {/* CTA Button */}
            {isOwner ? (
              <div className="bg-indigo-100 text-indigo-800 p-3 rounded-lg text-center mb-4 font-medium">
                ✓ You are the instructor
              </div>
            ) : isEnrolled ? (
              <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center mb-4 font-medium">
                ✓ Enrolled — select a lesson to watch
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 mb-4 transition"
              >
                Enroll Now — Start Learning
              </button>
            )}

            {/* What you get */}
            {!hasAccess && (
              <div className="border rounded-lg p-4 mb-4 text-sm text-gray-600">
                <p className="font-semibold text-gray-700 mb-2">This course includes:</p>
                <ul className="space-y-1">
                  <li>🎬 {lessons.length} video lesson{lessons.length !== 1 ? 's' : ''}</li>
                  <li>📱 Access on any device</li>
                  <li>♾️ Full lifetime access</li>
                </ul>
              </div>
            )}

            {/* Lesson List */}
            <h3 className="font-semibold mb-3 text-gray-700">Course Content</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {lessons.map((lesson: any, index: number) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    if (hasAccess && lesson.videoUrl) {
                      setSelectedLesson(lesson);
                    } else if (!hasAccess) {
                      alert('Please enroll in this course to watch the lessons.');
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedLesson?.id === lesson.id
                      ? 'bg-indigo-100 border-l-4 border-indigo-600'
                      : hasAccess
                        ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                        : 'bg-gray-50 cursor-not-allowed opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                      hasAccess ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      {hasAccess ? index + 1 : '🔒'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{lesson.title}</p>
                      {lesson.duration && (
                        <p className="text-xs text-gray-500">
                          {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
                        </p>
                      )}
                    </div>
                    {!hasAccess && (
                      <span className="text-xs text-gray-400 flex-shrink-0">Locked</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {lessons.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No lessons available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// My Learning Page
function MyLearningPage({ user, onPageChange }: { user: User; onPageChange: (page: string) => void }) {
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/enrollments/my`, { headers: getAuthHeaders() })
        .then(res => res.json())
        .then(data => setEnrollments(data))
        .catch(err => console.error('Failed to load enrollments:', err));
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Learning</h1>
      
      {enrollments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-xl mb-4">You haven't enrolled in any courses yet</p>
          <button 
            onClick={() => onPageChange('courses')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {enrollments.map(enrollment => (
            <div key={enrollment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                {enrollment.course?.thumbnail ? (
                  <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">📚</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">{enrollment.course?.title}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Instructor: {enrollment.course?.instructor?.name}
                </p>
                <button 
                  onClick={() => onPageChange(`course-${enrollment.course?.id}`)}
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Video Upload Component
// Video Upload Component - FIXED VERSION
// Replace the entire VideoUpload function in your App.tsx with this:

function VideoUpload({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/videos/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'X-User-Email': localStorage.getItem('userEmail') || ''
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Backend returns { videoUrl, filename, originalName, size }
        if (data.videoUrl) {
          onUploadComplete(data.videoUrl);
          alert('Video uploaded successfully!');
        } else {
          alert('Upload failed: ' + (data.error || 'No video URL returned'));
        }
      } else {
        // Handle HTTP errors (403, 500, etc.)
        alert('Upload failed: ' + (data.error || `Server error (${response.status})`));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload video. Check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
        dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div>
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p>Uploading video...</p>
        </div>
      ) : (
        <>
          <div className="text-4xl mb-4">📤</div>
          <p className="text-gray-600 mb-4">Drag and drop a video file here, or</p>
          <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700">
            Browse Files
            <input type="file" accept="video/*" className="hidden" onChange={handleFileSelect} />
          </label>
          <p className="text-xs text-gray-500 mt-2">Supported: MP4, MOV, AVI, WebM (Max 500MB)</p>
        </>
      )}
    </div>
  );
}

// Add/Edit Lesson Modal
function LessonModal({ courseId, lesson, onClose, onSave }: { 
  courseId: number; 
  lesson?: Lesson | null; 
  onClose: () => void; 
  onSave: () => void;
}) {
  const [title, setTitle] = useState(lesson?.title || '');
  const [description, setDescription] = useState(lesson?.description || '');
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl || '');
  const [duration, setDuration] = useState(lesson?.duration || 0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !videoUrl) {
      alert('Title and Video are required');
      return;
    }

    setSaving(true);
    try {
      const url = lesson 
        ? `${API_URL}/lessons/${lesson.id}` 
        : `${API_URL}/lessons`;
      
      const method = lesson ? 'PUT' : 'POST';
      const body = {
        title,
        description,
        videoUrl,
        duration,
        courseId,
        orderIndex: lesson?.orderIndex || 0
      };

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        alert('Failed to save lesson');
      }
    } catch (err) {
      alert('Error saving lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lesson) return;
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const response = await fetch(`${API_URL}/lessons/${lesson.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        alert('Failed to delete lesson');
      }
    } catch (err) {
      alert('Error deleting lesson');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">{lesson ? 'Edit Lesson' : 'Add New Lesson'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Lesson Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter lesson title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg"
              rows={3}
              placeholder="Enter lesson description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Video *</label>
            {videoUrl ? (
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Video selected:</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate flex-1">{videoUrl}</span>
                  <button 
                    onClick={() => setVideoUrl('')}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-2">
                  <VideoPlayer videoUrl={videoUrl} title={title || ''} />
                </div>
              </div>
            ) : (
              <VideoUpload onUploadComplete={(url) => setVideoUrl(url)} />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg"
              placeholder="Duration in seconds"
            />
          </div>
        </div>
        <div className="p-6 border-t flex justify-between">
          <div>
            {lesson && (
              <button 
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Lesson'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Course Editor Component
function CourseEditor({ course, onClose, onSave }: { 
  course?: Course | null; 
  onClose: () => void; 
  onSave: () => void;
}) {
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [price, setPrice] = useState(course?.price || 0);
  const [thumbnail, setThumbnail] = useState(course?.thumbnail || '');
  const [published, setPublished] = useState(course?.published || false);
  const [categoryId, setCategoryId] = useState<number | null>(course?.category?.id || null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>(course?.lessons || []);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
    if (course) {
      loadLessons();
    }
  }, [course?.id]);

  const loadCategories = () => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to load categories:', err));
  };

  const loadLessons = () => {
      if (course?.id) {
        fetch(`${API_URL}/lessons/course/${course.id}`, {
          headers: getAuthHeaders()          // ← THE ONLY CHANGE
        })
          .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(data => setLessons(data))
          .catch(err => console.error('Failed to load lessons:', err));
      }
    };

  const handleSave = async () => {
    if (!title) {
      alert('Title is required');
      return;
    }

    setSaving(true);
    try {
      const url = course ? `${API_URL}/courses/${course.id}` : `${API_URL}/courses`;
      const method = course ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description, price, thumbnail, published, categoryId })
      });

      if (response.ok) {
              const savedCourse = await response.json();
              if (!course) {
                // New course created — go back to dashboard to pick it up
                alert('Course created! You can now add lessons.');
                onSave();
              } else {
                // Existing course updated — reload lessons
                loadLessons();
                alert('Course updated successfully!');
              }
            } else {
              const errData = await response.json().catch(() => ({}));
              alert('Failed to save course: ' + (errData.error || errData.message || `HTTP ${response.status}`));
            }
    } catch (err) {
      alert('Error saving course');
    } finally {
      setSaving(false);
    }
  };

  const handleLessonSave = () => {
    loadLessons();
  };

  const deleteCourse = async () => {
    if (!course) return;
    if (!confirm('Are you sure you want to delete this course? This cannot be undone.')) return;

    try {
      const response = await fetch(`${API_URL}/courses/${course.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        onSave();
        onClose();
      } else {
        alert('Failed to delete course');
      }
    } catch (err) {
      alert('Error deleting course');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{course ? 'Edit Course' : 'Create New Course'}</h1>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Course Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Course Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter course title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  rows={4}
                  placeholder="Describe what students will learn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full p-3 border rounded-lg bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border rounded-lg"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="mr-3 w-5 h-5"
                    />
                    <span>Published</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Paste image URL"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
                </button>
                
                {course && (
                  <button 
                    onClick={deleteCourse}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                  >
                    Delete Course
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Lessons</h2>
              {course && (
                <button 
                  onClick={() => { setEditingLesson(null); setShowLessonModal(true); }}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                >
                  + Add
                </button>
              )}
            </div>
            
            {!course && (
              <p className="text-gray-500 text-sm mb-4">Save the course first to add lessons.</p>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {lessons.map((lesson, index) => (
                <div 
                  key={lesson.id}
                  className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => { setEditingLesson(lesson); setShowLessonModal(true); }}
                >
                  <div className="flex items-start gap-3">
                    <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{lesson.title}</p>
                      {lesson.duration && (
                        <p className="text-xs text-gray-500">
                          {Math.floor(lesson.duration / 60)}:{String(lesson.duration % 60).padStart(2, '0')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {lessons.length === 0 && course && (
              <p className="text-gray-500 text-center py-4">No lessons yet. Click "Add" to create one.</p>
            )}
          </div>
        </div>
      </div>

      {/* Video Preview for Published Courses */}
      {course && lessons.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Preview Your Course</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {lessons.slice(0, 3).map((lesson, index) => (
              <div key={lesson.id} className="border rounded-lg p-4">
                <p className="font-medium mb-2">Lesson {index + 1}: {lesson.title}</p>
                <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && course && (
        <LessonModal 
          courseId={course.id}
          lesson={editingLesson}
          onClose={() => setShowLessonModal(false)}
          onSave={handleLessonSave}
        />
      )}
    </div>
  );
}

// Instructor Dashboard
function InstructorDashboard({ onPageChange }: { onPageChange: (page: string) => void }) {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    loadMyCourses();
  }, []);

  const loadDashboard = () => {
    fetch(`${API_URL}/courses/instructor/dashboard`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => setDashboard(data))
      .catch(err => console.error('Failed to load dashboard:', err));
  };

  const loadMyCourses = () => {
    fetch(`${API_URL}/courses/my-courses`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load courses:', err);
        setLoading(false);
      });
  };

  const handleCourseSaved = () => {
    loadDashboard();
    loadMyCourses();
    setSelectedCourse(undefined);
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;

  // Course Editor View
  if (selectedCourse !== undefined) {
    return (
      <CourseEditor 
        course={selectedCourse}
        onClose={() => setSelectedCourse(undefined)}
        onSave={handleCourseSaved}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">📚 Instructor Dashboard</h1>

      {/* Stats Cards */}
      {dashboard && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow p-6 text-white">
            <p className="text-sm opacity-80">Total Courses</p>
            <p className="text-3xl font-bold">{dashboard.totalCourses}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
            <p className="text-sm opacity-80">Total Lessons</p>
            <p className="text-3xl font-bold">{dashboard.totalLessons}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
            <p className="text-sm opacity-80">Total Students</p>
            <p className="text-3xl font-bold">{dashboard.totalStudents}</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
            <p className="text-sm opacity-80">Total Revenue</p>
            <p className="text-3xl font-bold">${dashboard.totalRevenue}</p>
          </div>
        </div>
      )}

      {/* My Courses Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Courses</h2>
          <button 
            onClick={() => setSelectedCourse(null)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Create New Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">You haven't created any courses yet</p>
            <button 
              onClick={() => setSelectedCourse(null)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lessons</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courses.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded flex items-center justify-center text-white">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover rounded" />
                          ) : '📚'}
                        </div>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{course.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {course.lessons?.length || 0}
                    </td>
                    <td className="px-6 py-4">
                      {course.enrollments?.length || 0}
                    </td>
                    <td className="px-6 py-4">
                      ${course.price}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        course.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onPageChange(`course-${course.id}`)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Preview
                        </button>
                        <button 
                          onClick={() => setSelectedCourse(course)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Course Stats */}
      {dashboard?.courses && dashboard.courses.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Course Performance</h2>
          <div className="space-y-4">
            {dashboard.courses.map(course => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{course.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="block text-xs text-gray-400">Lessons</span>
                    <span className="font-medium">{course.lessonsCount}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400">Students</span>
                    <span className="font-medium">{course.enrolledStudents}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400">Price</span>
                    <span className="font-medium">${course.price}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400">Revenue</span>
                    <span className="font-medium text-green-600">
                      ${course.price * course.enrolledStudents}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for logged-in user
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
      // Fetch user details
      fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}`, 'X-User-Email': email }
      })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Invalid session');
        })
        .then(data => setUser(data))
        .catch(() => {
          localStorage.clear();
        });
    }

    // Handle page navigation from URL hash
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('course-')) {
        const courseId = hash.split('-')[1];
        setCurrentPage(`course-${courseId}`);
      } else if (hash) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  // Parse course detail page
  let courseId: number | null = null;
  if (currentPage.startsWith('course-')) {
    courseId = parseInt(currentPage.split('-')[1]);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onPageChange={handlePageChange} currentPage={currentPage} />
      
      {currentPage === 'home' && <HomePage onPageChange={handlePageChange} />}
      {currentPage === 'courses' && <CoursesPage onPageChange={handlePageChange} />}
      {currentPage === 'login' && <LoginPage onPageChange={handlePageChange} onLogin={handleLogin} />}
      {currentPage === 'register' && <RegisterPage onPageChange={handlePageChange} onLogin={handleLogin} />}
      {currentPage === 'instructor' && user?.role === 'INSTRUCTOR' && <InstructorDashboard onPageChange={handlePageChange} />}
      {currentPage === 'my-learning' && user && <MyLearningPage user={user} onPageChange={handlePageChange} />}
      {courseId && <CourseDetailPage courseId={courseId} user={user} onPageChange={handlePageChange} />}
      
      {/* Redirect to login if trying to access protected page */}
      {(currentPage === 'instructor' || currentPage === 'my-learning') && !user && (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">Please login to access this page</p>
          <button 
            onClick={() => handlePageChange('login')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
