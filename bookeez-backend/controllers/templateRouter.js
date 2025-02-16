import express from "express";
import Template from "../models/templateModel.js";
import mongoose from 'mongoose';
import verifyToken from "../utils/verifyToken.js";

const templateRouter = express.Router();

templateRouter.post("/add-template", verifyToken, async (req, res) => {
  const { template_name, defaultValues } = req.body;

  try {

    if (!defaultValues.title || !defaultValues.author || !defaultValues.price || !defaultValues.isbn || !defaultValues.subject || !defaultValues.stream || !defaultValues.description || !defaultValues.semester || !defaultValues.condition || !defaultValues.imageUrl) {
      return res.status(400).json({ message: 'All fields (title, author, price, isbn, subject, group, description) are required.' });
    }

    const newTemplate = new Template({
      template_name,
      defaultValues: {
        title: defaultValues.title,
        author: defaultValues.author,
        price: defaultValues.price,
        isbn: defaultValues.isbn,
        subject: defaultValues.subject,
        stream: defaultValues.stream,
        description: defaultValues.description,
        semester: defaultValues.semester,
        condition: defaultValues.condition,
        imageUrl: defaultValues.imageUrl
      },
      books: [],
    });

    // Save the template to the database
    await newTemplate.save();

    res.status(200).json({
      message: "New Template Created successfully!",
      template: newTemplate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating template',
      error: error.message,
    });
  }
});

templateRouter.get("/template", async (req, res) => {

  try {
    const allTemplates = await Template.find();

    if (!allTemplates && allTemplates.length == 0) {
      return res.status(400).json({
        message: 'No Templates Found!',
        error: error.message,
      });
    }

    res.status(200).json({
      message: "allTemplates are rendered successfully!",
      template: allTemplates,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating template',
      error: error.message,
    });
  }
});

templateRouter.get("/template/review", async (req, res) => {

  try {
    const allTemplates = await Template.find();

    if (!allTemplates && allTemplates.length == 0) {
      return res.status(400).json({
        message: 'No Templates Found!',
        error: error.message,
      });
    }

    let allReviews = [];

    allTemplates.forEach(template => {
      if (template.reviews && template.reviews.length > 0) {

        allReviews = [...allReviews, ...template.reviews];
      }
    });

    res.status(200).json({
      message: "allReviews are rendered successfully!",
      allReviews: allReviews,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating template',
      error: error.message,
    });
  }
});

templateRouter.post("/template/:id/review", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { username, comment, rating } = req.body;
    console.log("user req in review", req.body);
    const uid = req.userId
    const reviewAddedTemplate = await Template.findByIdAndUpdate(id, {
      $push: { reviews: { userId: uid, username, comment, rating, date: new Date() } }
    },
      { new: true }
    )

    res.status(200).json({ message: "Review added successfully!!!", reviewAddedTemplate })
  } catch (error) {
    console.log("error", error)
    res.status(400).json({ message: "Review could not be added successfully!!!", error });
  }
})

templateRouter.get("/template/:id/review", async (req, res) => {
  try {
    const { id } = req.params;

    const reviewTemplate = await Template.findById(id)
    const reviews = reviewTemplate.reviews
    res.status(200).json({ message: "Reviews fetched successfully!!!", reviews })
  } catch (error) {
    console.log("error", error)
    res.status(400).json({ message: "Reviews could not be fetched successfully!!!", error });
  }
})
templateRouter.get("/template/:id", async (req, res) => {

  try {
    const template_id = req.params.id;
    const template = await Template.findById(template_id);

    if (!template) {
      return res.status(400).json({
        message: 'No Templates Found!',
        error: error.message,
      });
    }

    res.status(200).json({
      message: "allTemplates are rendered successfully!",
      template: template,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating template',
      error: error.message,
    });
  }
});
templateRouter.get("/template/:id/review/:reviewId", async (req, res) => {

  try {
    const template_id = req.params.id;
    const template = await Template.findById(template_id);
    const reviewId = req.params.reviewId;

    if (!template) {
      return res.status(400).json({
        message: 'No Templates Found!',
        error: error.message,
      });
    }

    const review = template.reviews.filter((review) => review._id.toString() === reviewId);

    res.status(200).json({
      review:review[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'cannot get reviews',
      error: error.message,
    });
  }
});
templateRouter.put("/template/:id/review/:reviewId", verifyToken, async (req, res) => {

  try {
    const template_id = req.params.id;
    const template = await Template.findById(template_id);
    const reviewId = req.params.reviewId;

    if (!template) {
      return res.status(400).json({
        message: 'No Templates Found!',
        error: error.message,
      });
    }

    const updatedFields = req.body;
    const reviewIdx = template.reviews.findIndex((review) => review._id.toString() === reviewId);

    if (reviewIdx === -1) {
      return res.status(404).json({ message: 'Review not found!' });
    }

    const reviewToUPdate = template.reviews[reviewIdx];
    Object.keys(updatedFields).forEach((field) => {
      reviewToUPdate[field] = updatedFields[field];
    })

    const updatedTemplate = await template.save();
    res.status(200).json({
      message: "Template updated successfully!",
      template: updatedTemplate,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'cannot update template',
      error: error.message,
    });
  }
});
templateRouter.delete("/template/:id/review/:reviewId", verifyToken, async (req, res) => {

  try {
    const template_id = req.params.id;
    const template = await Template.findById(template_id);
    const reviewId = req.params.reviewId;

    if (!template) {
      return res.status(400).json({
        message: 'No Templates Found!',
        error: error.message,
      });
    }

    const updatedReviews = template.reviews.filter((review) => review._id.toString() !== reviewId);
    template.reviews = updatedReviews;

    await template.save();

    res.status(200).json({
      message: "Template deleted successfully!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'cannot update template',
      error: error.message,
    });
  }
});
templateRouter.delete("/template/:id", verifyToken, async (req, res) => {

  try {
    const template_id = req.params.id;
    const deletedTemplate = await Template.findByIdAndDelete(template_id);

    if (!mongoose.Types.ObjectId.isValid(template_id)) {
      return res.status(400).json({ message: "Invalid template ID" });
    }

    if (!deletedTemplate) {
      return res.status(400).json({
        message: 'No Template Found!',
      });
    }

    res.status(200).json({
      message: "Template Deleteed Successfully!",
      template: deletedTemplate,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating template',
      error: error.message,
    });
  }
});

templateRouter.put("/template/:id", verifyToken, async (req, res) => {
  console.log("Request Body: ", req.body);
  const templateId = req.params.id;
  const { template_name, defaultValues } = req.body;

  if (!mongoose.Types.ObjectId.isValid(templateId)) {
    return res.status(400).json({ message: "Invalid template ID" });
  }

  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      templateId,
      {
        $set: {
          template_name,
          'defaultValues.title': defaultValues.title,
          'defaultValues.author': defaultValues.author,
          'defaultValues.price': defaultValues.price,
          'defaultValues.isbn': defaultValues.isbn,
          'defaultValues.subject': defaultValues.subject,
          'defaultValues.group': defaultValues.group,
          'defaultValues.description': defaultValues.description,
          'defaultValues.condition': defaultValues.condition,
          'defaultValues.imageUrl': defaultValues.imageUrl,
          'defaultValues.semester': defaultValues.semester
        }
      },
      { new: true } // Ensure the updated document is returned
    );

    if (updatedTemplate) {
      console.log("Updated Template: ", updatedTemplate);
    }


    if (!updatedTemplate) {
      res.status(404).json({
        message: 'Template Not found!',
      });
    }
    console.log("templ", updatedTemplate)
    const responseTemplate = {
      template_name: updatedTemplate.template_name,
      defaultValues: updatedTemplate.defaultValues
    };

    res.status(200).json({
      message: " Template Updated successfully!",
      template: responseTemplate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating template',
      error: error.message,
    });
  }
});

export default templateRouter;
