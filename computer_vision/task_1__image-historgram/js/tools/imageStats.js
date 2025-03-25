import { createCanvasFromImage, getImageData } from "../utils/imageProcessing.js";
import { calculateImageStats } from "../algorithms/analysis/imageStats.js";

export const imageStatsTool = {
  name: "Image Statistics",
  category: "Analysis",
  description: "Calculates various statistical measures for the image",

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);

    // Calculate image statistics
    const stats = calculateImageStats(imageData);

    // Return both the original image and the statistics data
    return {
      image: image,
      stats: stats,
    };
  },
};
