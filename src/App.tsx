import { RouterProvider } from "react-router-dom";
import { AuthProvider } from 'altan-auth';
import { supabase } from './lib/supabase';
import "./index.css";
import { router } from "./routes";

const App = () => {
  return (
    <AuthProvider supabase={supabase}>
      <div className="min-h-screen">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
};

export default App;