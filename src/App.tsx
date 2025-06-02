import { RouterProvider } from "react-router-dom";
import { AuthProviderWrapper } from './components/auth/AuthProviderWrapper';
import "./index.css";
import { router } from "./routes";

const App = () => {
  return (
    <AuthProviderWrapper>
      <div className="min-h-screen">
        <RouterProvider router={router} />
      </div>
    </AuthProviderWrapper>
  );
};

export default App;