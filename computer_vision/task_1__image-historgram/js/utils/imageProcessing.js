// Utility functions for image processing

/**
 * Creates a canvas element and draws an image on it
 * @param {HTMLImageElement} image - The image to draw
 * @returns {HTMLCanvasElement} The canvas with the image drawn
 */
export function createCanvasFromImage(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  return canvas;
}

/**
 * Gets ImageData from a canvas
 * @param {HTMLCanvasElement} canvas - The canvas to get data from
 * @returns {ImageData} The image data
 */
export function getImageData(canvas) {
  return canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Creates a new image from ImageData
 * @param {ImageData} imageData - The image data to create image from
 * @returns {HTMLImageElement} The new image
 */
export function createImageFromImageData(imageData) {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);

  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
}

/**
 * Creates a copy of ImageData
 * @param {ImageData} imageData - The image data to copy
 * @returns {ImageData} A copy of the image data
 */
export function copyImageData(imageData) {
  return new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
}

/**
 * Creates a histogram from image data
 * @param {ImageData} imageData - The image data to create histogram from
 * @returns {Array<number>} Array of 256 values representing the histogram
 */
export function createHistogram(imageData) {
  const histogram = new Array(256).fill(0);
  const data = imageData.data;

  // Check if image is grayscale by sampling a few pixels
  let isGrayscale = true;
  for (let i = 0; i < Math.min(1000, data.length); i += 4) {
    if (data[i] !== data[i + 1] || data[i + 1] !== data[i + 2]) {
      isGrayscale = false;
      break;
    }
  }

  if (isGrayscale) {
    // For grayscale images, just use the red channel (or any channel since they're all the same)
    for (let i = 0; i < data.length; i += 4) {
      histogram[data[i]]++;
    }
  } else {
    // For color images, calculate average intensity across all channels
    for (let i = 0; i < data.length; i += 4) {
      const avgIntensity = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
      histogram[avgIntensity]++;
    }
  }

  return histogram;
}

/**
 * Creates a histogram chart using Chart.js
 * @param {HTMLCanvasElement} canvas - The canvas to draw the chart on
 * @param {Array<number>} histogram - The histogram data
 */
export function drawHistogramChart(canvas, histogram) {
  const ctx = canvas.getContext("2d");
  const labels = Array.from({ length: 256 }, (_, i) => i);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Pixel Intensity Distribution",
          data: histogram,
          backgroundColor: "rgba(127, 168, 235, 0.5)",
          borderColor: "rgba(127, 168, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Frequency",
          },
        },
        x: {
          title: {
            display: true,
            text: "Intensity",
          },
        },
      },
    },
  });
}
