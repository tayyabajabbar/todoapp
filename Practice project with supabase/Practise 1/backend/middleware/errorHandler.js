// Error-handling middleware: Express recognizes it by the 4 arguments
// (err, req, res, next) - that's what makes it special.
// It must be registered LAST, after all routes. If any route handler
// throws, Express skips straight to this function.

function errorHandler(err, req, res, next) {
  console.error(err.message);
  res.status(500).json({ message: "Something went wrong on the server" });
}

module.exports = errorHandler;
