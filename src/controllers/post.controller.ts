import { Request, Response } from "express";
import { Post } from "../models/Post.entity";
import { User } from "../models/User.entity";
import { Category } from "../models/Category.entity";

export class PostController {

    constructor() {

    }

    async get(req: Request, res: Response) : Promise<any> {
        try { 
            const posts = await Post.find().populate(
                [{path: 'category', select: 'description'},
                 {path: 'author', select: 'username'}]);
            res.json({posts: posts});
       }catch(err) {
            return res.json({error: err.message}).status(500);
       }
    }

    async create(req: Request, res: Response): Promise<any> { 
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
     }

     async getByCategory(req: Request, res: Response): Promise<any> {
        const {category} = req.params;
        try {
            const results = await Post.find().where({"category": {_id: category}});
            res.json({post: results});
             
                     
        }catch(err) {
            return res.json({err: err.message});
        }    
    }
    
    async getByCategoryAndAuthor(req: Request, res: Response): Promise<any> {
        const {category, author} = req.params;
        try {
             const results = await Post.find().where({"category": {_id: category}, "author": {_id: author}});
    
    
             return res.json({posts: results});
                     
        }catch(err) {
            return res.json({err: err.message});
        }    
    }
}

export default new PostController();