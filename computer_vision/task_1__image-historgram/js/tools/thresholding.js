import { createCanvasFromImage, getImageData, createImageFromImageData } from "../utils/imageProcessing.js";
import { applyThresholding } from "../algorithms/filters/thresholding.js";

export const thresholdingTool = {
  name: "Thresholding",
  category: "Filters",
  description: "Converts the image to binary using a threshold value",

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const processedData = applyThresholding(imageData);
    return createImageFromImageData(processedData);
  },
};
