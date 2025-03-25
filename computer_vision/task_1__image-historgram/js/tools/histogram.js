import { createCanvasFromImage, getImageData, createHistogram, drawHistogramChart } from "../utils/imageProcessing.js";

export const histogramTool = {
  name: "Histogram",
  category: "Analysis",
  description: "Generates a histogram of pixel intensity distribution",

  apply: function (image) {
    const canvas = createCanvasFromImage(image);
    const imageData = getImageData(canvas);
    const histogram = createHistogram(imageData);

    // Create a new canvas for the histogram chart
    const chartCanvas = document.createElement("canvas");
    chartCanvas.width = 800;
    chartCanvas.height = 400;

    // Draw the histogram chart
    drawHistogramChart(chartCanvas, histogram);

    // Convert the chart canvas to an image
    const chartImage = new Image();
    chartImage.src = chartCanvas.toDataURL();

    return chartImage;
  },
};
