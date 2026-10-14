// Route-specific middleware for education: runs BEFORE POST/PUT /education
// Requires a degree/title name; institution and year are optional.

function validateEducation(req, res, next) {
  const { degree } = req.body;

  if (!degree || !degree.trim()) {
    return res.status(400).json({ message: "Degree or qualification title is required" });
  }

  next(); // valid - continue to route handler
}

module.exports = validateEducation;
