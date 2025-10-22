import admin from "firebase-admin";

// Initialize Firebase Admin (only once in your project)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), 
    // or use serviceAccountKey.json
    // credential: admin.credential.cert(serviceAccount)
  });
}

export default async function AdminMiddlewares(req, res, next) {
  try {
    let header = req.headers['authorization'];
    

    if (!header || typeof header !== 'string') {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    let chunks = header.split(" ");
    if (chunks.length !== 2 || chunks[0] !== "Bearer") {
      return res.status(401).json({ error: "Invalid authorization format" });
    }

    const token = chunks[1];

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;  // attach user info (uid, email, roles, etc.)
    
    next(); // go to next middleware/route
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(403).json({ error: "Unauthorized or invalid token" });
  }
}
