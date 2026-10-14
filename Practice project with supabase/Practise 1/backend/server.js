const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");
const auth = require("./middleware/auth");
const validateTodo = require("./middleware/validateTodo");
const validateNote = require("./middleware/validateNote");
const validateEducation = require("./middleware/validateEducation");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(logger); // runs on every request, before it reaches a route below

// CREATE - add a new todo for the logged-in user
// auth runs first (attaches req.user/req.supabase), then validateTodo checks req.body.text
app.post("/todos", auth, validateTodo, async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from("todos")
      .insert({ text: req.body.text, user_id: req.user.id })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err); // hand off to errorHandler
  }
});

// READ - get all todos belonging to the logged-in user
// Row Level Security on the todos table already restricts rows to req.user,
// so no extra filtering is needed here.
app.get("/todos", auth, async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from("todos")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// UPDATE - edit a todo by id (only succeeds if it belongs to the logged-in user)
app.put("/todos/:id", auth, validateTodo, async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from("todos")
      .update({ text: req.body.text })
      .eq("id", req.params.id)
      .select();

    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(data[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE - remove a todo by id (only succeeds if it belongs to the logged-in user)
app.delete("/todos/:id", auth, async (req, res, next) => {
  try {
    const { error } = await req.supabase
      .from("todos")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Todo deleted" });
  } catch (err) {
    next(err);
  }
});

// ----- NOTES -----
// Second resource, built exactly like the todos routes above: auth first,
// validateNote on the routes that accept a body, and RLS on the notes table
// keeps each user limited to their own rows.

// CREATE - add a new note for the logged-in user
app.post("/notes", auth, validateNote, async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from("notes")
      .insert({
        title: req.body.title,
        content: req.body.content || "", // content is optional
        user_id: req.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// READ - get all notes belonging to the logged-in user
app.get("/notes", auth, async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from("notes")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// UPDATE - edit a note by id (only succeeds if it belongs to the logged-in user)
app.put("/notes/:id", auth, validateNote, async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from("notes")
      .update({ title: req.body.title, content: req.body.content || "" })
      .eq("id", req.params.id)
      .select();

    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(data[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE - remove a note by id (only succeeds if it belongs to the logged-in user)
app.delete("/notes/:id", auth, async (req, res, next) => {
  try {
    const { error } = await req.supabase
      .from("notes")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
});

// ----- EDUCATION -----
// Third resource: degree/title, institution, and year.
// Auth runs first, validateEducation checks degree, and Supabase RLS handles user scoping.

// CREATE - add an education record for the logged-in user
app.post("/education", auth, validateEducation, async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from("education")
      .insert({
        degree: req.body.degree,
        institution: req.body.institution || "",
        year: req.body.year || "",
        user_id: req.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// READ - get all education records belonging to the logged-in user
app.get("/education", auth, async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from("education")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// UPDATE - edit an education record by id
app.put("/education/:id", auth, validateEducation, async (req, res, next) => {
  try {
    const { data, error } = await req.supabase
      .from("education")
      .update({
        degree: req.body.degree,
        institution: req.body.institution || "",
        year: req.body.year || "",
      })
      .eq("id", req.params.id)
      .select();

    if (error) throw error;
    if (data.length === 0) {
      return res.status(404).json({ message: "Education record not found" });
    }
    res.json(data[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE - remove an education record by id
app.delete("/education/:id", auth, async (req, res, next) => {
  try {
    const { error } = await req.supabase
      .from("education")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Education record deleted" });
  } catch (err) {
    next(err);
  }
});

// DEMO route - deliberately throws, so you can see errorHandler in action.
// None of the real CRUD routes above throw errors during normal use,
// so this exists purely to test/verify the errorHandler middleware.
app.get("/crash", () => {
  throw new Error("This is a deliberate test error");
});

app.use(notFound); // no route above matched - respond 404
app.use(errorHandler); // must be last - catches errors from any route above

// Only start a normal server when running locally (node server.js).
// On Vercel, this file is imported as a serverless function instead,
// so app.listen() must not run there.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
