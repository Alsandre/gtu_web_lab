/**
 * Test utilities for image processing tools
 */

/**
 * Creates a test image with a gradient pattern
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Data URL of the test image
 */
export function createTestImage(width = 100, height = 100) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Create a gradient pattern
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = Math.floor((x / width) * 255);
      const g = Math.floor((y / height) * 255);
      const b = Math.floor(((x + y) / (width + height)) * 255);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  return canvas.toDataURL();
}

/**
 * Creates a noisy test image
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} noiseLevel - Amount of noise (0-1)
 * @returns {string} Data URL of the noisy test image
 */
export function createNoisyTestImage(width = 100, height = 100, noiseLevel = 0.1) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Create base gradient
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = Math.floor((x / width) * 255);
      const g = Math.floor((y / height) * 255);
      const b = Math.floor(((x + y) / (width + height)) * 255);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Add noise
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 2 * noiseLevel * 255;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

/**
 * Loads an image from a URL
 * @param {string} url - Image URL
 * @returns {Promise<HTMLImageElement>} Loaded image
 */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Compares two images for equality
 * @param {HTMLImageElement} img1 - First image
 * @param {HTMLImageElement} img2 - Second image
 * @param {number} tolerance - Maximum allowed difference (0-255)
 * @returns {boolean} True if images are equal within tolerance
 */
export function compareImages(img1, img2, tolerance = 0) {
  const canvas1 = document.createElement("canvas");
  const canvas2 = document.createElement("canvas");
  canvas1.width = img1.width;
  canvas1.height = img1.height;
  canvas2.width = img2.width;
  canvas2.height = img2.height;

  const ctx1 = canvas1.getContext("2d");
  const ctx2 = canvas2.getContext("2d");

  ctx1.drawImage(img1, 0, 0);
  ctx2.drawImage(img2, 0, 0);

  const data1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height).data;
  const data2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height).data;

  if (data1.length !== data2.length) return false;

  for (let i = 0; i < data1.length; i++) {
    if (Math.abs(data1[i] - data2[i]) > tolerance) return false;
  }

  return true;
}

/**
 * Creates a histogram from image data
 * @param {ImageData} imageData - Image data
 * @returns {Object} Histogram data for each channel
 */
export function createHistogram(imageData) {
  const histograms = {
    red: new Array(256).fill(0),
    green: new Array(256).fill(0),
    blue: new Array(256).fill(0),
  };

  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    histograms.red[data[i]]++;
    histograms.green[data[i + 1]]++;
    histograms.blue[data[i + 2]]++;
  }

  return histograms;
}

/**
 * Calculates image statistics
 * @param {ImageData} imageData - Image data
 * @returns {Object} Statistical measures
 */
export function calculateStats(imageData) {
  const data = imageData.data;
  const stats = {
    red: { sum: 0, sumSquared: 0, min: 255, max: 0 },
    green: { sum: 0, sumSquared: 0, min: 255, max: 0 },
    blue: { sum: 0, sumSquared: 0, min: 255, max: 0 },
  };

  for (let i = 0; i < data.length; i += 4) {
    for (let channel = 0; channel < 3; channel++) {
      const value = data[i + channel];
      const channelName = ["red", "green", "blue"][channel];

      stats[channelName].sum += value;
      stats[channelName].sumSquared += value * value;
      stats[channelName].min = Math.min(stats[channelName].min, value);
      stats[channelName].max = Math.max(stats[channelName].max, value);
    }
  }

  const totalPixels = imageData.width * imageData.height;
  for (let channel of ["red", "green", "blue"]) {
    stats[channel].mean = stats[channel].sum / totalPixels;
    stats[channel].variance = stats[channel].sumSquared / totalPixels - stats[channel].mean * stats[channel].mean;
    stats[channel].stdDev = Math.sqrt(stats[channel].variance);
  }

  return stats;
}
