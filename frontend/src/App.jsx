import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Route-based code splitting for peak efficiency and lightweight initial bundle
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SkillAssessmentPage = lazy(() => import('./pages/SkillAssessmentPage'));
const CareerExplorerPage = lazy(() => import('./pages/CareerExplorerPage'));
const SkillGapPage = lazy(() => import('./pages/SkillGapPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const LearningHubPage = lazy(() => import('./pages/LearningHubPage'));
const AIMentorPage = lazy(() => import('./pages/AIMentorPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <LoadingSpinner text="Loading MentorSkill module..." />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <LoadingSpinner text="Authenticating user session..." />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

export default function App() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments"
          element={
            <ProtectedRoute>
              <Layout>
                <SkillAssessmentPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/careers"
          element={
            <ProtectedRoute>
              <Layout>
                <CareerExplorerPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-gap"
          element={
            <ProtectedRoute>
              <Layout>
                <SkillGapPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <Layout>
                <RoadmapPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning-hub"
          element={
            <ProtectedRoute>
              <Layout>
                <LearningHubPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor"
          element={
            <ProtectedRoute>
              <Layout>
                <AIMentorPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Layout>
                <ProgressPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
