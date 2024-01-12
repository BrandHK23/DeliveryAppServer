const BusinessController = require("../controller/businessController");

module.exports = (app, upload) => {
  app.get("/api/business/getAll", BusinessController.getAll);
  app.post(
    "/api/business/create",
    upload.array("image", 1),
    BusinessController.registerWithImage
  );
};
