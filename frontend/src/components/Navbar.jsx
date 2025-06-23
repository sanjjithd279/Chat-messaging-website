import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useClassStore } from "../store/useClassStore";
import { useChatStore } from "../store/useChatStore";
import { useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  LogOut,
  Settings,
  User,
  MessageSquare,
  BookOpen,
  Search,
  X,
} from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const { classes } = useClassStore();
  const { setSelectedUser, setSelectedClass } = useChatStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    // Search through classes
    classes.forEach((classData) => {
      if (
        classData.name.toLowerCase().includes(query) ||
        classData.code.toLowerCase().includes(query) ||
        classData.instructor.toLowerCase().includes(query)
      ) {
        results.push({
          type: "class",
          data: classData,
          title: classData.name,
          subtitle: `${classData.code} • ${classData.instructor}`,
        });
      }
    });

    // Search through classmates in all classes
    classes.forEach((classData) => {
      classData.students.forEach((student) => {
        if (
          student._id !== authUser._id && // Don't show current user
          (student.fullName.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query))
        ) {
          // Check if this student is already in results
          const existingResult = results.find(
            (result) =>
              result.type === "student" && result.data._id === student._id
          );

          if (!existingResult) {
            results.push({
              type: "student",
              data: student,
              title: student.fullName,
              subtitle: `${student.email} • ${classData.name}`,
              classData: classData,
            });
          }
        }
      });
    });

    setSearchResults(results.slice(0, 8)); // Limit to 8 results
    setShowSearchResults(results.length > 0);
  }, [searchQuery, classes, authUser._id]);

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchResultClick = (result) => {
    if (result.type === "class") {
      // Navigate to classes page and select the class
      navigate("/");
      // You could add a method to set the selected class here
    } else if (result.type === "student") {
      // Navigate to chat with the student and set the class filter
      navigate("/chat");
      setSelectedClass(result.classData);
      setSelectedUser(result.data);
    }
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  if (!authUser) return null;

  return (
    <div className="navbar bg-base-100 border-b border-base-300">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          CourseConnect
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              to="/"
              className={`flex items-center gap-2 ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              <BookOpen className="size-4" />
              Classes
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className={`flex items-center gap-2 ${
                location.pathname === "/chat" ? "active" : ""
              }`}
            >
              <MessageSquare className="size-4" />
              Chat
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control relative" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search classes, students..."
              className="input input-bordered w-64 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                searchQuery.trim() !== "" && setShowSearchResults(true)
              }
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-base-content/50" />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 hover:text-base-content/70"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.data._id}-${index}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full p-3 text-left hover:bg-base-200 transition-colors border-b border-base-200 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {result.type === "class" ? (
                        <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="size-4 text-primary" />
                        </div>
                      ) : (
                        <img
                          src={result.data.profilePic || "/avatar.png"}
                          alt={result.data.fullName}
                          className="size-8 rounded-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{result.title}</div>
                      <div className="text-sm text-base-content/60 truncate">
                        {result.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User avatar"
                src={authUser.profilePic || "/avatar.png"}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
                <User className="size-4" />
              </Link>
            </li>
            <li>
              <Link to="/settings">
                Settings
                <Settings className="size-4" />
              </Link>
            </li>
            <li>
              <button onClick={handleLogout}>
                Logout
                <LogOut className="size-4" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
