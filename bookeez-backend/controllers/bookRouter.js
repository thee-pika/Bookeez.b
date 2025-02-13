import express from "express";
import Template from "../models/templateModel.js";
import mongoose from 'mongoose';

const bookRouter = express.Router();

bookRouter.post("/:id/addBook", async (req, res) => {
    try {
        const template_id = req.params.id;

        const newBook = req.body;
        console.log(newBook)
        if (!newBook) {
            console.log("No Book Found through request")
        }
        const template = await Template.findById(template_id)

        if (template) {
            template.books.push(newBook);
           const updatedTemplate =  await template.save()
            res.status(200).json({
                message: 'Book added successfully',
                updatedTemplate: updatedTemplate
            });
        } else {
            res.status(404).json({ message: 'Template not found' });
        }
    } catch (error) {
        console.log("eror", error)
        res.status(404).json({ message: 'eror' });
    }
})


bookRouter.get("/", async (req,res) => {
   const templates = await Template.find();

   if(!templates || templates.length < 1) {
    res.status(404).json({ message: 'No Templates found' });
    return;
   }

   res.status(200).json({ templates });

})

export default bookRouter