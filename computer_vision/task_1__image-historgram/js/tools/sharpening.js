import { createCanvasFromImage, getImageData, createImageFromImageData } from "../utils/imageProcessing.js";
import { applySharpening } from "../algorithms/filters/sharpening.js";

export const sharpeningTool = {
  name: "Sharpening",
  category: "Filters",
  description: "Enhances image details using the Laplacian operator",
  options: {
    factor: {
      type: "range",
      min: 0,
      max: 2,
      default: 1,
      label: "Sharpness",
    },
  },

  apply: function (image, options = {}) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const processedData = applySharpening(imageData, options.factor);
    return createImageFromImageData(processedData);
  },
};
