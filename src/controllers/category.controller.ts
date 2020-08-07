import { Category } from "../models/Category.entity";
import { Request, Response } from "express";


export class CategoryController {

    constructor() {

    }

    async index(req: Request, res: Response):Promise<any> {

        const {description} = req.body;
        try {
            const category = await (await Category.create({description})).save()
            return res.json({category: category});
        }catch(err) {
            return res.json({err: err.message}).status(500);
        }
    }
}

export default new CategoryController();