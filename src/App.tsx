import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './lib/auth-fallback';
import { supabase } from './lib/supabase';
import "./index.css";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider supabase={supabase}>
      <div className="min-h-screen">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}