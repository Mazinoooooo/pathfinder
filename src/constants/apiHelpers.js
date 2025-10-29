// apiHelpers.js
import { fetchUserProfile } from "./firebaseHelpers.js";

/**
 * Sends a user's profile to FastAPI for cousin group prediction.
 * @param {string} userId - Firestore user ID
 * @returns {Promise<Object|null>} - { predicted_group, top_3_groups } or null on error
 */
export const getPrediction = async (userId) => {
  try {
    const profile = await fetchUserProfile(userId);
    if (!profile) return null;

    const response = await fetch("http://localhost:8000/predict/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (!response.ok) throw new Error("Prediction request failed");

    return await response.json(); // { predicted_group, top_3_groups }
  } catch (error) {
    console.error("Error getting prediction:", error);
    return null;
  }
};
