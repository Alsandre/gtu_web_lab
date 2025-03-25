import { createCanvasFromImage, getImageData, createImageFromImageData } from "../utils/imageProcessing.js";
import { applyContrastAdjustment } from "../algorithms/filters/contrast.js";

export const contrastTool = {
  name: "Contrast Adjustment",
  category: "Filters",
  description: "Adjusts the contrast of the image",

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const processedData = applyContrastAdjustment(imageData);
    return createImageFromImageData(processedData);
  },
};
