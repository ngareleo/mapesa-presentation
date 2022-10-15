module.exports = (req, res) => {
  res.status(404).render("error", {
    errorHeader: "404 Error",
    errorMsg: "Page not Found",
  });
};
