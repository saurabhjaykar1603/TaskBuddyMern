/* eslint-disable no-unused-vars */
import { Eye, EyeOff, Lock, LogIn, Mail,UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Inputwrapper, BUTTONCLASSES } from "../assets/dummy";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const INITIAL_FORM = {
  email: "",
  password: "",
};
function Login({ onSubmit, onSwitchMode }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token) {
      async () => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/users/me`,
            formData
          );
          if (data?.success) {
            onSubmit({ token, userId, ...data?.user });
            toast.success("Session restored redirecting");
            navigate("/");
          } else {
            localStorage.clear();
          }
        } catch (e) {
          console.log(e);

          localStorage.clear();
        }
      };
    }
  }, [navigate, onSubmit]);

  const handleSwitchMode = () => {
    toast.dismiss();
    onSwitchMode?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rememberMe) {
      toast.error("You must enable 'Remember Me' to login");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,
        formData
      );

      if (!data.token) {
        throw new Error(data.message || "Login failed");
      }
console.log(data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data?.user?.id);

      setFormData(INITIAL_FORM);

      onSubmit?.({
        token: data?.token,
        userId: data?.user?.id,
        ...data.user,
      });
      toast.success("Login Successful");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console?.error("Login error:", error);
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "email",
      icon: Mail,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ];
  return (
    <div className="max-w-md bg-white w-full shadow-lg border border-purple-50 rounded-xl p-8">
      <ToastContainer position="top-center " autoClose={3000} hideProgressBar />
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-50-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800"> Welcome Back</h2>
        <p className="text-green-500 text-sm mt-1">
          Sign in to continue to TaskBuddy
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className="text-purple-500 w-5 h-5 mr-2" />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />
            {isPassword && (
              <button
                className="ml-2 text-gray-500 hover:text-purple-500 transition-colors"
                type="button"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 " />
                ) : (
                  <Eye className="w-5 h-5 " />
                )}
              </button>
            )}
          </div>
        ))}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => {
              setRememberMe((prev) => !prev);
            }}
            className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
            required
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember me
          </label>
        </div>
        <button type="submit" className={BUTTONCLASSES} disabled={loading}>
          {loading ? (
            "Logging Up..."
          ) : (
            <>
              <UserPlus className="w- h4" />
              Login Up
            </>
          )}
        </button>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account ?{" "}
          <button
            onClick={handleSwitchMode}
            className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
