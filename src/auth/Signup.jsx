import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from  '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import '../styles/Signup.css';

//Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../Firebase/firebaseConfig";


export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        createdAt: serverTimestamp()
      });

      alert("Signup successful!");
      navigate('/');
    } catch (err) {
      console.error("Signup error:", err.message);
      alert("Signup failed: " + err.message);
    }
  };

  const handleCloseSignup = () => {
    navigate('/');
  }

    const handleLoginClick = () => {
    navigate('/'); // Go to landing page
  };

  return (
    <div className="signup-page">
      <div className="container-signup">
        <div className="card">
          <div className="card-body">
            <button className="signup-close" onClick={handleCloseSignup} aria-label="Close">×</button>
            <div className="pt-4 pb-2">
              <h5 className="signup-name">Create an Account</h5>
              <p className="sign-sub">Enter your details</p>
            </div>
            <form className="row g-3 needs-validation" noValidate onSubmit={handleSignup}>
              <div className="col-12">
                <label htmlFor="yourEmail" className="form-label">Your Email</label>
                <div className="input-group">
                  <input
                    type="email"
                    aria-label="Email Address"
                    name="email"
                    className="form-control"
                    id="yourEmail"
                    placeholder="Enter your Email"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12">
                <label htmlFor="yourPassword" className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    aria-label="Password"
                    name="password"
                    className="form-control"
                    id="yourPassword"
                    placeholder="Enter your Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={togglePassword}
                  className="eye-icon-signup"
                />
                </div>
              </div>
              <div className="col-12">
                <button className="signup-btn" type="submit">Create Account</button>
              </div>
              <div className="col-12">
                <p className="small mb-0">
                  Already have an account?{' '}
                  <span className="login-link" onClick={handleLoginClick}>Log in</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
