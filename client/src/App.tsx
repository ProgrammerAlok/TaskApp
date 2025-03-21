import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Task from "./screens/Task";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import AuthProvider from "./context/AuthProvider";
import GuestRoutes from "./routes/GuestRoutes";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Task />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/signin",
    element: (
      <GuestRoutes>
        <Signin />
      </GuestRoutes>
    ),
  },
  {
    path: "/signup",
    element: (
      <GuestRoutes>
        <Signup />
      </GuestRoutes>
    ),
  },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />;
    </AuthProvider>
  );
};

export default App;
