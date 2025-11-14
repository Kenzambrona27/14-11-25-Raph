import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../web_components/Header";
import Sidebar from "./Sidebar";

function StudentDashboard() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchActiveClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/student/active-classes",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClasses(response.data?.activeClasses || []);
      } catch (err) {
        console.error("❌ Error fetching active classes:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          alert(err.response?.data?.message || "Failed to load classes.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActiveClasses();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleJoinClass = async () => {
    if (!joinCode.trim()) {
      alert("Please enter a class code.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/student/join-class",
        { classCode: joinCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Successfully joined the class!");
      setShowJoinModal(false);
      setJoinCode("");
      window.location.reload();
    } catch (err) {
      console.error("❌ Error joining class:", err);
      alert(err.response?.data?.message || "Failed to join class.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#E0EAFC] to-[#CFDEF3] transition-all duration-500">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />

        <main className="flex-grow p-6 md:p-10 pt-28 md:pt-24 relative">
          {/* Join Class Button */}
          <div className="absolute top-28 right-10 z-50">
              <button
                className="flex items-center gap-2 border border-gray-400 text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-full font-medium transition-all bg-white shadow-md"
    >
                <span className="text-lg">＋</span> Join Class
                </button>
            </div>


          {/* Welcome Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center drop-shadow-sm">
            Welcome, Student!
          </h1>

          {/* Games & Activities Section */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Explore
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-green-600 hover:bg-green-700 transition-all text-white text-center py-6 rounded-xl shadow-md font-semibold text-lg cursor-pointer">
                🎮 Games
                <p className="text-sm text-green-100 mt-2">
                  Play and learn with fun interactive games.
                </p>
              </div>

              <div className="bg-purple-600 hover:bg-purple-700 transition-all text-white text-center py-6 rounded-xl shadow-md font-semibold text-lg cursor-pointer">
                🧩 Activities
                <p className="text-sm text-purple-100 mt-2">
                  Explore activities and interactive lessons.
                </p>
              </div>
            </div>
          </div>

          {/* My Classes Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              My Classes
            </h2>

            {loading ? (
              <p className="text-center text-gray-600">Loading classes...</p>
            ) : classes.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-sm flex justify-center items-center">
                <p className="text-gray-600 text-lg font-medium">
                  No active classes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {classes.map((cls) => (
                  <div
                    key={cls.class_id}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {cls.title || "Untitled Class"}
                      </h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
                        Active
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {cls.description || "No description available."}
                    </p>

                    {cls.class_code && (
                      <p className="text-xs text-gray-500">
                        Code: <span className="font-medium">{cls.class_code}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Join Class Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              Join a Class
            </h2>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter class code"
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinClass}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
