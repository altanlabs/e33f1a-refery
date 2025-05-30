import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { LoginForm } from "./components/auth/LoginForm";
import { SignupForm } from "./components/auth/SignupForm";
import Index from "./pages/index";
import Dashboard from "./pages/Dashboard";
import JobBoard from "./pages/JobBoard";
import ReferralForm from "./pages/ReferralForm";
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
        path: "jobs",
        element: (
          <ProtectedRoute>
            <JobBoard />
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