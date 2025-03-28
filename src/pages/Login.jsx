import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth";
import { Link, Navigate, useNavigate } from "react-router";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function fetchLogin(formData) {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 422 || response.status === 401) {
      const resData = await response.json();
      setError(resData.message);
      console.log(resData.message);

      return resData;
    }
    if (!response.ok) {
      throw new Response(
        JSON.stringify({ message: "Could not authenticate user." }),
        { status: 500 }
      );
    }
    const resData = await response.json();
    dispatch(authActions.login({ token: resData.token }));
    navigate("/");
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await fetchLogin(formData);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (token) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <main className="h-screen">
        <section className="h-full">
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form
                method="POST"
                className="space-y-6"
                onSubmit={handleLoginSubmit}>
                <p>{error}</p>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      onChange={handleInputChange}
                      required
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium text-gray-900">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      onChange={handleInputChange}
                      autoComplete="current-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <Link to="/register">Register Account</Link>

                <div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    {!isSubmitting ? "Sign in" : "Loading..."}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
