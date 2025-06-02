import { RouterProvider } from "react-router-dom";
import { AltanAuthWrapper } from './components/auth/AltanAuthWrapper';
import "./index.css";
import { router } from "./routes";

const App = () => {
  return (
    <AltanAuthWrapper>
      <div className="min-h-screen">
        <RouterProvider router={router} />
      </div>
    </AltanAuthWrapper>
  );
};

export default App;