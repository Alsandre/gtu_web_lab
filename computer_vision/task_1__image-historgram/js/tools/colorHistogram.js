import { createCanvasFromImage, getImageData } from "../utils/imageProcessing.js";
import { calculateColorHistograms, calculateCumulativeHistograms } from "../algorithms/analysis/colorHistogram.js";

export const colorHistogramTool = {
  name: "Color Histogram",
  category: "Analysis",
  description: "Analyzes the color distribution of the image",

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);

    // Calculate both regular and cumulative histograms
    const histograms = calculateColorHistograms(imageData);
    const cumulativeHistograms = calculateCumulativeHistograms(imageData);

    // Return both the original image and the histogram data
    return {
      image: image,
      histograms: histograms,
      cumulativeHistograms: cumulativeHistograms,
    };
  },
};
