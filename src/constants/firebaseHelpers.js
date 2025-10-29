// firebaseHelpers.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebaseConfig";

export const fetchUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("No such user!");
      return null;
    }

    const profile = userSnap.data();

    // Ensure all optional fields exist
    profile.SHS_Strand = profile.SHS_Strand || "STEM";       // default strand
    profile.SchoolType = profile.SchoolType || "Public";     // default school type
    profile.Personality = profile.Personality || [];
    profile.Workstyle = profile.Workstyle || [];
    profile.Interests = profile.Interests || [];
    profile.Skills = profile.Skills || [];
    profile.courseDuration = profile.courseDuration || [];

    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};