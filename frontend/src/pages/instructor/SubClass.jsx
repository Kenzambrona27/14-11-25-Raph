import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../web_components/Header";
import Sidebar from "./Sidebar";
import AnnouncementComposer from "./components/AnnouncementComposer";
import AnnouncementsList from "./components/AnnouncementsList";
import ActivityBuilder from "./components/ActivityBuilder";

function SubClass() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [isShareInviteOpen, setIsShareInviteOpen] = useState(false);
  const [isCreateActivityOpen, setIsCreateActivityOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [instructorName] = useState(
    () => localStorage.getItem("username") || "Instructor"
  );
  const [announcements, setAnnouncements] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [subjectData, setSubjectData] = useState(null);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [openDateTime, setOpenDateTime] = useState("");
  const [dueDateTime, setDueDateTime] = useState("");
  const [timeLimit, setTimeLimit] = useState("While the activity is still open");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const createMenuRef = useRef(null);
  const photoVideoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [editingText, setEditingText] = useState("");
  const API_BASE_URL = "http://localhost:5000";

  const classInfo = useMemo(() => {
    const defaults = {
      id: Date.now(),
      className: "Untitled Class",
      section: "Section details",
      subject: "Subject",
      code: Math.random().toString(36).slice(2, 8).toUpperCase(),
    };
    const localData = { ...defaults, ...(location.state?.classData || {}) };
    
    // Merge with API data if available (API data takes priority)
    if (subjectData) {
      return {
        ...localData,
        subject_id: subjectData.subject_id,
        instructor_id: subjectData.instructor_id,
        title: subjectData.title || localData.className,
        className: subjectData.title || localData.className,
        description: subjectData.description || localData.subject,
        subject: subjectData.description || localData.subject,
        // Map description to section for display
        section: subjectData.description || localData.section || "Section details",
        class_code: subjectData.class_code || localData.code,
        code: subjectData.class_code || localData.code,
        created_at: subjectData.created_at,
      };
    }
    
    return localData;
  }, [location.state, subjectData]);

  // Fetch subject data from API
  useEffect(() => {
    const fetchSubjectData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const subjectId = classInfo.subject_id || classInfo.id;
      const classCode = classInfo.class_code || classInfo.code;
      if (!subjectId && !classCode) {
        console.log("No subject ID or class code available");
        return;
      }
      setLoadingSubject(true);
      try {
        let url;
        if (subjectId) {
          url = `http://localhost:5000/instructor/subjects/${subjectId}`;
        } else {
          url = `http://localhost:5000/instructor/subjects?class_code=${classCode}`;
        }
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.subject) {
          setSubjectData(response.data.subject);
          console.log("Subject data imported:", response.data.subject);
        }
      } catch (error) {
        console.error("Error fetching subject data:", error);
        // Don't show error alert if subject not found - use local data instead
        if (error.response?.status !== 404) {
          console.error("Failed to import subject data from database");
        }
      } finally {
        setLoadingSubject(false);
      }
    };
    fetchSubjectData();
  }, []);

  // Fetch announcements when subject data is available
  useEffect(() => {
    if (subjectData || classInfo.subject_id || classInfo.id) {
      fetchAnnouncements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectData, classInfo.subject_id, classInfo.id]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target)
      ) {
        setIsCreateMenuOpen(false);
      }
    }

    if (isCreateMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isCreateMenuOpen]);

  const createMenuItems = [
    { label: "Assignment", description: "Share updates with everyone" },
    { label: "Quiz Announcement", description: "Ask short formative questions" },
    { label: "Reuse Activity", description: "Bring back a previous post" },
  ];

  const goToFeature = (title, description) => {
    navigate("/instructor/feature", {
      state: {
        title,
        description,
        ctaLabel: "Back to Class",
      },
    });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(classInfo.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleCopyInviteLink = async () => {
    const inviteLink = `${window.location.origin}/join?code=${classInfo.code}`;
    const inviteDetails = `Join ${classInfo.className || "my class"}!\n\nClass Code: ${classInfo.code}\n\nJoin Link: ${inviteLink}`;
    
    try {
      await navigator.clipboard.writeText(inviteDetails);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy invite:", err);
    }
  };

  const handlePostAnnouncement = async () => {
    if (!announcementText.trim()) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    const subjectId = classInfo.subject_id || classInfo.id;
    if (!subjectId) {
      alert("Cannot post: Subject ID not found.");
      return;
    }

    const formData = new FormData();
    formData.append("subject_id", subjectId);
    formData.append("content", announcementText.trim());
    
    console.log("FormData before appending files:");
    console.log("  subject_id:", subjectId);
    console.log("  content:", announcementText.trim());
    console.log("  files to upload:", selectedAttachments.length);
    
    selectedAttachments.forEach((attachment, index) => {
      console.log(`  appending file ${index}:`, attachment.file.name, "size:", attachment.file.size);
      formData.append("attachments", attachment.file);
    });

    setIsPosting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/instructor/announcements",
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Announcement response:", response.data);

      const createdAnnouncement = response.data?.announcement;
      
      console.log("Created announcement object:", createdAnnouncement);
      console.log("Attachments in response:", createdAnnouncement?.attachments);

      if (!createdAnnouncement) {
        console.error("No announcement returned from server");
        alert("Error: No announcement data returned from server");
        setIsPosting(false);
        return;
      }

      const newAnnouncement = {
        announcement_id: createdAnnouncement.announcement_id,
        content: createdAnnouncement.content,
        created_at: createdAnnouncement.created_at || new Date().toISOString(),
        instructor_name: createdAnnouncement.instructor_name || instructorName,
        attachments: createdAnnouncement.attachments || [],
      };

      console.log("Final announcement to display:", newAnnouncement);

      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      setIsAnnouncementOpen(false);
      setAnnouncementText("");
      setSelectedAttachments([]);
    } catch (error) {
      console.error("Error posting announcement:", error);
      console.error("Error response:", error.response?.data);
      alert(error.response?.data?.message || "Failed to post announcement. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const fetchAnnouncements = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const subjectId = classInfo.subject_id || classInfo.id;
    if (!subjectId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/instructor/announcements?subject_id=${subjectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      if (response.data && Array.isArray(response.data.announcements)) {
        setAnnouncements(response.data.announcements);
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/instructor/announcements/${announcementId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAnnouncements((prev) =>
        prev.filter((a) => a.announcement_id !== announcementId)
      );
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert(error.response?.data?.message || "Failed to delete announcement. Please try again.");
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setEditingText(announcement.content);
    setIsEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!editingText.trim() || !editingAnnouncement) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/instructor/announcements/${editingAnnouncement.announcement_id}`,
        { content: editingText.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAnnouncements((prev) =>
        prev.map((a) =>
          a.announcement_id === editingAnnouncement.announcement_id
            ? { ...a, content: editingText.trim(), updated_at: response.data?.announcement?.updated_at }
            : a
        )
      );

      setIsEditMode(false);
      setEditingAnnouncement(null);
      setEditingText("");
    } catch (error) {
      console.error("Error updating announcement:", error);
      alert(error.response?.data?.message || "Failed to update announcement. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingAnnouncement(null);
    setEditingText("");
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const getAttachmentIcon = (mimeType) => {
    if (!mimeType) return "📄";
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("video/")) return "🎥";
    if (mimeType.includes("pdf")) return "📄";
    if (
      mimeType.includes("word") ||
      mimeType.includes("presentation") ||
      mimeType.includes("excel")
    ) {
      return "📄";
    }
    return "📎";
  };

  const handleAttachmentSelect = (fileList) => {
    console.log("=== handleAttachmentSelect called ===");
    console.log("fileList:", fileList);
    console.log("fileList.length:", fileList?.length);
    
    if (!fileList || !fileList.length) {
      console.warn("No files or empty list");
      return;
    }
    
    const MAX_ATTACHMENTS = 6;
    console.log("Files selected:", fileList.length);
    
    // Convert FileList to array using spread operator (more reliable than Array.from)
    const filesArray = [...fileList];
    console.log("Files array after spread:", filesArray.length);
    
    // Log each file
    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      console.log(`File ${i}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      });
    }
    
    setSelectedAttachments((prev) => {
      console.log("Previous attachments:", prev.length);
      const availableSlots = MAX_ATTACHMENTS - prev.length;
      if (availableSlots <= 0) {
        alert("You can attach up to 6 files per post.");
        return prev;
      }

      const incoming = filesArray.slice(0, availableSlots);
      console.log("Incoming files after slice:", incoming.length);
      const next = [...prev];

      incoming.forEach((file, idx) => {
        console.log(`Processing file ${idx}:`, file.name);
        const isDuplicate = next.some(
          (item) =>
            item.file.name === file.name &&
            item.file.size === file.size &&
            item.file.lastModified === file.lastModified
        );
        console.log(`File ${idx} is duplicate?`, isDuplicate);
        if (!isDuplicate) {
          const newItem = {
            id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
              .toString(36)
              .slice(2, 8)}`,
            file,
            mimeType: file.type,
          };
          console.log(`Adding file ${idx} with id:`, newItem.id);
          next.push(newItem);
        }
      });

      console.log("Final attachments count:", next.length);
      return next;
    });
  };

  const handleAttachmentRemove = (id) => {
    setSelectedAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) {
      handleAttachmentSelect(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const triggerPhotoVideoPicker = () => {
    photoVideoInputRef.current?.click();
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const quickActions = [
    {
      label: "Image",
      icon: "🖼",
      onClick: triggerPhotoVideoPicker,
    },
    {
      label: "Attachment",
      icon: "📎",
      onClick: triggerFilePicker,
    },
    {
      label: "Video",
      icon: "🎥",
      onClick: triggerPhotoVideoPicker,
    },
    {
      label: "Activity",
      icon: "⭐",
      onClick: () =>
        goToFeature(
          "Interactive Activity",
          "Host quick polls and activities to keep your class engaged. This feature is coming soon."
        ),
    },
    {
      label: "Schedule",
      icon: "⏰",
      onClick: () =>
        goToFeature(
          "Scheduled Post",
          "Plan announcements in advance and have them publish automatically."
        ),
    },
  ];

  const handleCreateActivity = async () => {
    if (!activityName || !openDateTime || !dueDateTime || !title) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    const subjectId = classInfo.subject_id || classInfo.id;
    if (!subjectId) {
      alert("Cannot create activity: Subject ID not found.");
      return;
    }

    setIsCreatingActivity(true);
    try {
      // Format datetime strings for API
      const openDate = new Date(openDateTime);
      const dueDate = new Date(dueDateTime);

      const activityData = {
        subject_id: subjectId,
        activity_name: activityName,
        title: title,
        instructions: instructions || null,
        open_date_time: openDate.toISOString(),
        due_date_time: dueDate.toISOString(),
        time_limit: timeLimit,
      };

      const response = await axios.post(
        "http://localhost:5000/instructor/activity",
        activityData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Activity created:", response.data);
      alert("Activity created successfully!");
      
      // Reset form
      setIsCreateActivityOpen(false);
      setActivityName("");
      setOpenDateTime("");
      setDueDateTime("");
      setTimeLimit("While the activity is still open");
      setTitle("");
      setInstructions("");
    } catch (error) {
      console.error("Error creating activity:", error);
      alert(error.response?.data?.message || "Failed to create activity. Please try again.");
    } finally {
      setIsCreatingActivity(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#cfe3fa] via-[#e6f0ff] to-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        />

        <main className="flex-1 px-6 sm:px-10 py-10 mt-12 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <button
                onClick={() =>
                  navigate("/instructor/dashboard", {
                    state: { newClass: classInfo },
                  })
                }
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                ← Back to classes
              </button>
              <h1 className="mt-4 text-3xl font-semibold text-gray-800">
                {classInfo.className}
              </h1>
              <p className="text-gray-500">
                {classInfo.section || classInfo.description || "No description"}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  goToFeature(
                    "Class Settings",
                    "Manage class preferences, update course details, and configure collaboration options in one place."
                  )
                }
                className="px-4 py-2 rounded-lg border border-blue-500 text-blue-600 font-medium hover:bg-blue-50 transition"
              >
                Class settings
              </button>
              <button
                onClick={() => setIsShareInviteOpen(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
              >
                Share invite
              </button>
            </div>
          </div>

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d7bf3] via-[#37b0ff] to-[#8adFFF] text-white shadow-xl">
            <div className="absolute inset-0">
              <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-white/20 blur-2xl" />
              <div className="absolute -bottom-16 right-10 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute left-24 top-10 h-24 w-24 rounded-3xl border border-white/25 rotate-12" />
              <div className="absolute right-16 bottom-16 h-20 w-20 rounded-full bg-white/20" />
            </div>
            <div className="relative z-10 p-8 lg:p-12 flex flex-col gap-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div>
                  <p className="uppercase tracking-[0.25em] text-white/80 text-xs">
                    stream overview
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-snug">
                    Start the conversation and keep your class aligned
                  </h2>
                  <p className="mt-3 text-white/80 text-sm max-w-2xl">
                    Announcements posted here appear for everyone instantly. Pin
                    key updates, schedule reminders, or share quick resources to
                    set the tone for your course.
                  </p>
                </div>
                <div className="bg-white/15 rounded-3xl p-6 w-full sm:w-auto sm:min-w-[220px]">
                  <p className="text-white/70 uppercase tracking-wide text-xs">
                    class code
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[0.35em]">
                    {classInfo.code}
                  </p>
                  <button
                    onClick={handleCopyCode}
                    className={`mt-6 w-full rounded-xl py-2 text-sm font-medium transition ${
                      copiedCode
                        ? "bg-green-500/30 text-white"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    {copiedCode ? "Copied!" : "Copy code"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Actions bar outside the banner */}
          <div className="mt-4 lg:mt-6">
            <div className="flex flex-wrap gap-3">
              <div className="relative" ref={createMenuRef}>
                <button
                  onClick={() => setIsCreateMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#2d7bf3] via-[#37b0ff] to-[#5bd0ff] text-sm font-semibold text-white shadow-xl shadow-black/15 hover:shadow-2xl hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-base font-bold">
                    +
                  </span>
                  Classwork
                </button>
                {isCreateMenuOpen && (
                  <div className="absolute left-0 top-full mt-3 w-72 rounded-3xl border border-blue-100 bg-white/95 backdrop-blur-sm shadow-2xl shadow-blue-200/40 overflow-hidden z-20">
                    <div className="bg-gradient-to-r from-[#e7f1ff] to-white px-5 py-4">
                      
                    </div>
                    <div className="divide-y divide-blue-50">
                      {createMenuItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            if (item.label === "Assignment") {
                              setIsCreateActivityOpen(true);
                              setIsCreateMenuOpen(false);
                            }
                          }}
                          className="w-full text-left px-5 py-4 hover:bg-blue-50/70 transition-colors duration-150"
                        >
                          <p className="text-sm font-semibold text-gray-800">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() =>
                  goToFeature(
                    "Grades Center",
                    "Track student performance, provide timely feedback, and analyze class trends across assignments."
                  )
                }
                className="px-6 py-2 rounded-full bg-white text-sm font-semibold text-[#2d7bf3] shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-transform duration-200"
              >
                Grades
              </button>
              <button
                onClick={() =>
                  goToFeature(
                    "Class People",
                    "View roster details, manage roles, and communicate with your students seamlessly."
                  )
                }
                className="px-6 py-2 rounded-full bg-white text-sm font-semibold text-[#2d7bf3] border border-white/40 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-transform duration-200"
              >
                Class People
              </button>
            </div>
          </div>

          <section className="grid gap-8 xl:grid-cols-[1.8fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white shadow-lg border border-white/60 px-6 py-6">
                <div
                  onClick={() => setIsAnnouncementOpen(true)}
                  className="flex flex-col bg-gray-50 border border-gray-200 rounded-full px-5 py-3 cursor-pointer hover:bg-gray-100 transition-all"
                >
                  <span className="text-xs text-gray-400 font-medium leading-none mb-1">
                    Announcement
                  </span>
                  <span className="text-gray-500 text-sm">
                    What&apos;s on your mind
                  </span>
                </div>

                <div className="flex gap-3 px-2 mt-4">
                </div>

                <input
                  type="file"
                  ref={photoVideoInputRef}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    handleAttachmentSelect(event.target.files);
                    event.target.value = "";
                  }}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    handleAttachmentSelect(event.target.files);
                    event.target.value = "";
                  }}
                />

                {/* Announcements List */}
                <AnnouncementsList
                  announcements={announcements}
                  API_BASE_URL={API_BASE_URL}
                  getAttachmentIcon={getAttachmentIcon}
                  onDelete={handleDeleteAnnouncement}
                  onEdit={handleEditAnnouncement}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-white shadow-lg border border-white/60 px-6 py-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Upcoming
                </h3>
                <p className="mt-3 text-sm text-gray-500">
                  No scheduled tasks yet. Create an activity to fill this list.
                </p>
                <button
                  onClick={() =>
                    goToFeature(
                      "Assignment Planner",
                      "Design assignments, set schedules, and align expectations before publishing to your class."
                    )
                  }
                  className="mt-5 w-full rounded-xl bg-blue-600 text-white py-3 text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Plan assignment
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Announcement Composer Modal */}
      {/* Announcement Composer Modal */}
      <AnnouncementComposer
        isOpen={isAnnouncementOpen}
        onClose={() => {
          setIsAnnouncementOpen(false);
          setAnnouncementText("");
          setSelectedAttachments([]);
        }}
        classInfo={classInfo}
        instructorName={instructorName}
        onAnnouncementPosted={(newAnnouncement) => {
          setAnnouncements((prev) => [newAnnouncement, ...prev]);
        }}
        selectedAttachments={selectedAttachments}
        setSelectedAttachments={setSelectedAttachments}
        announcementText={announcementText}
        setAnnouncementText={setAnnouncementText}
        isPosting={isPosting}
        setIsPosting={setIsPosting}
        photoVideoInputRef={photoVideoInputRef}
        fileInputRef={fileInputRef}
        getAttachmentIcon={getAttachmentIcon}
        formatFileSize={formatFileSize}
      />

      {/* Create Activity Modal */}
      <ActivityBuilder
        isOpen={isCreateActivityOpen}
        onClose={() => setIsCreateActivityOpen(false)}
        activityName={activityName}
        setActivityName={setActivityName}
        openDateTime={openDateTime}
        setOpenDateTime={setOpenDateTime}
        dueDateTime={dueDateTime}
        setDueDateTime={setDueDateTime}
        timeLimit={timeLimit}
        setTimeLimit={setTimeLimit}
        title={title}
        setTitle={setTitle}
        instructions={instructions}
        setInstructions={setInstructions}
        isCreatingActivity={isCreatingActivity}
        onCreateActivity={handleCreateActivity}
        onReset={() => {
          setActivityName("");
          setOpenDateTime("");
          setDueDateTime("");
          setTimeLimit("While the activity is still open");
          setTitle("");
          setInstructions("");
        }}
      />

      {/* Share Invite Modal */}
      {isShareInviteOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          onClick={() => setIsShareInviteOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Share Invite
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Invite students to join your class
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Class Code Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Code
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-lg font-semibold text-gray-800">
                    {classInfo.code}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className={`px-4 py-3 rounded-lg font-medium transition ${
                      copiedCode
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copiedCode ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Invite Link Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Link
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 truncate">
                    {window.location.origin}/join?code={classInfo.code}
                  </div>
                  <button
                    onClick={handleCopyInviteLink}
                    className={`px-4 py-3 rounded-lg font-medium transition ${
                      copiedLink
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copiedLink ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Class Info */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Class:</span>{" "}
                  {classInfo.className || "Untitled Class"}
                </p>
                {classInfo.subject && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Subject:</span>{" "}
                    {classInfo.subject}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsShareInviteOpen(false)}
                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Announcement Modal */}
      {isEditMode && editingAnnouncement && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          onClick={handleCancelEdit}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Edit Announcement</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                placeholder="Edit your announcement..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="6"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editingText.trim()}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubClass;

