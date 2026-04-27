import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatWidget from './components/ChatWidget';
import ProtectedRoute from './components/ProtectedRoute';
import useAuth from './hooks/useAuth';

// Lazy-load all pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'));
const FeedPage = lazy(() => import('./pages/FeedPage'));
const SkillMapPage = lazy(() => import('./pages/SkillMapPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const JobDetailPage = lazy(() => import('./pages/JobDetailPage'));
const CreateJobPage = lazy(() => import('./pages/CreateJobPage'));
const JobApplicantsPage = lazy(() => import('./pages/JobApplicantsPage'));
const ApplicationsPage = lazy(() => import('./pages/applicationsPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const AiJarvisPage = lazy(() => import('./pages/AiJarvisPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const MentorPodsPage = lazy(() => import('./pages/MentorPodsPage'));
const SimulationsPage = lazy(() => import('./pages/SimulationsPage'));
const CareerTranslatorPage = lazy(() => import('./pages/CareerTranslatorPage'));
const MentorsPage = lazy(() => import('./pages/MentorsPage'));
const MentorProfilePage = lazy(() => import('./pages/MentorProfilePage'));
const StudentMentorshipsPage = lazy(() => import('./pages/StudentMentorshipsPage'));
const MentorDashboardPage = lazy(() => import('./pages/MentorDashboardPage'));
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <CircularProgress sx={{ color: '#1a73e8' }} />
  </Box>
);

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
    <Navbar />
    <Sidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 2, md: 3 },
        mt: '64px',
        ml: { md: '230px' },
        minHeight: 'calc(100vh - 64px)',
        bgcolor: 'background.default',
      }}
    >
      {children}
    </Box>
    <ChatWidget />
  </Box>
);

const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'recruiter') return <RecruiterDashboard />;
  if (user?.role === 'mentor') return <MentorDashboardPage />;
  return <StudentDashboard />;
};

const App: React.FC = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* All authenticated roles */}
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardRedirect /></AppLayout></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><AppLayout><FeedPage /></AppLayout></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><AppLayout><MessagesPage /></AppLayout></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><AppLayout><NotificationsPage /></AppLayout></ProtectedRoute>} />

        {/* Jobs — /jobs/create and /recruiter/jobs/:jobId/applicants MUST come before /jobs/:id */}
        <Route path="/jobs" element={<ProtectedRoute><AppLayout><JobsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/jobs/create" element={<ProtectedRoute roles={['recruiter', 'admin']}><AppLayout><CreateJobPage /></AppLayout></ProtectedRoute>} />
        <Route path="/recruiter/jobs/:jobId/applicants" element={<ProtectedRoute roles={['recruiter', 'admin']}><AppLayout><JobApplicantsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute><AppLayout><JobDetailPage /></AppLayout></ProtectedRoute>} />

        {/* Mentor public pages */}
        <Route path="/mentors" element={<ProtectedRoute><AppLayout><MentorsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/mentor/:id" element={<ProtectedRoute><AppLayout><MentorProfilePage /></AppLayout></ProtectedRoute>} />

        {/* Mentor pods & simulations */}
        <Route path="/pods" element={<ProtectedRoute><AppLayout><MentorPodsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/simulations" element={<ProtectedRoute><AppLayout><SimulationsPage /></AppLayout></ProtectedRoute>} />

        {/* Student-only */}
        <Route path="/skill-map" element={<ProtectedRoute roles={['student', 'mentor']}><AppLayout><SkillMapPage /></AppLayout></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute roles={['student', 'mentor']}><AppLayout><PortfolioPage /></AppLayout></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute roles={['student', 'mentor']}><AppLayout><JournalPage /></AppLayout></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute roles={['student']}><AppLayout><ApplicationsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/jarvis" element={<ProtectedRoute roles={['student', 'mentor']}><AppLayout><AiJarvisPage /></AppLayout></ProtectedRoute>} />
        <Route path="/translator" element={<ProtectedRoute roles={['student', 'mentor']}><AppLayout><CareerTranslatorPage /></AppLayout></ProtectedRoute>} />
        <Route path="/my-mentorships" element={<ProtectedRoute roles={['student']}><AppLayout><StudentMentorshipsPage /></AppLayout></ProtectedRoute>} />

        {/* Mentor-only */}
        <Route path="/mentor-dashboard" element={<ProtectedRoute roles={['mentor']}><AppLayout><MentorDashboardPage /></AppLayout></ProtectedRoute>} />

        {/* Profile edit — own profile */}
        <Route path="/profile/edit" element={<ProtectedRoute><AppLayout><EditProfilePage /></AppLayout></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
