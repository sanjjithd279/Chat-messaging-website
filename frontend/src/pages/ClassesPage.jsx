import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClassStore } from "../store/useClassStore";
import { useChatStore } from "../store/useChatStore";
import {
  Plus,
  Users,
  BookOpen,
  User,
  Calendar,
  MessageSquare,
  Loader2,
} from "lucide-react";

const ClassesPage = () => {
  const {
    classes,
    getClasses,
    isClassesLoading,
    selectedClass,
    setSelectedClass,
  } = useClassStore();

  const { setSelectedUser } = useChatStore();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    code: "",
    description: "",
    instructor: "",
  });
  const [joinCode, setJoinCode] = useState("");

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await useClassStore.getState().createClass(createForm);
      setShowCreateModal(false);
      setCreateForm({ name: "", code: "", description: "", instructor: "" });
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    try {
      await useClassStore.getState().joinClass(joinCode);
      setShowJoinModal(false);
      setJoinCode("");
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleClassClick = (classData) => {
    setSelectedClass(classData);
  };

  const handleStudentClick = (student) => {
    setSelectedUser(student);
    setSelectedClass(selectedClass);
    navigate("/chat");
  };

  if (isClassesLoading) {
    return (
      <div className="h-screen pt-20 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Classes</h1>
            <p className="text-base-content/60 mt-2">
              Connect with classmates and collaborate on assignments
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="btn btn-outline gap-2"
            >
              <Users className="size-4" />
              Join Class
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary gap-2"
            >
              <Plus className="size-4" />
              Create Class
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="size-16 mx-auto text-base-content/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Classes Yet</h3>
            <p className="text-base-content/60 mb-6">
              Create a class or join an existing one to get started
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowJoinModal(true)}
                className="btn btn-outline"
              >
                Join Class
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                Create Class
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classData) => (
              <div
                key={classData._id}
                className="bg-base-100 rounded-xl p-6 border border-base-300 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleClassClick(classData)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {classData.name}
                    </h3>
                    <p className="text-sm text-base-content/60 mb-2">
                      Code: {classData.code}
                    </p>
                    <p className="text-sm text-base-content/70 mb-3">
                      {classData.description || "No description"}
                    </p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <BookOpen className="size-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <User className="size-4" />
                    <span>Instructor: {classData.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <Users className="size-4" />
                    <span>{classData.students.length} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <Calendar className="size-4" />
                    <span>
                      Created{" "}
                      {new Date(classData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-sm btn-outline w-full mt-4 gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClassClick(classData);
                  }}
                >
                  <MessageSquare className="size-4" />
                  View Class
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Create Class Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">Create New Class</h3>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Class Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Class Code</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={createForm.code}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, code: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Instructor</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={createForm.instructor}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        instructor: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Description (Optional)</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="btn btn-outline flex-1"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={useClassStore.getState().isCreatingClass}
                  >
                    {useClassStore.getState().isCreatingClass ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Create Class"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Join Class Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">Join Class</h3>
              <form onSubmit={handleJoinClass} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Class Code</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter class code"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="btn btn-outline flex-1"
                    onClick={() => setShowJoinModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={useClassStore.getState().isJoiningClass}
                  >
                    {useClassStore.getState().isJoiningClass ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Join Class"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Class Details Modal */}
        {selectedClass && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-base-100 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">{selectedClass.name}</h3>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="btn btn-sm btn-circle"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Class Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Code:</strong> {selectedClass.code}
                      </p>
                      <p>
                        <strong>Instructor:</strong> {selectedClass.instructor}
                      </p>
                      <p>
                        <strong>Students:</strong>{" "}
                        {selectedClass.students.length}
                      </p>
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(selectedClass.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-base-content/70">
                      {selectedClass.description || "No description available"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Classmates</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedClass.students.map((student) => (
                      <div
                        key={student._id}
                        className="flex items-center gap-3 p-3 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors"
                        onClick={() => handleStudentClick(student)}
                      >
                        <img
                          src={student.profilePic || "/avatar.png"}
                          alt={student.fullName}
                          className="size-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{student.fullName}</p>
                          <p className="text-sm text-base-content/70">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesPage;
