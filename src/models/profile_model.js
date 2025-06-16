import { Schema, model } from "mongoose";

const profile_schema = Schema({
  name: String,
  avatar_url: {
    type: String,
    require: true,
  },
  image_url: {
    type: String,
    // require: true
  },
  video_url: {
    type: String,
    require: true,
  },
  avatar_public_id: String,
  pdf_public_id: String,
  video_public_id: String,
  image_public_id: String,
  pdf_url: {
    type: String,
    require: true,
  },
});

export const profile_model = model("profile_model", profile_schema);
