import { createCanvasFromImage, getImageData, createImageFromImageData } from "../utils/imageProcessing.js";
import { applyMedianFilter } from "../algorithms/filters/medianFilter.js";

export const medianFilterTool = {
  name: "Median Filter",
  category: "Filters",
  description: "Applies a median filter to remove noise from the image",

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const processedData = applyMedianFilter(imageData);
    return createImageFromImageData(processedData);
  },
};
