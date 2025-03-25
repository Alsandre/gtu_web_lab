import { createCanvasFromImage, getImageData, createImageFromImageData } from "../utils/imageProcessing.js";
import { applyGaussianBlur } from "../algorithms/filters/gaussianBlur.js";

export const gaussianBlurTool = {
  name: "Gaussian Blur",
  category: "Filters",
  description: "Applies a Gaussian blur filter to smooth the image",

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const processedData = applyGaussianBlur(imageData);
    return createImageFromImageData(processedData);
  },
};
