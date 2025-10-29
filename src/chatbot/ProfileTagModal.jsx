import predefinedTags from "../constants/predefinedTags";

export default function ProfileTagModal({ selectedTags, setSelectedTags, onClose }) {

    // dynamically detect conflicts: "Good in Math" ↔ "Great in Math"
    const findConflict = (tag) => {
        if (tag.startsWith("Good")) {
            return tag.replace("Good", "Great");
        } else if (tag.startsWith("Great")) {
            return tag.replace("Great", "Good");
        }
        return null;
    };

    const toggleTag = (category, tag) => {
        setSelectedTags(prev => {
            const alreadySelected = prev[category].includes(tag);
            const limit = category === "Skills" ? 3 : 2;

            let updatedCategory = [...prev[category]];

            if (alreadySelected) {
                updatedCategory = updatedCategory.filter(t => t !== tag);
            } else {
                if (updatedCategory.length < limit) {
                    const conflict = findConflict(tag);
                    if (conflict && updatedCategory.includes(conflict)) {
                        return prev;
                    }
                    updatedCategory.push(tag);
                }
            }

            return { ...prev, [category]: updatedCategory };
        });
    };

    return (
        <div className="modal-setup">
            <div className="tag-container">
                <h3>Select Profile Tags</h3>

                {Object.entries(predefinedTags).map(([category, tags]) => (
                    <div key={category} className="tag-category">
                        <h4>
                            {category} ({selectedTags[category]?.length || 0}/{category === "Skills" ? 3 : 2} selected)
                        </h4>

                        <div className="tag-group">
                            {tags.map(tag => {
                                const selected = selectedTags[category]?.includes(tag);
                                const limitReached = !selected && selectedTags[category]?.length >= (category === "Skills" ? 3 : 2);
                                const conflict = findConflict(tag);
                                const isLocked = selectedTags[category]?.includes(conflict);

                                return (
                                    <div
                                        key={tag}
                                        className={`tag ${selected ? "selected" : ""} ${limitReached || isLocked ? "disabled" : ""}`}
                                        onClick={() => {
                                            if (!limitReached && !isLocked) toggleTag(category, tag);
                                        }}
                                    >
                                        {tag}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <button className="btn-save" onClick={onClose}>Done</button>
            </div>
        </div>
    );
}
