const CategoriesController = require("../controller/categoriesController");
const passport = require("passport");

module.exports = (app) => {
  // Get all categories
  app.get(
    "/api/categories/getAll",
    passport.authenticate("jwt", { session: false }),
    CategoriesController.getAll
  );
  app.post(
    "/api/categories/create",
    passport.authenticate("jwt", { session: false }),
    CategoriesController.create
  );
};
