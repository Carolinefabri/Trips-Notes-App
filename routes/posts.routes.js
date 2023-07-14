const router = require("express").Router();
const Post = require("../models/Post.model");
const uploader = require("../middleware/cloudinary.config");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.render("posts", { posts });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).send("Error retrieving posts");
  }
});

router.get("/create", (req, res) => {
  res.render("posts/new-post");
});

router.post("/create", uploader.single("image"), async (req, res) => {
  const { location, title, startDate } = req.body; 
  const payload = { location, title, startDate } ;
  if (req.file) {
   payload.image = req.file.path;
  };
 

  try {
    const newPost = await Post.create(payload)
    res.redirect("/posts");
  } catch (error) {
    console.error("Error creating post:", error);
    res.render("posts/new-post", {
      errorMessage: "There was an error creating a new post. Please try again.",
    });
  }
});

module.exports = router;
