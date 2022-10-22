const Comment = require("../models/Comment.js");

module.exports = {
    createComment: async (req, res) => {
        try {
        // const commentUser = await User.findById(req.user.id);
        await Comment.create({
            comment: req.body.comment,
            likes: 0,
            item: req.params.id,
            createdBy: req.user.userName,
            createdById: req.user.id
        });
        console.log("Comment has been added!");
        res.redirect("/item/"+req.params.id);
        } catch (err) {
        console.log(err);
        }
    },
    deleteComments: async (req, res) => {
        try {
        await Comment.deleteOne({_id: req.params.commentid})
        res.redirect("/item/"+req.params.itemid);
        }catch(err) {
        console.log(err)
        }
    }
};