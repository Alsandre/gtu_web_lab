/**
 * Calculates color histograms for the image data
 * @param {ImageData} imageData - The image data to process
 * @returns {Object} Object containing histograms for each color channel
 */
export function calculateColorHistograms(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;

  // Initialize histograms for each channel
  const histograms = {
    red: new Array(256).fill(0),
    green: new Array(256).fill(0),
    blue: new Array(256).fill(0),
  };

  // Calculate histograms
  for (let i = 0; i < data.length; i += 4) {
    histograms.red[data[i]]++;
    histograms.green[data[i + 1]]++;
    histograms.blue[data[i + 2]]++;
  }

  // Normalize histograms
  const totalPixels = width * height;
  for (let i = 0; i < 256; i++) {
    histograms.red[i] /= totalPixels;
    histograms.green[i] /= totalPixels;
    histograms.blue[i] /= totalPixels;
  }

  return histograms;
}

/**
 * Calculates cumulative histograms for the image data
 * @param {ImageData} imageData - The image data to process
 * @returns {Object} Object containing cumulative histograms for each color channel
 */
export function calculateCumulativeHistograms(imageData) {
  const histograms = calculateColorHistograms(imageData);
  const cumulative = {
    red: new Array(256).fill(0),
    green: new Array(256).fill(0),
    blue: new Array(256).fill(0),
  };

  // Calculate cumulative histograms
  for (let i = 0; i < 256; i++) {
    cumulative.red[i] = i === 0 ? histograms.red[i] : cumulative.red[i - 1] + histograms.red[i];
    cumulative.green[i] = i === 0 ? histograms.green[i] : cumulative.green[i - 1] + histograms.green[i];
    cumulative.blue[i] = i === 0 ? histograms.blue[i] : cumulative.blue[i - 1] + histograms.blue[i];
  }

  return cumulative;
}
