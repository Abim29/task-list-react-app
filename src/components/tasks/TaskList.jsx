import { useEffect, useState } from "react";
import { dateFormatter } from "../../utils/formatter";
import { Link } from "react-router";
export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  async function getProducts() {
    let uri = "http://localhost:8080/task";
    const response = await fetch(uri);
    const resData = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch products data");
    }
    return resData.tasks;
  }
  useEffect(() => {
    setIsLoading(true);
    async function fetchTasks() {
      try {
        const res = await getProducts();
        setTasks(res);
        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    }
    fetchTasks();
  }, []);
  return (
    <>
      {!isLoading && (
        <div>
          {tasks.map((task) => {
            return (
              <Link
                to={`/task/${task._id.toString()}`}
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 my-6">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {task.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {dateFormatter.format(new Date(task.date))}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {task.isCompleted ? "Done" : "To Do"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
