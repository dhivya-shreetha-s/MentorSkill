import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SkillAssessmentPage from './pages/SkillAssessmentPage';
import CareerExplorerPage from './pages/CareerExplorerPage';
import SkillGapPage from './pages/SkillGapPage';
import RoadmapPage from './pages/RoadmapPage';
import LearningHubPage from './pages/LearningHubPage';
import AIMentorPage from './pages/AIMentorPage';
import ProgressPage from './pages/ProgressPage';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

export default function App() {
  const { user } = useAuth();

  return (
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
        path="/learning"
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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
