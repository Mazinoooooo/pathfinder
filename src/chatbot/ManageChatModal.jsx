import { useState } from "react";
import "../styles/ManageChat.css";

export default function ManageChatModal({ isOpen, onDeleteChat, onCancel }) {
  const [confirming, setConfirming] = useState(false);

  if (!isOpen) return null;

  const handleDeleteClick = () => {
    setConfirming(true);
  };

  const handleConfirmDelete = () => {
    onDeleteChat();
    setConfirming(false);
  };

  const handleCancelConfirm = () => {
    setConfirming(false);
  };

  return (
    <div className="modal-managechat">
      <div className="managechat">
        {!confirming ? (
          <>
            <h3>Manage Chat</h3>
            <h4>Choose an action for your current conversation.</h4>

            <div className="managechat-buttons">
              <button onClick={handleDeleteClick} className="deletechat-btn">
                Delete Chat
              </button>
              <button onClick={onCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>Are you sure?</h3>
            <h4>This will permanently delete your conversation.</h4>

            <div className="managechat-buttons">
              <button onClick={handleConfirmDelete} className="deletechat-btn">
                Yes, Delete
              </button>
              <button onClick={handleCancelConfirm} className="cancel-btn">
                No, Go Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
