import { RouterProvider } from "react-router-dom";
import { SafeAuthProvider } from './components/auth/SafeAuthProvider';
import "./index.css";
import { router } from "./routes";

const App = () => {
  return (
    <SafeAuthProvider>
      <div className="min-h-screen">
        <RouterProvider router={router} />
      </div>
    </SafeAuthProvider>
  );
};

export default App;