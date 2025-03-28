import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function TaskDetail() {
  const { taskId } = useParams();
  const [task, setTask] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const getProduct = useCallback(
    async function getProduct() {
      let uri = "http://localhost:8080/task/" + taskId;
      console.log(uri);

      const response = await fetch(uri);
      const resData = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch products data");
      }
      return resData.task;
    },
    [taskId]
  );

  useEffect(() => {
    setIsLoading(true);
    async function fetchTasks() {
      try {
        const res = await getProduct();
        setTask(res);
        setIsLoading(false);
      } catch (error) {
        setError(error);
      }
    }
    fetchTasks();
  }, [getProduct]);

  async function deleteTask() {
    const response = await fetch("http://localhost:8080/task/" + taskId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${token}`,
      },
    });
    if (response.status === 422 || response.status === 401) {
      const resData = await response.json();
      setError(resData.message);

      return resData;
    }
    if (!response.ok) {
      throw new Response(JSON.stringify({ message: "Failed" }), {
        status: 500,
      });
    }
    await response.json();
    navigate("/");
  }

  const handleDelete = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await deleteTask();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && !error && (
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 my-6">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {task.title}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {task.date}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {task.isCompleted ? "Done" : "To Do"}
          </p>
          <form onSubmit={handleDelete}>
            <button type="submit" className="bg-red-500 cursor-pointer">
              Delete
            </button>
          </form>
        </div>
      )}
    </>
  );
}
