import { createCanvasFromImage, getImageData, createImageFromImageData } from "../utils/imageProcessing.js";
import { applyAveragingFilter } from "../algorithms/filters/averaging.js";

export const averagingTool = {
  name: "Averaging Filter",
  category: "Filters",
  description: "Applies a 3x3 averaging filter to smooth the image",

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const processedData = applyAveragingFilter(imageData);
    return createImageFromImageData(processedData);
  },
};
