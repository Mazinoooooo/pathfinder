// REACT w/Vite (FRONTEND)
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatHeader from "../ChatLayout/ChatHeader.jsx";
import ChatSideBar from "../ChatLayout/ChatSideBar.jsx";
import ChatBox from "./ChatBox.jsx";
import ChatSettings from "./ChatSettings.jsx";
import ChatbotLogout from "./ChatBotLogout.jsx";
import ManageChatModal from "./ManageChatModal.jsx";
import AccountSetup from "./AccountSetup.jsx";
import ProfileTagModal from "./ProfileTagModal.jsx";
import { generatePrompt } from "../constants/prompt.js";
import { getPrediction } from "../constants/apiHelpers.js"; // your FastAPI helper
import "../styles/Chatbot.css";

// FIREBASE (BACKEND)
import { doc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getDocs, query, orderBy, getDoc, where, limit, onSnapshot } from "firebase/firestore";
import { db, auth } from "../Firebase/firebaseConfig";
import { onAuthStateChanged, getAuth } from "firebase/auth";

export default function Chatbot() {

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Modal Setup
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState({
    Personality: [],
    Workstyle: [],
    Interests: [],
    Skills: []
  });

  // Model Prediction
  const [predictedGroup, setPredictedGroup] = useState(null);
  const [top3Groups, setTop3Groups] = useState(null);

  // Check if the User has Existing Messages or not
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [hasPreviousMessages, setHasPreviousMessages] = useState(false);

  // Show settings page along with global logout modal for chatbot page
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutModal, setShowLogoutModal]= useState(false);

  const [showManageModal, setShowManageModal] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/");
  }

  // This is within the AI chatbox
  const [chatStarted, setChatStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatBoxRef = useRef(null);
  const navigate = useNavigate();

  // Toggle Sidebar
  const [sidebarCollapsed] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
  setSidebarExpanded(prev => !prev);
  };

  const handleDeleteChat = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in.");

      const convoCollectionRef = collection(db, "users", user.uid, "conversation");

      // 1️⃣ Find the active conversation
      const activeQuery = query(convoCollectionRef, where("status", "==", "active"), limit(1));
      const snapshot = await getDocs(activeQuery);

      if (!snapshot.empty) {
        const activeConvoDoc = snapshot.docs[0];
        const activeConvoRef = doc(db, "users", user.uid, "conversation", activeConvoDoc.id);

        // Lock the active conversation
        await updateDoc(activeConvoRef, {
          status: "locked",
          lockedAt: new Date(),
        });
      }

      // 2️⃣ Create a new conversation document
      const newConvoRef = await addDoc(convoCollectionRef, {
        status: "active",
        createdAt: new Date(),
      });

      // 3️⃣ Update frontend state
      setMessages([]);
      setCurrentConversationId(newConvoRef.id); // track the docId
      setHasPreviousMessages(false);
      setChatStarted(false);

      console.log("Chat locked and new conversation created:", newConvoRef.id);
    } catch (error) {
      console.error("Error locking/deleting chat:", error);
    } finally {
      setShowManageModal(false);
    }
  };

  useEffect(() => {
  const loadActiveConversation = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const convoRef = collection(db, "users", user.uid, "conversation");
    const q = query(convoRef, where("status", "==", "active"), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      setCurrentConversationId(snapshot.docs[0].id);
    } else {
      // No active conversation → create one
      const newConvo = await addDoc(convoRef, {
        status: "active",
        createdAt: new Date(),
      });
      setCurrentConversationId(newConvo.id);
    }
  };

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) loadActiveConversation();
  });

  return () => unsubscribe();
}, []);


// Store the conversation in Firebase
const saveMessageToFirestore = async (sender, text) => {
  const user = auth.currentUser;
  if (!user || !currentConversationId) return;

  try {
    const messagesRef = collection(
      db,
      "users",
      user.uid,
      "conversation",
      currentConversationId,
      "docmessages"
    );

    await addDoc(messagesRef, {
      sender,               // "user" or "ai"
      text,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

  // This saves the profile setup (School type, Track, and Profile tags) to the Backend
  const handleSetupSave = async ({ schoolType, track, courseDuration, tags }) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        schoolType,
        track,
        courseDuration,
        tags,
        hasCompletedSetup: true,
      });
      console.log("Profile setup saved to Firestore");

      // Fetch prediction right after saving
      const prediction = await getPrediction(user.uid);
      if (prediction) {
        setPredictedGroup(prediction.predicted_group);
        setTop3Groups(prediction.top_3_groups);
        console.log("Predicted Group:", prediction.predicted_group);
      }
    } catch (error) {
      console.error("Error saving profile or fetching prediction:", error.message);
    }
  };

  // Main Function of the Chatbot, this handles the Recomendation of the AI model to the use
  const handleSubmit = async (userMsg) => {
    userMsg = userMsg.trim();
    if (!userMsg) return;

    if (!chatStarted) setChatStarted(true);

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    await saveMessageToFirestore("user", userMsg);

    setMessages((prev) => [...prev, { sender: "ai", text: "Typing..." }]);
    setIsTyping(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const profileDoc = await getDoc(doc(db, "users", user.uid));
      const profileData = profileDoc.data();
      const { schoolType, track, courseDuration, tags } = profileData;

      console.log("Fetched profileData from Firestore:", profileData);

      // --- Step 2a: Call ML FastAPI endpoint ---
      const API_URL = window.location.hostname.includes("devtunnels.ms")
        ? import.meta.env.VITE_API_URL
        : "http://localhost:8000";

      const mlRes = await fetch(`${API_URL}/predict/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SHS_Strand: track,
          SchoolType: schoolType,
          Personality: tags.Personality || [],
          Workstyle: tags.Workstyle || [],
          Interests: tags.Interests || [],
          Skills: tags.Skills || [],
        }),
      });
      const mlData = await mlRes.json();
      const predictedGroup = mlData.predicted_group;
      const top3Groups = mlData.top_3_groups;

      // --- Step 2b: Prepare conversation history ---
      const history = messages.slice(-3);
      const formattedHistory = history
        .filter((msg) => !msg.isMisuse)
        .map((msg) => `${msg.sender === "user" ? "User" : "AI"}: ${msg.text}`)
        .join("\n");

      // --- Step 2c: Generate Gemini prompt with ML predictions ---
      const prediction = {
        predicted_group: predictedGroup,
        top_3_groups: top3Groups
      };

      const result = generatePrompt(
        userMsg,
        schoolType,
        track,
        courseDuration,
        tags,
        formattedHistory,
        prediction
      );

      // Add safety check for undefined result
      if (!result) {
        console.error('generatePrompt returned undefined');
        setMessages((prev) => {
          const updated = [...prev];
          updated.pop(); // remove "Typing..."
          return [...updated, { sender: "ai", text: "Sorry, I couldn't process your request. Please try again." }];
        });
        setIsTyping(false);
        return;
      }

      const { blocked, warningMsg, prompt } = result;
      
      if (blocked) {
        setMessages((prev) => {
          const updated = [...prev];
          updated.pop(); // remove "Typing..."
          return [...updated, { sender: "ai", text: warningMsg }];
        });
        await saveMessageToFirestore("ai", warningMsg);
        setIsTyping(false);
        return;
      }

      // --- Step 2d: Call Gemini API ---
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop(); // remove "Typing..."
        return [...updated, { sender: "ai", text: reply }];
      });
      await saveMessageToFirestore("ai", reply);
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [
          ...updated,
          { sender: "ai", text: "Something went wrong. Please try again later." },
        ];
      });
      setIsTyping(false); // Reset typing state on error
    }
  };

  // This checks if the Account has already conversations
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setIsLoadingMessages(true); // ✅ start loading before doing anything

      try {
        const convoRef = collection(db, "users", user.uid, "conversation");
        const q = query(convoRef, orderBy("createdAt", "desc"), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const activeConvo = snapshot.docs[0];
          setCurrentConversationId(activeConvo.id);

          // Real-time listener for messages
          const messagesRef = collection(
            db,
            "users",
            user.uid,
            "conversation",
            activeConvo.id,
            "docmessages"
          );
          const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

          const unsubscribeMessages = onSnapshot(messagesQuery, (msgsSnap) => {
            const msgs = msgsSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));

            setMessages((prev) => {
              // 🛠 Preserve 'Typing...' if it exists
              const typingMsg = prev.find(m => m.sender === "ai" && m.text === "Typing...");
              return typingMsg ? [...msgs, typingMsg] : msgs;
            });

            if (msgs.length > 0) {
              setChatStarted(true);
              setHasPreviousMessages(true);
            } else {
              setChatStarted(false);
              setHasPreviousMessages(false);
            }

            setIsLoadingMessages(false);
          });

          // Cleanup messages listener
          return () => unsubscribeMessages();

        } else {
          setCurrentConversationId(null);
          setMessages([]);
          setChatStarted(false);
          setHasPreviousMessages(false);
          setIsLoadingMessages(false); // ✅ finish loading even if no convo
        }
      } catch (err) {
        console.error("Error loading messages:", err);
        setIsLoadingMessages(false);
      }
    });

    // Cleanup auth listener
    return () => unsubscribeAuth();
  }, []);

  // This handles the Account Setup
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (!userData?.hasCompletedSetup) {
          setShowSetupModal(true); // show modal
        } else {
          setShowSetupModal(false); // hide modal
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className={`chatbot-wrapper ${sidebarCollapsed ? "collapsed" : ""}`}>
        <ChatHeader toggleSidebar={toggleSidebar} />
        <div className="main-content">
        <ChatSideBar
          isExpanded={sidebarExpanded}
          onSelect={(section) => {
            if (section === "chat") setShowSettings(false);
            else if (section === "settings") setShowSettings(true);
          }}
          onLogout={handleLogoutClick}
          onManageChat={() => setShowManageModal(true)}
        />
          <div className="container">
            {showSettings ? (
              <ChatSettings onLogout={handleLogoutClick} />
            ) : isLoadingMessages ? (
              <div className="loading"></div>
            ) : (
              <ChatBox
                hasPreviousMessages={hasPreviousMessages}
                isLoadingMessages={isLoadingMessages}
                messages={messages}
                chatInput={chatInput} 
                setChatInput={setChatInput}
                chatStarted={chatStarted}
                chatBoxRef={chatBoxRef}
                handleSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
      
      <ManageChatModal
        isOpen={showManageModal}
        onDeleteChat={handleDeleteChat}
        onCancel={() => setShowManageModal(false)}
      />

      <ChatbotLogout 
      isOpen={showLogoutModal}
      onConfirm={confirmLogout}
      onCancel={() => setShowLogoutModal(false)}
      />
      
      <div className="account-setup">
        {showSetupModal && (
          <AccountSetup
            isOpen={showSetupModal}
            onSave={handleSetupSave}
            onOpenTags={() => setShowTagModal(true)}
            selectedTags={selectedTags}
            closeModal={() => setShowSetupModal(false)}
          />
        )}
        {showTagModal && (
          <ProfileTagModal
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            onClose={() => setShowTagModal(false)}
          />
        )}
      </div>
    </>
  );
}