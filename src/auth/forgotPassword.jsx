import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase/firebaseConfig";
import "../styles/Login.css";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset link sent! Check your inbox or spam folder.");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setMessage("No account found with that email.");
      } else {
        setMessage("Failed to send reset link. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-login">
      <div className="modal-content-login">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="welcome">
          <h2 className="login-greetings">Forgot Password?</h2>
          <p className="sub-text">We’ll send a reset link to your email.</p>
        </div>

        <form onSubmit={handleReset}>
          <div className="form-group-email">
            <input
              className="login-email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {message && <p className="reset-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
