// import { Link } from "react-router";
// import ProductList from "../components/products/ProductList";
// import { useSelector } from "react-redux";

import TaskList from "../components/tasks/TaskList";

export default function HomePage() {
  //   const token = useSelector((state) => state.auth.token);
  return (
    <>
      {/* {!token ? <Link to="/login">Login</Link> : <p>Logout</p>} */}

      <TaskList key={"task-list"} />
    </>
  );
}
