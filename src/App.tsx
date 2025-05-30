import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes";

const App = () => {
  return (
    <div className="min-h-screen">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
