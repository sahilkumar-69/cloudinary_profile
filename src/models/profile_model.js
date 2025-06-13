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
  pdf_url: {
    type: String,
    require: true,
  },
});

export const profile_model = model("profile_model", profile_schema);
