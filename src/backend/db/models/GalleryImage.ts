import { Schema, models, model } from "mongoose"

const GalleryImageSchema = new Schema(
  {
    url: { type: String, required: true },
    key: { type: String, default: "" },
  },
  { timestamps: true }
)

export const GalleryImage =
  models["GalleryImage"] ?? model("GalleryImage", GalleryImageSchema)

export default GalleryImage
