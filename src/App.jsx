import { Routes, Route } from 'react-router-dom';
import Chatbot from './chatbot/Chatbot.jsx'
import Landing from './landingpage/Landing.jsx';
import Signup from './auth/Signup.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/*" element={<Landing />} />
    </Routes>
  );
}
