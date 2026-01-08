import { useEffect, Suspense, lazy } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, useLocation } from 'react-router-dom';

// Analytics
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import ReactGA from 'react-ga4';

// Components (keep these as regular imports for critical path)
import { Footer, ResetPassword, LoginAndSignup } from './Components';
import LoadingSpinner from './Components/UI/LoadingSpinner';
import ErrorBoundary from './Components/UI/ErrorBoundary';

// Lazy load pages for code splitting
const Home = lazy(() => import('./Pages/HomeV2/Home'));
const Profile = lazy(() => import('./Pages/Profile/profile'));
const NotesPreview = lazy(() => import('./Pages/NotesPreview/notes-preview'));
const Notes = lazy(() => import('./Pages/Notes/notes'));
const Dashboard = lazy(() => import('./Pages/Dashboard/Dashboard'));
const Test = lazy(() => import('./Pages/test/test'));
const Verify = lazy(() => import('./Pages/Auth/verify'));
const QpPreview = lazy(() => import('./Pages/qp-preview/qp-preview'));
const Blog = lazy(() => import('./Pages/Blogs/blog'));
const UploadBlog = lazy(() => import('./Pages/UploadBlog/UploadBlog'));
const BlogPreview = lazy(() => import('./Pages/Blogs/BlogPreview'));
const Projects = lazy(() => import('./Pages/Projects/Projects'));
const AddProject = lazy(() => import('./Pages/Projects/AddProject'));
const ProjectDashboard = lazy(() => import('./Pages/Projects/Dashboard/ProjectDashboard'));
const Admin = lazy(() => import('./Pages/Admin/Admin'));
const CourseStr = lazy(() => import('./Pages/CourseStructure/CourseStr'));
const CourseStrPreview = lazy(() => import('./Pages/CourseStructure/CourseStrPreview'));
const QuestionPapersContainer = lazy(() => import('./Pages/question-papers/question-papers-container'));
const Career = lazy(() => import('./Pages/Career/Page/Career'));
const Alumni = lazy(() => import('./Pages/Alumni/Alumni'));
const AboutUs = lazy(() => import('./Pages/AboutUs/AboutUs'));

import { ProtectRoute, capitalizeFirstLetter } from './Helpers';

if (document.location.hostname !== 'localhost') {
  ReactGA.initialize(import.meta.env.VITE_TRACKING_ID);
  console.log('Init Analytics');
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const pageName = location.pathname.split('/')[1];
    const path = pageName ? pageName + ' - Vidkarya' : 'Vidkarya';
    document.title = capitalizeFirstLetter(path);
  }, [location]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<AboutUs />} />

        <Route
          exact
          path="/career"
          element={
            <ProtectRoute>
              <Career />
            </ProtectRoute>
          }
        />

        <Route
          exact
          path="/admin321"
          element={
            <ProtectRoute>
              {' '}
              <Admin />{' '}
            </ProtectRoute>
          }
        />
        <Route
          exact
          path="/profile/:action"
          element={
            <ProtectRoute>
              {' '}
              <Profile />{' '}
            </ProtectRoute>
          }
        />

        <Route exact path="/auth" element={<LoginAndSignup />} />
        <Route exact path="/reset/password/:userid/:token" element={<ResetPassword />} />
        <Route exact path="/verify/:userid/:token" element={<Verify />} />

        <Route
          exact
          path="/dashboard"
          element={
            <ProtectRoute>
              {' '}
              <Dashboard />{' '}
            </ProtectRoute>
          }
        />

        <Route exact path="/projects" element={<Projects />} />
        <Route
          exact
          path="/projects/dashboard"
          element={
            <ProtectRoute>
              {' '}
              <ProjectDashboard />{' '}
            </ProtectRoute>
          }
        />
        <Route
          exact
          path="/projects/add"
          element={
            <ProtectRoute>
              {' '}
              <AddProject />{' '}
            </ProtectRoute>
          }
        />

        <Route exact path="/notes" element={<Notes />} />
        <Route
          exact
          path="/notes/preview/:id"
          element={
            <ProtectRoute>
              {' '}
              <NotesPreview />{' '}
            </ProtectRoute>
          }
        />

        <Route exact path="/blogs" element={<Blog />} />
        <Route exact path="/blogs/:blogid" element={<BlogPreview />} />
        <Route
          exact
          path="/blogs/create"
          element={
            <ProtectRoute>
              {' '}
              <UploadBlog />{' '}
            </ProtectRoute>
          }
        />

        <Route exact path="/courseStr" element={<CourseStr />} />
        <Route
          exact
          path="/courseStr/:courseId"
          element={
            <ProtectRoute>
              {' '}
              <CourseStrPreview />{' '}
            </ProtectRoute>
          }
        />

        <Route exact path="/test" element={<Test />} />
        <Route
          exact
          path="/qp/preview/:id"
          element={
            <ProtectRoute>
              {' '}
              <QpPreview />{' '}
            </ProtectRoute>
          }
        />
        <Route exact path="/question-papers" element={<QuestionPapersContainer />} />

        <Route exact path="/alumni" element={<Alumni />} />
        </Routes>
      </Suspense>
      <Analytics />
      <SpeedInsights />
      <ToastContainer position="top-center" limit={3} />
      <Footer />
    </ErrorBoundary>
  );
}

export default App;
