import { createCanvasFromImage, getImageData, createImageFromImageData } from "../utils/imageProcessing.js";
import { applyEdgeDetection } from "../algorithms/filters/edgeDetection.js";

export const edgeDetectionTool = {
  name: "Edge Detection",
  category: "Filters",
  description: "Detects edges in the image using Sobel operators",

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const processedData = applyEdgeDetection(imageData);
    return createImageFromImageData(processedData);
  },
};
