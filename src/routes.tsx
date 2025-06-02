import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { LoginForm } from "./components/auth/LoginForm";
import { SignupForm } from "./components/auth/SignupForm";
import Index from "./pages/index";
import Dashboard from "./pages/Dashboard";
import JobBoard from "./pages/JobBoard";
import JobsManagement from "./pages/JobsManagement";
import Companies from "./pages/Companies";
import NewJob from "./pages/NewJob";
import EditJob from "./pages/EditJob";
import ReferralForm from "./pages/ReferralForm";
import MyReferrals from "./pages/MyReferrals";
import MyApplications from "./pages/MyApplications";
import Payouts from "./pages/Payouts";
import Apply from "./pages/Apply";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import JobDetails from "./pages/JobDetails";
import NotFound from "./pages/NotFound";

// Auth guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // This would normally check authentication state
  // For now, we'll allow access to demonstrate the app
  return <>{children}</>;
};

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "companies",
        element: (
          <ProtectedRoute>
            <Companies />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobs",
        element: (
          <ProtectedRoute>
            <JobsManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobs/:jobId",
        element: (
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobs/:jobId/edit",
        element: (
          <ProtectedRoute>
            <EditJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobs/new",
        element: (
          <ProtectedRoute>
            <NewJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "opportunities",
        element: (
          <ProtectedRoute>
            <JobBoard />
          </ProtectedRoute>
        ),
      },
      {
        path: "refer/:jobId",
        element: (
          <ProtectedRoute>
            <ReferralForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "apply/:jobId",
        element: (
          <ProtectedRoute>
            <Apply />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-referrals",
        element: (
          <ProtectedRoute>
            <MyReferrals />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-applications",
        element: (
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: "payouts",
        element: (
          <ProtectedRoute>
            <Payouts />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "signup",
        element: <SignupForm />,
      },
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);