import { createCanvasFromImage, getImageData, createHistogram } from "../utils/imageProcessing.js";

export const histogramTool = {
  name: "Histogram",
  category: "Analysis",
  description: "Generates a histogram of pixel intensity distribution",
  previewType: "chart", // Special preview type for charts

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const histogram = createHistogram(imageData);

    // Return both the histogram data and the original image
    return {
      type: "chart",
      data: histogram,
      image: image, // Keep the original image for reference
    };
  },
};
