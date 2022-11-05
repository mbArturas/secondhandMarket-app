const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const itemsController = require("../controllers/items");
const { ensureAuth } = require("../middleware/auth");

//Item Routes
//Since linked from server js treat each path as:
//item/:id, item/createItem, item/likeItem/:id, item/deleteItem/:id
router.get("/:id", ensureAuth, itemsController.getItem);

//Enables user to create post w/ cloudinary for media uploads
router.post("/createItem", upload.single("file"), itemsController.createItem);

//Enables user to like post. In controller, uses POST model to update likes by 1
router.put("/likeItem/:id", itemsController.likeItem);

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deleteItem/:id", itemsController.deleteItem);

module.exports = router;
