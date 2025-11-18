import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import '../styles/Signup.css';

// Firebase
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../Firebase/firebaseConfig';

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirm = () => setShowConfirm(!showConfirm);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      alert('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save display name in Firebase Auth
      await updateProfile(user, { displayName: fullName });

      // Send email verification
      await sendEmailVerification(user);

      // Save user info in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: fullName,
        email,
        createdAt: serverTimestamp(),
      });

      alert('Signup successful! Please check your email to verify your account.');
      navigate('/'); // Redirect to login or landing page
    } catch (err) {
      console.error('Signup error:', err.message);
      alert('Signup failed: ' + err.message);
    }
  };

  const handleCloseSignup = () => navigate('/');
  const handleLoginClick = () => navigate('/');

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
              {/* Full Name */}
              <div className="col-12">
                <label htmlFor="fullName" className="form-label">Name</label>
                <input
                  type="text"
                  id="fullName"
                  className="form-control"
                  placeholder="Enter your full name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="col-12">
                <label htmlFor="yourEmail" className="form-label">Email</label>
                <input
                  type="email"
                  id="yourEmail"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="col-12">
                <label htmlFor="yourPassword" className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="yourPassword"
                    className="form-control"
                    placeholder="Enter your password"
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

              {/* Confirm Password */}
              <div className="col-12">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <FontAwesomeIcon
                    icon={showConfirm ? faEyeSlash : faEye}
                    onClick={toggleConfirm}
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
