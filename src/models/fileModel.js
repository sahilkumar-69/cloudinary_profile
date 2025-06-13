import mgs from "mongoose";

const file_schema = new mgs.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      require: true,
    },
    publicId: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const file_model = mgs.model("file_model", file_schema);
