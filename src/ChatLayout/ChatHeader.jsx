export default function ChatHeader({ toggleSidebar }) {
  
  //Reusable component in the Chatbot
  return (
    <header className="chat-header">
      <div className="header-left">
        <a href="#" className="logo-text">PathFinder</a>
        <div id="hamburger" className="hamburger" onClick={toggleSidebar}>☰</div>
      </div>
    </header>
  );
}
