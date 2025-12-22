import cloudinary from "../config/cloudinary.js";
import { Image } from "../model/image.model.js";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const generatedImageUrl =
      "https://dummyimage.com/512x512/000/fff&text=Promptive+AI";

    const uploadResult = await cloudinary.uploader.upload(generatedImageUrl, {
      folder: "promptive-ai",
    });

    const imageRecord = await Image.create({
      userId: req.user.id,
      prompt,
      imageUrl: uploadResult.secure_url,
    });

    return res.status(201).json({
      success: true,
      image: {
        id: imageRecord._id,
        prompt: imageRecord.prompt,
        imageUrl: imageRecord.imageUrl,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Image generation failed",
    });
  }
};
