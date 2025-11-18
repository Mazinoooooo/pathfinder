import { useEffect, useState } from "react";
import { auth, db } from "../Firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import '../styles/Settings.css';
import { userImage }  from '../assets'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import ProfileTagModal from './ProfileTagModal.jsx';

import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default function ChatSettings() {
  
  // Tab section on settings
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState(userData?.tags || {});

  // For Edit section
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [track, setTrack] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [canChangePassword, setCanChangePassword] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const providerId = user.providerData[0]?.providerId;
      // Disable password change if logged in via Google (or other OAuth)
      if (providerId !== "password") {
        setCanChangePassword(false);
      }
    }
  }, []);


  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Step 1: Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Step 2: Update password
      await updatePassword(user, newPassword);

      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.code === "auth/wrong-password") {
        alert("The current password is incorrect.");
      } else {
        alert("Failed to change password. Please try again.");
      }
    }
  };

  // Handles saving the user's updated profile (name, email, school type, track, and tags) to Firestore
  const handleProfileSave = async () => {
  const user = auth.currentUser;
  if (!user) return;

  setLoading(true);

  try {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      name,
      email,
      schoolType,
      track,
      courseDuration,
      tags: selectedTags,
    });

    alert("Profile updated!");
    refreshUserData();
    setActiveTab("overview");
  } catch (err) {
    console.error("Update failed:", err.message);
    alert("Failed to save changes.");
  } finally {
      setLoading(false); // hide spinner
    }
};

  // Updates local state variables when userData changes
  useEffect(() => {
  if (userData) {
    setName(userData.name || "");
    setEmail(userData.email || "");
    setSchoolType(userData.schoolType || "");
    setTrack(userData.track || "");
    setCourseDuration(userData.courseDuration || "");
  }
}, [userData]);

  // Fetches the user data from the firestore when it mounts the component
  useEffect(() => {
  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      console.log("No user data found");
    }
  };

  fetchUserData();
}, []);

  // Sets selected tags from Firestore data when userData is loaded
  useEffect(() => {
  if (userData?.tags) {
    setSelectedTags(userData.tags);
  }
}, [userData]);

  // Re-fetches and updates user data from Firestore manually
  const refreshUserData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    }
  };

  return (
      <>
      <div className="settings-page-wrapper">
        <div className="wrapper">
          <div className="overview-card">
            <div className="profile-content">
              <div className="tabs">
                <div
                  className={`tab ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </div>
                <div
                  className={`tab ${activeTab === "settings" ? "active" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </div>
                <div
                  className={`tab ${activeTab === "edit" ? "active" : ""}`}
                  onClick={() => setActiveTab("edit")}
                >
                  Edit Profile
                </div>
              </div>

              {activeTab === "overview" && (
                <>
                  <div className="section">
                    <h4>Profile Details</h4>
                    {activeTab !== "settings" && (
                      <div className="overview-photo-inline">
                        <div
                          className="img"
                          style={{ backgroundImage: `url(${userImage})` }}
                          alt="User Avatar"
                        ></div>
                      </div>
                    )}
                    <table className="info-table">
                      <tbody>
                        <tr><td>Name</td><td>{userData?.name || "Not set"}</td></tr>
                        <tr><td>Email</td><td>{userData?.email || "Not set"}</td></tr>
                        <tr><td>School Type</td><td>{userData?.schoolType || "Not set"}</td></tr>
                        <tr><td>Track</td><td>{userData?.track || "Not set"}</td></tr>
                        <tr><td>Course Span</td><td>{userData?.courseDuration || "Not set"}</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="section">
                    <h4>Profile Description</h4>
                    <div className="tag-container">
                      {userData?.tags &&
                        Object.values(userData.tags)
                          .flat()
                          .map((tag, index) => (
                            <div key={index} className="tag">{tag}</div>
                          ))
                      }
                    </div>
                  </div>
                </>
              )}

              {activeTab === "settings" && (
                <div className="section">
                  <h4>Change Password</h4>
                  {!canChangePassword ? (
                    <p style={{ color: "#0a2d31ff" }}>
                      You signed in using a third-party provider.
                      Password changes are managed through that provider.
                    </p>
                  ) : (
                    <>
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <input
                        type="password"
                        placeholder="Re-enter New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button className="btn-blue" onClick={handleChangePassword}>
                        Change Password
                      </button>
                    </>
                  )}
                </div>
              )}

              {activeTab === "edit" && (
                <div className="section">
                  <h4>Profile Details</h4>
                  {activeTab !== "settings" && (
                    <div className="overview-photo-inline">
                      <div
                        className="img"
                        style={{ backgroundImage: `url(${userImage})` }}
                        alt="User Avatar"
                      ></div>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <select
                    value={schoolType}
                    onChange={(e) => setSchoolType(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                  >
                    <option value="">Select SHS Track</option>
                    <option value="STEM">STEM</option>
                    <option value="ABM">ABM</option>
                    <option value="HUMSS">HUMSS</option>
                    <option value="TVL">TVL</option>
                    <option value="GAS">GAS</option>
                  </select>

                  <select
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                  >
                    <option value="">Select Course Span</option>
                    <option value="2-year">2-year program</option>
                    <option value="4-year">4-year degree</option>
                    <option value="2 and 4 year course">Open for 2 and 4 year course</option>
                  </select>

                  <h4>Profile Description</h4>
                  <div className="tag-container">
                    {selectedTags &&
                      Object.values(selectedTags).flat().map((tag, index) => (
                        <div key={index} className="tag">{tag}</div>
                      ))}
                    <button className="add-tag-btn" onClick={() => setShowTagModal(true)}>
                      +
                    </button>
                  </div>
                  <button
                    className="btn-blue saving-btn"
                    onClick={handleProfileSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span>Saving...</span>
                        <FontAwesomeIcon icon={faSpinner} spin className="spinner-icon" />
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showTagModal && (
        <div className="account-setup">
        <ProfileTagModal
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          onClose={() => setShowTagModal(false)}
        />
        </div>
      )}

      </>
    );
}

