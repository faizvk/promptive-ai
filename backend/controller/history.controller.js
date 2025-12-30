import { Image } from "../model/image.model.js";
import { Content } from "../model/content.model.js";

export const getHistory = async (req, res) => {
  try {
    const { type = "image", page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const userId = req.user.id;

    let Model;

    if (type === "image") Model = Image;
    else if (type === "rewrite") Model = Content;
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid history type",
      });
    }

    const items = await Model.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Model.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      items,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("History fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
};

export const deleteHistoryItem = async (req, res) => {
  try {
    const { id, type } = req.params;
    const userId = req.user.id;

    let Model;
    if (type === "image") Model = Image;
    else if (type === "rewrite") Model = Content;
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid history type",
      });
    }

    const item = await Model.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("History delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete item",
    });
  }
};
