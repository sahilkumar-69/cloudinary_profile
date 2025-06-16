import { file_model } from "../models/fileModel.js";
import { v2 } from "cloudinary";
import cloudinary from "../Utils/cloudinary.js";
import { profile_model } from "../models/profile_model.js";

export const upload_file = async (req, res) => {
  try {
    let { name } = req?.body;
    if (!name.trim()) {
      return res.status(404).json({
        msg: "name is mendatory ",
      });
    }
    name = name.trim().toLowerCase();

    if (!req.file || !req.file.path) {
      return req.status(404).json({
        message: "file is not uploaded (file path missing)",
      });
    }
    const fileStr = req.file.path;

    const cloudRes = await cloudinary(fileStr);
    // console.log(cloudRes);

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

    res.status(200).json({
      success: true,
      msg: "file uploaded",
      link,
    });
  } catch (error) {
    // console.error("Internal server error");
    res.status(500).json({
      success: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};
export const delete_record = async (req, res) => {
  try {
    let { name } = req?.body;
    if (!name.trim()) {
      return res.status(404).json({
        msg: "name is mendatory ",
      });
    }
    name = name.trim().toLowerCase();

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

    res.status(200).json({
      message: "record deleted from database",
      data: record_delete,
    });
  } catch (error) {}
};
export const upload_profileData = async (req, res) => {
  try {
    let { name } = req?.body;
    if (!name.trim()) {
      return res.status(404).json({
        msg: "name is mendatory ",
      });
    }
    name = name.trim().toLowerCase();

    if (!req?.files || req?.files.length < 3) {
      return req.status(400).json({
        message: "Please upload all files",
      });
    }

    if (!req.file || !req.file.path) {
      return req.status(404).json({
        message: "file is not uploaded (file path missing)",
      });
    }
    const { video, pdf, avatar } = req.files;

    const file_paths = [avatar[0].path, video[0].path, pdf[0].path];
    // const model_keys = [avatar, video, path];
    // console.log(req?.files);

    // console.log(video[0].path)
    // console.log(pdf[0].path)
    // console.log(avatar[0].path)

    const public_id = [];
    const upload_links = [];
    try {
      for (let i = 0; i < 3; i++) {
        const cloudinary_response = await cloudinary(file_paths[i]);

        // if (!cloudinary_response) {
        //   return console.error("(file controller 137)error while uploading ");
        // }
        // console.log("looop response from cloudinary ", cloudinary_response);

        upload_links.push(cloudinary_response.secure_url);
        public_id.push(cloudinary_response.public_id);
        // console.log(file.path);
      }

      var profile = await profile_model.create({
        name,
        avatar_url: upload_links[0],
        video_url: upload_links[1],
        pdf_url: upload_links[2],
        image_url: "",
        avatar_public_id: public_id[0],
        video_public_id: public_id[1],
        pdf_public_id: public_id[2],
        image_public_id: "",
      });

      if (!profile) {
        return res.status(500).json({
          message: "Entry isn't saved in db",
        });
      }
    } catch (error) {
      // console.error("error aagya bhai", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({
      upload_links,
      profile,
    });
  } catch (error) {
    // console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};
export const deleteProfile = async (req, res) => {
  try {
    let { name } = req?.body;

    if (!name.trim()) {
      return res.status(404).json({
        message: "name can't be empty",
      });
    }
    name = name.trim().toLowerCase();

    const profile = await profile_model
      .findOne({ name })
      .select("avatar_public_id video_public_id pdf_public_id ");

    // console.log(profile);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const public_id = [
      profile?.avatar_public_id,
      profile?.pdf_public_id,
      profile?.video_public_id,
    ];

    try {
      for (let i = 0; i < public_id.length; i++) {
        if (public_id[i] && i != 2) {
          const cloudinary_response = await v2.uploader.destroy(public_id[i], {
            timeout: 6000,
          });
          // console.log(cloudinary_response, i);
        } else {
          const cloudinary_response = await v2.uploader.destroy(public_id[i], {
            timeout: 6000,
            resource_type: "video",
          });
          // console.log(cloudinary_response, i);
        }
      }

      const deleted_profile = await profile_model.findOneAndDelete({
        avatar_public_id: profile.avatar_public_id,
      });
      // console.log(deleted_profile);
    } catch (err) {
      // console.log("nested try catch", err);
      return res.status(500).json({
        message: err.message,
      });
    }

    res.status(200).json({
      message: "profile deleted",
    });
  } catch (error) {
    console.error("Error in Deleting profile");
  }
};
export const updateProfile = async (req, res) => {
  let { name } = req?.body;
  if (!name.trim()) {
    return res.status(404).json({
      message: "Name can't be blank",
    });
  }
  name = name.trim().toLowerCase();

  try {
    const profile = await profile_model
      .findOne({
        name,
      })
      .select("avatar_url avatar_public_id");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    if (!req.file || !req.file.path) {
      return req.status(404).json({
        message: "file is not uploaded (file path missing)",
      });
    }
    const filePath = req.file.path;

    if (!filePath) {
      return res.status(404).json({
        message: "file path not found",
      });
    }

    const cloudinary_response = await cloudinary(filePath);

    const newAvatar = {
      url: cloudinary_response.secure_url,
      public_id: cloudinary_response.public_id,
    };

    await v2.uploader.destroy(profile.avatar_public_id);


    profile.avatar_url = newAvatar.url;
    profile.avatar_public_id = newAvatar.public_id;

    await profile.save();

    res.status(200).json({
      message: "avatar updated",
    });
  } catch (error) {
    // console.log("error", error);
    return res.status(500).json({
      error:error.message
    });
  }
};
