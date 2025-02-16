import express from "express";
import User from "../models/userModel.js";
import Template from "../models/templateModel.js";
import verifyToken from "../utils/verifyToken.js";

const cartRouter = express.Router();

cartRouter.post("/cart", verifyToken,async (req, res) => {
    try {
        const { userId, template_Id } = req.body;

        if (!userId || !template_Id) {
            return res.status(400).json({ message: "UserId and TemplateId are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const template = await Template.findById(template_Id);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

      
        if (user.cart.some((item) => item.template._id.toString() === template_Id)) {
            return res.status(400).json({ message: "Template already exists in cart" });
        }

        // Add the template to the cart
        const addedCart = await User.findByIdAndUpdate(userId, {
            $push: {
                cart: {
                    template: template._id,  // Push only the ObjectId of the template
                    quantity: 1,
                },
            }
        }, { new: true });

        return res.status(200).json({ message: "Template added to cart", addedCart });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


cartRouter.get("/cart", async (req, res) => {
    try {
        const { userId } = req.query;

        // const user = await User.findById(userId)
        const user = await User.findById(userId).populate({
            path: "cart.template",
            select: "defaultValues.title defaultValues.price defaultValues.imageUrl defaultValues.description",
        });

        if (!user) {
            console.log("User not found!!");
        }

        const cart = user.cart;

        return res.status(200).json({ message: "cart Items fetched successfully!!", cart });
    } catch (error) {
        console.log("error", error);
    }
});

cartRouter.delete("/cart", verifyToken,async (req, res) => {
    try {
        const { userId, itemId } = req.query;

        // const user = await User.findById(userId)
        const user = await User.findById(userId);

        if (!user) {
            console.log("User not found!!");
        }
        const cartIndex = user.cart.findIndex((item) => item._id.toString() === itemId)
        if (cartIndex === -1) {
            return res.status(200).json({ message: "cart Items not found", cartIndex });
        }
        user.cart.splice(cartIndex, 1);
        user.save(0)

        return res.status(200).json({ message: "Item removed from cart successfully!" });
    } catch (error) {
        console.log("error", error);
    }
});

export default cartRouter;