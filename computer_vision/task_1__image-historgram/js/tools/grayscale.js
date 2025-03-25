import { createCanvasFromImage, getImageData, createImageFromImageData } from "../utils/imageProcessing.js";
import { convertToGrayscale } from "../algorithms/color/grayscale.js";

export const grayscaleTool = {
  name: "Grayscale",
  category: "Color",
  description: "Converts the image to grayscale using luminance formula",

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const processedData = convertToGrayscale(imageData);
    return createImageFromImageData(processedData);
  },
};
