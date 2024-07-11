const prisma = require("../helpers/connection")

const AddPost = async(req, res) => {
    try {
      const { title, content, userId } = req.body;

      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          userId,
        },
      });

      res.json({ message: "Post added successfully!", post: newPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getRandom = async(req, res) => {
    try {
      const totalPosts = await prisma.post.count();

      const randomOffset = Math.floor(Math.random() * (totalPosts - 10)); 
    
      const randomPosts = await prisma.post.findMany({
        take: 10,
        skip: randomOffset
      });

      await Promise.all(randomPosts.map(async (post) => {
           await prisma.post.update({
            where: { id: post.id },
            data: { views: post.views + 1 },
        });
    }));
    
      res.json(randomPosts);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getUserWhithBlog = async(req, res) => {
    try {
      const {id} = req.params;
      
      const user = await prisma.users.findMany({
        where: { id: id},
        include: { post: true },
      });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getTopViewsBlog = async(req, res) => {
    try {
      const topPosts = await prisma.post.findMany({
        take: 10,
        orderBy: { views: 'desc' },
    });

    const updatedPosts = await Promise.all(topPosts.map(async (post) => {
        const updatedPost = await prisma.post.update({
            where: { id: post.id },
            data: { views: post.views + 1 },
        });
        return updatedPost;
    }));

    res.json(updatedPosts);
    } catch (error) {
      console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    AddPost, 
    getRandom, 
    getTopViewsBlog, 
    getUserWhithBlog
};