import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
export default function NewTask() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const token = useSelector((state) => state.auth.token);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function postTask(formData) {
    const response = await fetch("http://localhost:8080/task", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 422 || response.status === 401) {
      const resData = await response.json();
      setError(resData.message);
      console.log(resData.message);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await postTask(formData);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };
  if (!token) {
    return <Navigate to={"/"} />;
  }
  return (
    <form className="w-[80%] mx-auto my-20" onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Task</h2>
          <p className="mt-1 text-sm/6 text-gray-600">Create Task</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm/6 font-medium text-gray-900">
                Task
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Task Name"
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="date"
                className="block text-sm/6 font-medium text-gray-900">
                Date
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <input
                    id="date"
                    name="date"
                    type="datetime-local"
                    placeholder="janesmith"
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          {isSubmitting ? "Loading" : "Save"}
        </button>
      </div>
    </form>
  );
}
