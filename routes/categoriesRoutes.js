const CategoriesController = require("../controller/categoriesController");
const passport = require("passport");

module.exports = (app) => {
  app.post(
    "/api/categories/create",
    passport.authenticate("jwt", { session: false }),
    CategoriesController.create
  );
};
