import express from "express";
import Template from "../models/templateModel.js";
import verifyToken from "../utils/verifyToken.js";

const bookRouter = express.Router();

bookRouter.post("/:id/book", verifyToken, async (req, res) => {
    try {
        const template_id = req.params.id;
        console.log("req.userId,", req.userId);
        const newBook = req.body;
        const sellerDetails = { ...newBook.sellerDetails, userId: req.userId };
        const book = { ...newBook, sellerDetails };

        if (!newBook) {
            console.log("No Book Found through request")
        }
        const template = await Template.findById(template_id);

        if (template) {
            template.books.push(book);
            const updatedTemplate = await template.save();

            res.status(200).json({
                message: 'Book added successfully',
                updatedTemplate: updatedTemplate
            });

        } else {
            res.status(404).json({ message: 'Template not found' });
        }

    } catch (error) {
        console.log("eror", error)
        res.status(500).json({ message: 'eror' });
    }
})

bookRouter.get("/:id/book", async (req, res) => {
    try {
        const template_id = req.params.id;
        const templates = await Template.findById(template_id);

        if (!templates || templates.length < 1) {
            res.status(404).json({ message: 'No Templates found' });
            return;
        }

        const books = templates.books;
        res.status(200).json({ books });
    } catch (error) {
        res.status(404).json({ message: 'eror', error });
    }
})

bookRouter.put("/:id/book/:bookId/seller/edit", verifyToken, async (req, res) => {
    try {
        const template_id = req.params.id;
        const templates = await Template.findById(template_id);
        const bookId = req.params.bookId;

        const bookIndex = templates.books.findIndex((book) => book._id.toString() === bookId);

        if (!templates) {
            return res.status(400).json({ message: "Template not found" });
        }

        if (bookIndex === -1) {
            return res.status(400).json({ message: "Book not found" });
        }
        const updatedFields = req.body;
        const book = templates.books[bookIndex];

        Object.keys(updatedFields).forEach((field) => {
            if (field in book.sellerDetails) {
                book.sellerDetails[field] = updatedFields[field]
            }
        })

        templates.books[bookIndex] = book;

        const updatedTemplate = await templates.save();
        if (!templates || templates.length < 1) {
            res.status(400).json({ message: 'No Templates found' });
            return;
        }
        // console.log("updated,", updatedTemplate)
        const updatedBook = updatedTemplate.books[bookIndex];
        res.status(200).json({ updatedBook });
    } catch (error) {
        console.log("eror", error);
        res.status(500).json({ message: 'eror', error });
    }
})

bookRouter.put("/:id/book/:bookId", verifyToken, async (req, res) => {
    try {
        console.log(" im innn");
        const template_id = req.params.id;
        const template = await Template.findById(template_id);

        const newbook = req.body;
        const bookId = req.params.bookId;

        if (!bookId) {
            res.status(404).json({ message: 'No bookId found' });
            return;
        }
        const sellerDetails = { ...newbook.sellerDetails, userId: req.userId };
        const book = { ...newbook, sellerDetails };

        if (req.body) {
            const bookIndex = template.books.findIndex((book) => book._id.toString() === bookId);

            template.books[bookIndex] = book;

            const editedTemplate = await template.save();

            res.status(200).json({ message: 'book edited', editedTemplate });
        }

    } catch (error) {
        res.status(500).json({ message: 'eror', error });
    }
})

bookRouter.get("/:id/book/:bookId", async (req, res) => {
    try {

        const template_id = req.params.id;
        const templates = await Template.findById(template_id);

        if (!templates || templates.length < 1) {
            res.status(404).json({ message: 'No Templates found' });
            return;
        }
        const bookId = req.params.bookId;
        const filteredbook = templates.books.filter((book) => book._id.toString() === bookId)
        const book = filteredbook[0];
        
        res.status(200).json({book});
    } catch (error) {
        res.status(404).json({ message: 'eror', error });
    }
})

bookRouter.delete("/:id/book/:bookId", verifyToken, async (req, res) => {
    try {

        const template_id = req.params.id;
        const templates = await Template.findById(template_id);

        if (!templates || templates.length < 1) {
            res.status(404).json({ message: 'No Templates found' });
            return;
        }
        const bookId = req.params.bookId;

        const newBooks = templates.books.filter((book) => book._id.toString() !== bookId);

        templates.books = newBooks;
        const deleted = await templates.save();

        res.status(200).json({ message: "book deleteed successfully", deleted });
    } catch (error) {
        res.status(404).json({ message: 'eror', error });
    }
})

export default bookRouter;