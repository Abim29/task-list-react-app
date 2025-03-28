import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./Root";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import NewTask from "./pages/NewTask";
import TaskDetail from "./pages/TaskDetail";
import RegisterPage from "./pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
      {
        path: "/new",
        Component: NewTask,
      },
      {
        path: "/task",
        children: [{ path: ":taskId", Component: TaskDetail }],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
