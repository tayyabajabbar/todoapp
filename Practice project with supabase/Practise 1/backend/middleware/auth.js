const getSupabaseClient = require("../supabaseClient");

// Route-specific middleware (like validateTodo.js): reads the
// "Authorization: Bearer <token>" header sent by the frontend, verifies
// it with Supabase, and attaches req.user + a token-scoped req.supabase
// client so route handlers can query the database as that logged-in user.

async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const supabase = getSupabaseClient(token);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }

  req.user = data.user;
  req.supabase = supabase;
  next();
}

module.exports = auth;
