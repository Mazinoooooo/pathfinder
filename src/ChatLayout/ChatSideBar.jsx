import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons';
import { faGear, faArrowRightFromBracket, faComments } from '@fortawesome/free-solid-svg-icons'; // 👈 added

// Reusable component in the Chatbot
export default function ChatSideBar({ isExpanded, onSelect, onLogout, onManageChat }) {
  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`} id="sidebar">
      <div className="sidebar-item" onClick={() => onSelect('chat')}>
        <span className="sidebar-icon">
          <div className="icon">
            <FontAwesomeIcon icon={faRocketchat} />
          </div>
          <span className="sidebar-label">Chat</span>
        </span>
      </div>

      <div className="sidebar-item" onClick={onManageChat}>
        <span className="sidebar-icon">
          <div className="icon">
            <FontAwesomeIcon icon={faComments} />
          </div>
          <span className="sidebar-label">Chat Options</span>
        </span>
      </div>

      <div className="sidebar-item" onClick={() => onSelect('settings')}>
        <span className="sidebar-icon">
          <div className="icon">
            <FontAwesomeIcon icon={faGear} />
          </div>
          <span className="sidebar-label">Settings</span>
        </span>
      </div>

      <div className="sidebar-item" onClick={onLogout}>
        <span className="sidebar-icon">
          <div className="icon">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </div>
          <span className="sidebar-label">Logout</span>
        </span>
      </div>
    </div>
  );
}
