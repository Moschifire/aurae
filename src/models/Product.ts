import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ["AuraéSkin", "AuraéBeauty", "AuraéAdorn", "AuraéLiving"] 
  },
  images: [{ type: String }], // Array of Cloudinary URLs
  stock: { type: Number, default: 0 },
  details: {
    ingredients: String, // For Skin/Beauty
    materials: String,    // For Adorn
  },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;