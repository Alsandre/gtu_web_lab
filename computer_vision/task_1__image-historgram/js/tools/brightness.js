import { createCanvasFromImage, getImageData, createImageFromImageData } from "../utils/imageProcessing.js";
import { applyBrightnessAdjustment } from "../algorithms/filters/brightness.js";

export const brightnessTool = {
  name: "Brightness Adjustment",
  category: "Filters",
  description: "Adjusts the brightness of the image",

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const processedData = applyBrightnessAdjustment(imageData);
    return createImageFromImageData(processedData);
  },
};
