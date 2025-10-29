import { useState } from "react";
import "../styles/AccountSetup.css";

export default function AccountSetupModal({ isOpen, onSave, onOpenTags, selectedTags, closeModal }) {
    // track user data
    const [track, setTrack] = useState ("");
    const [schoolType, setSchoolType] = useState("");
    const [courseDuration, setCourseDuration] = useState("");

    if (!isOpen) return null;

    return(
        <div className="modal-setup">
            <div className="setup-container">
                <h3>Set Up Your Profile</h3>
                <div className="School">
                    <label className="school-label">School Type</label>
                    <select value={schoolType} onChange={(e) => setSchoolType(e.target.value)}>
                        <option value="">Select Type</option>
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                    </select>
                </div>
                <div className="Track">
                    <label className="track-label">Academic Track</label>
                    <select value={track} onChange={(e) => setTrack(e.target.value)}>
                        <option value="">Select Track</option>
                        <option value="STEM">STEM</option>
                        <option value="HUMMS">HUMMS</option>
                        <option value="ABM">ABM</option>
                        <option value="TVL">TVL</option>
                        <option value="GAS">GAS</option>
                    </select>
                </div>
                <div className="Course-duration">
                    <label className="duration-label">Course Span</label>
                    <select value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)}>
                        <option value="">Select Type</option>
                        <option value="2-year">2-year diploma/tech-voc programs only</option>
                        <option value="4-year">4-year degree programs only</option>
                        <option value="2 and 4 year course">Both 2-year and 4-year programs</option>
                    </select>
                </div>

                <button
                    className="setup-button"
                    onClick={onOpenTags}
                    style={{marginBottom: "15px"}}
                >
                    Select Profile Tags
                </button>
                <button
                className="btn-save"
                onClick={async () => {
                    await onSave({ schoolType, track, courseDuration, tags: selectedTags });
                    localStorage.setItem("setupDone", "true");
                    closeModal();
                }}
                >
                Save
                </button>
            </div>
        </div>
    );
}