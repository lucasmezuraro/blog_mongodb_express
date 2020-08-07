import { User, UserType } from "../models/User.entity";
import { Request, Response } from "express";

export class UserController {

    constructor() {

    }

    async index(req: Request, res: Response): Promise<any> {
        try {
            const users = await User.find();
            res.json({users: users});
        }catch(err) {
            return res.json({err: err.message});
        }
    }

    async findOne(req: Request, res: Response): Promise<any> {
        const {id} = req.params;
        try {
            const user = await User.findOne({_id: id});
            res.json({user: user});
        }catch(err) {
            return res.json({error: err.message}).status(500);
        }
    }

    async create(req: Request, res: Response): Promise<any> {
        const {user} = req.body; 
        try {
            const users: UserType = await (await User.create(user)).save();
            return res.json({users: users});
        }catch(err) {
            return res.json({error: err.message}).status(500);
        } 
    }

    async update(req: Request, res: Response): Promise<any> {
        const {id} = req.params;
        const {user} = req.body;
    
        try {
            const mod: any = (await (await User.findByIdAndUpdate(id, user, {new: true}))?.save());
            return res.json({user: mod});
        }catch(err) {
            return res.json({error: err.message}).status(500);
        }
    }

    async delete(req: Request, res: Response): Promise<any> { 
        const {id} = req.params; 
        const {user} = req.body;
        try {
            const removed: any = (await (await User.deleteOne({_id: id})).deletedCount); 
            return res.json({removed});
        }catch(err) {
            return res.json({error: err.message}).status(500);
        }
    }

}

export default new UserController();