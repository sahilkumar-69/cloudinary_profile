import { file_model } from "../models/fileModel.js";
import { v2 } from "cloudinary";
import cloudinary from "../Utils/cloudinary.js";
import { profile_model } from "../models/profile_model.js";

export const upload_file = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({
        msg: "name is mendatory ",
      });
    }

    const fileStr = req.file.path;
    // console.log("filstr",fileStr);
    if (!fileStr) {
      return res.status(500).json({
        message: "file path not found",
      });
    }

    const cloudRes = await cloudinary(fileStr);
    console.log(cloudRes);

    if (!cloudRes) {
      throw new Error("could not uploaded to cloudinary");
    }

    const link = cloudRes.secure_url;

    const file = await file_model.create({
      name,
      link,
      publicId: cloudRes?.public_id,
    });

    if (!file) {
      return res.json({
        msg: "something missing ",
      });
    }

    res.json({
      success: true,
      msg: "file uploaded",
      link,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};

export const delete_record = async (req, res) => {
  try {
    const { name } = req.body;
    // console.log(name);
    if (!name) {
      return res.status(400).json({
        message: "please provide name",
      });
    }

    const record = await file_model
      .findOne({
        name,
      })
      .select("publicId");

    // console.log("record", record);

    if (!record) {
      return res.status(400).json({
        message: "no record found",
      });
    }

    try {
      const deleteRes = await v2.uploader.destroy(record.publicId);

      console.log(deleteRes);

      if (!deleteRes) {
        return res.status(400).json({
          message: "error while deleting from cloudinary ",
        });
      }
    } catch (err) {
      console.log("error in deleting from cloudinary", err);
    }

    const record_delete = await file_model.findByIdAndDelete(record._id);

    // console.log("record_delete", record_delete);

    res.json({
      message: "record deleted from database",
      data: record_delete,
    });
  } catch (error) {}
};

export const upload_profileData = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({
        msg: "name is mendatory ",
      });
    }

    if (!req?.files || req?.files.length < 3) {
      return req.status(400).json({
        message: "Please upload all files",
      });
    }

    const { video, pdf, avatar } = req.files;

    const file_paths = [avatar[0].path, video[0].path, pdf[0].path];
    console.log(req?.files);

    // console.log(video[0].path)
    // console.log(pdf[0].path)
    // console.log(avatar[0].path)

    const upload_links = [];
    try {
      for (let i = 0; i < 3; i++) {
        const cloudinary_response = await cloudinary(file_paths[i]);

        // if (!cloudinary_response) {
        //   return console.error("(file controller 137)error while uploading ");
        // }
        console.log("looop response from cloudinary ", cloudinary_response);

        upload_links.push(cloudinary_response.secure_url);
        // console.log(file.path);
      }

      var profile = await profile_model.create({
        name,
        avatar_url: upload_links[0],
        video_url: upload_links[1],
        image_url: upload_links[2],
        pdf_url: "",
      });

      if (!profile) {
        return res.status(500).json({
          message: "Entry isn't saved in db",
        });
      }
    } catch (error) {
      console.error("error aagya bhai", error);
      return res.status(500).json({ error });
    }

    res.status(400).json({
      upload_links,
      profile
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};
