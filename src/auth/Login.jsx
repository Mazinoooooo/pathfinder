import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "../styles/Login.css";

// Firebase
import { auth } from "../Firebase/firebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig"; // ✅ ensure db is exported from firebaseConfig

export default function Login({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const togglePassword = () => setShowPassword(!showPassword);

  // 🔹 Regular Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/chatbot");
    } catch (err) {
      console.error(err);
      switch (err.code) {
        case "auth/user-not-found":
          alert("No account found with this email.");
          break;
        case "auth/wrong-password":
          alert("Incorrect password.");
          break;
        case "auth/invalid-email":
          alert("Invalid email format.");
          break;
        default:
          alert("Login failed: " + err.message);
      }
    }
  };

  // 🔹 Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not, create record
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "",
          email: user.email,
          photoURL: user.photoURL || "",
          provider: "google",
          createdAt: serverTimestamp(),
        });
      }

      alert(`Welcome ${user.displayName || "back"}!`);
      navigate("/chatbot");
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      alert("Failed to sign in with Google.");
    }
  };

  return (
    <div className="modal-overlay-login">
      <div className="modal-content-login">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="welcome">
          <h2 className="login-greetings">
            <span className="login-greeting">Welcome!</span>
          </h2>
          <p className="sub-text">Enter your credentials</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="form-group-email">
            <label>Email</label>
            <input
              type="text"
              id="email"
              className="login-email"
              placeholder="Enter your Email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-group-password">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="password"
              placeholder="Must have 6 letters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={togglePassword}
              className="eye-icon"
            />
          </div>

          <div className="form-group-remempassword">
            <label className="remember-me">
              <input type="checkbox" id="rememberMe" name="rememberMe" />
              Remember Me
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button">Sign In</button>

          {/* Google Sign-In */}
          <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
            <FontAwesomeIcon icon={faGoogle} className="google-icon" />
            Sign In with Google
          </button>

          <p className="sign-up">
            Don't have an account?{" "}
            <span className="sign-up-link">
              <Link to="/signup">Sign up!</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
