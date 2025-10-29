import '../styles/ChatBotLogout.css'

export default function ChatbotLogout ({ isOpen, onConfirm, onCancel}) {

    //logout modal, redirect to the landing page
    if(!isOpen) return null;
    
    return (
        <div className="modal-logout">
            <div className="logout">
                <h3>Are you sure you want to Logout?</h3>
                <h4>You will be Logged out.</h4>
                <div className="logout-buttons">
                    <button onClick={onConfirm} className="logout-confirm">Logout</button>
                    <button onClick={onCancel} className="logout-cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
}