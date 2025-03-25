import { createCanvasFromImage, getImageData, createImageFromImageData } from "../utils/imageProcessing.js";
import { applySaturationAdjustment } from "../algorithms/filters/saturation.js";

export const saturationTool = {
  name: "Saturation Adjustment",
  category: "Filters",
  description: "Adjusts the color saturation of the image",
  options: {
    factor: {
      type: "range",
      min: -100,
      max: 100,
      default: 0,
      label: "Saturation",
    },
  },

  apply: function (image, options = {}) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const processedData = applySaturationAdjustment(imageData, options.factor);
    return createImageFromImageData(processedData);
  },
};
