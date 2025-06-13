import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (tempLink) => {
  try {
    const response = await cloudinary.uploader.upload(tempLink, {
      folder: "profile_data",
      resource_type: "auto",
      timeout: 6000,
    });
    fs.unlinkSync(tempLink);

    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(tempLink);
  }
};

// export const deleteFromCloudinary = async(pub_id) => {

// }

export const deleteBrochure = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Brochure ID.",
      });
    }

    // Find Brochure first to get Cloudinary public_id
    const Brochure = await BrochuresModel.findById(id);
    console.log("Brochure ", Brochure);

    if (!Brochure) {
      return res.status(404).json({
        success: false,
        message: "Brochure not found.",
      });
    }

    // Delete image from Cloudinary
    if (Brochure.publicId) {
      try {
        const deleteBrochure = await cloudinary.uploader.destroy(
          Brochure.publicId
        );
        console.log("deleteBrochure ", deleteBrochure);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // If image deletion fails, continue with Brochure deletion
      }
    }

    // Delete Brochure from DB
    const deletedBrochure = await BrochuresModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Brochure deleted successfully.",
      data: deletedBrochure,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting Brochure.",
      error: error.message,
    });
  }
};

export default uploadOnCloudinary;
