import { Image } from "../model/image.model.js";
import { Content } from "../model/content.model.js";

const VALID_TYPES = ["image", "rewrite"];
const MAX_LIMIT = 50;

const modelFor = (type) => {
  if (type === "image") return Image;
  if (type === "rewrite") return Content;
  return null;
};

export const getHistory = async (req, res) => {
  try {
    const type = req.query.type || "image";

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid history type. Use one of: ${VALID_TYPES.join(", ")}`,
      });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Number(req.query.limit) || 10)
    );
    const skip = (page - 1) * limit;

    const Model = modelFor(type);
    const userId = req.user.id;

    const [items, total] = await Promise.all([
      Model.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Model.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      success: true,
      items,
      pagination: {
        total,
        page,
        limit,
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

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid history type. Use one of: ${VALID_TYPES.join(", ")}`,
      });
    }

    const Model = modelFor(type);

    const item = await Model.findOneAndDelete({ _id: id, userId });

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
