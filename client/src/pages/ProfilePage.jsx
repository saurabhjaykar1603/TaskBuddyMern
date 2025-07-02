import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  BACK_BUTTON,
  FULL_BUTTON,
  INPUT_WRAPPER,
  Inputwrapper,
  personalFields,
  SECTION_WRAPPER,
} from "../assets/dummy";
import { ChevronLeft, Save, UserCircle } from "lucide-react";
import axios from "axios";

function ProfilePage({ user, setCurrentUser, onLogout }) {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${API_URL}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setProfile({
            name: res.data.user.name,
            email: res.data.user.email,
          });
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message || "Something went wrong");
      });
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/v1/users/update-profile`,
        {
          name: profile.name,
          email: profile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        
        setCurrentUser((prev) => ({
          ...prev,
          name: data.user.name,
          email: data.user.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            data.user.name || "User"
          )}&background=random`,
        }));
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="max-w-4xl mx-auto p-6">
        <button className={BACK_BUTTON} onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">
            {profile?.name ? profile?.name[0]?.toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500">
              Manage your account settings and preferences.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Profile Information
              </h2>
            </div>
            {/* PERSONAL INFO NAME EMAIL */}
            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(({ name, icon: Icon, placeholder, type }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Icon className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={(e) =>
                      setProfile({ ...profile, [name]: e.target.value })
                    }
                    className="w-full focus:outline-none text-sm text-gray-700"
                    required
                  />
                </div>
              ))}
              <button type="submit" className={FULL_BUTTON}>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
