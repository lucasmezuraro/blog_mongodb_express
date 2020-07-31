import express, { Router, Request, Response } from 'express';
import { DatabaseManager } from './database';
import {User, UserType} from '../src/models/User.entity';
import { Post } from './models/Post.entity';
import { Category } from './models/Category.entity';
import * as mongoose from 'mongoose';

const db = new DatabaseManager().getConnection();

const router: Router = express.Router();

router.get("/users/", async (req: Request, res: Response) => {
    
   const users = await User.find();
    res.json({users: users});
});

router.get("/users/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
    const user = await User.findOne({_id: id});
     res.json({user: user});
    }catch(err) {
        return res.json({error: err.message}).status(500);
    }
   });


router.post("/users/", async (req: Request, res: Response) => {

    const {user} = req.body; 
    try {
        const users: UserType = await (await User.create(user)).save();
        return res.json({users: users});
    }catch(err) {
        return res.json({error: err.message}).status(500);
    }    
});

router.put("/users/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    const {user} = req.body;
  
    try {
        const mod: any = (await (await User.findByIdAndUpdate(id, user, {new: true}))?.save());
        return res.json({user: mod});
    }catch(err) {
        return res.json({error: err.message}).status(500);
    }
});

router.delete("/users/:id", async (req: Request, res: Response) => {
    const {id} = req.params;
    const {user} = req.body;
    try {
        const removed: any = (await (await User.remove({_id: id})).deletedCount);
        return res.json({removed});
    }catch(err) {
        return res.json({error: err.message}).status(500);
    }
});

router.get('/posts', async (req: Request, res: Response) => {
   try { 
        const posts = await Post.find({});
        res.json({posts: posts});
   }catch(err) {
        return res.json({error: err.message}).status(500);
   }
});

router.post('/posts', async (req: Request, res: Response) => {
    try { 
         const {post} = req.body;
         const user = await User.findOne({username: post.username});
         const category = await Category.findOne({description: post.category});
         const posts = await (await Post.create({
             title: post.title,
             author: user?.id,
             category: category?._id,
             content: post.content
         })).save();
         res.json({posts: posts});
    }catch(err) {
         return res.json({error: err.message}).status(500);
    }
 });

router.get("/posts/about/:category", async (req: Request, res: Response) => {
    const {category} = req.params;
    try {

        const id = new mongoose.Schema.Types.ObjectId(category);
         const results = await Post.find().populate({
             path: 'Post',
             match: { _id: {$eq: id}}
         });

         return res.json({posts: results});
                 
    }catch(err) {
        return res.json({err: err.message});
    }    
});

router.get("/posts/categories/:category/author/:author", async (req: Request, res: Response) => {
    const {category, author} = req.params;
    try {

        const idCategory = new mongoose.Schema.Types.ObjectId(category);
        const idAuthor = new mongoose.Schema.Types.ObjectId(author);
         const results = await Post.aggregate([
             {
                 $match: {'author._id': idAuthor}
             }
         ]);

         return res.json({posts: results});
                 
    }catch(err) {
        return res.json({err: err.message});
    }    
});


router.post("/categories", async (req: Request, res: Response) => {

    const {description} = req.body;
    try {
        const category = await (await Category.create({description})).save()
        return res.json({category: category});
    }catch(err) {
        return res.json({err: err.message}).status(500);
    }
})

export default router;