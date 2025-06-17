import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from 'altan-auth';
import { Layout } from "./components/layout/Layout";
import Auth from "./pages/Auth";
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
import MyCandidates from "./pages/MyCandidates";
import Payouts from "./pages/Payouts";
import Apply from "./pages/Apply";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import JobDetails from "./pages/JobDetails";
import PublicJobDetails from "./pages/PublicJobDetails";
import ReferralLanding from "./pages/ReferralLanding";
import ScoutApplication from "./pages/ScoutApplication";
import ScoutApplicationsAdmin from "./pages/ScoutApplicationsAdmin";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Auth guard component using stable custom auth
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (!session?.user) {
    return <Navigate to="/auth" replace />;
  }
  
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
        path: "auth",
        element: <Auth />,
      },
      {
        path: "apply",
        element: <ScoutApplication />,
      },
      {
        path: "admin/scout-applications",
        element: (
          <ProtectedRoute>
            <ScoutApplicationsAdmin />
          </ProtectedRoute>
        ),
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
        path: "jobs/new",
        element: (
          <ProtectedRoute>
            <NewJob />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobs/:jobId",
        element: <PublicJobDetails />,
      },
      {
        path: "jobs/:jobId/manage",
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
        path: "my-candidates",
        element: (
          <ProtectedRoute>
            <MyCandidates />
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
        path: "r/:username",
        element: <ReferralLanding />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);