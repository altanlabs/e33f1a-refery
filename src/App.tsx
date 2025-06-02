import { RouterProvider } from "react-router-dom";
import { AuthProvider } from './lib/altan-auth';
import "./index.css";
import { router } from "./routes";

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
};

export default App;