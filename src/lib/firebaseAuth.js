import { getAuth } from "firebase/auth";
import { app } from "./firebase.js";

export const auth = getAuth(app);
