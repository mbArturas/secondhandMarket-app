const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const itemsController = require("../controllers/items");
const { ensureAuth } = require("../middleware/auth");

//Item Routes
//Since linked from server js treat each path as:
//item/:id, item/createItem, item/likeItem/:id, item/deleteItem/:id
router.get("/:id", itemsController.getItem);

//Enables user to create item w/ cloudinary for media uploads
router.post("/createItem", upload.single("file"), itemsController.createItem);

//Enables user to like item. In controller, uses POST model to update likes by 1
router.put("/likeItem/:id", itemsController.likeItem);

//Enables user to edit item. In controller, uses POST model to update item
router.get("/edit/:id", ensureAuth, itemsController.getItemToEdit);

router.get("/feed/:category", itemsController.getFeedByCategory);

//Enables user to edit item. In controller, uses POST model to update item
router.put("/:id", ensureAuth, itemsController.editItem);

//Enables user to delete item. In controller, uses POST model to delete item from MongoDB collection
router.delete("/deleteItem/:id", ensureAuth, itemsController.deleteItem);

module.exports = router;
