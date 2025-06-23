import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useClassStore } from "../store/useClassStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { ChevronDown, Users } from "lucide-react";

const HomePage = () => {
  const {
    selectedUser,
    getConversations,
    getUsersByClass,
    selectedClass,
    setSelectedClass,
  } = useChatStore();
  const { classes } = useClassStore();
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  useEffect(() => {
    // If we have a selected class, get users from that class
    if (selectedClass) {
      getUsersByClass(selectedClass._id);
    } else {
      // Otherwise get all conversations
      getConversations();
    }
  }, [selectedClass, getConversations, getUsersByClass]);

  const handleClassSelect = (classData) => {
    setSelectedClass(classData);
    setShowClassDropdown(false);
  };

  const handleShowAllConversations = () => {
    setSelectedClass(null);
    setShowClassDropdown(false);
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-col w-80 border-r border-base-300">
        {/* Class Selector */}
        <div className="p-4 border-b border-base-300">
          <div className="relative">
            <button
              onClick={() => setShowClassDropdown(!showClassDropdown)}
              className="w-full flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <span className="font-medium">
                  {selectedClass ? selectedClass.name : "All Conversations"}
                </span>
              </div>
              <ChevronDown className="size-4" />
            </button>

            {showClassDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                <button
                  onClick={handleShowAllConversations}
                  className="w-full p-3 text-left hover:bg-base-200 transition-colors border-b border-base-200"
                >
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span>All Conversations</span>
                  </div>
                </button>

                {classes.map((classData) => (
                  <button
                    key={classData._id}
                    onClick={() => handleClassSelect(classData)}
                    className={`w-full p-3 text-left hover:bg-base-200 transition-colors border-b border-base-200 last:border-b-0 ${
                      selectedClass?._id === classData._id
                        ? "bg-primary/10"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="size-4 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {classData.code.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{classData.name}</div>
                        <div className="text-xs text-base-content/60">
                          {classData.students.length} students
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Sidebar />
        </div>
      </div>

      {selectedUser ? (
        <ChatContainer />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-base-100">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Welcome to CourseConnect
            </h2>
            <p className="text-base-content/60">
              {selectedClass
                ? `Select a classmate from ${selectedClass.name} to start chatting`
                : "Select a user to start chatting"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
