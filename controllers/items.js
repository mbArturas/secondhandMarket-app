const cloudinary = require("../middleware/cloudinary");
const Item = require("../models/Item");
const Comment = require("../models/Comment.js");

module.exports = {
  getProfile: async (req, res) => { 
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const items = await Item.find({ user: req.user.id });
      //Sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", { items: items, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const items = await Item.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { items: items });
    } catch (err) {
      console.log(err);
    }
  },  
  getFeedByCategory: async (req, res) => {
    const category = req.params.category
    try {      
      const items = await Item.find({ category: category })
        .sort({ createdAt: "desc" })
        .lean();
      res.render("category.ejs", { items: items });
    } catch (err) {
      console.log(err);
    }
  },  
  getItem: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const item = await Item.findById(req.params.id);
      const comments = await Comment.find({item: req.params.id}).sort({ createdAt: "asc" }).lean();
      res.render("item.ejs", { item: item, user: req.user, comments: comments});
    } catch (err) {
      console.log(err);
    }
  },
  getItemToEdit: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const item = await Item.findById(req.params.id).lean();      
      res.render("edit.ejs", { item: item, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  createItem: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
      await Item.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likeItem: async (req, res) => {
    try {
      await Item.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/item/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  editItem: async (req, res) => {
    try{
        let itemToEdit = await Item.findById(req.params.id).lean()   

        if(itemToEdit.user != req.user.id) {
            res.redirect('/feed')
        } else {
        itemToEdit = await Item.findOneAndUpdate({_id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        })

        res.redirect(`/item/${req.params.id}`)
        }
    } catch (err) {
        console.error(err)
    }
  },
  deleteItem: async (req, res) => {
    try {
      // Find post by id
      let item = await Item.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(item.cloudinaryId);
      // Delete post from db
      await Item.remove({ _id: req.params.id });
      console.log("Deleted Item");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
