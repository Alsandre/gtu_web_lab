/**
 * Converts image data to grayscale
 * @param {ImageData} imageData - The image data to convert
 * @returns {ImageData} The grayscale image data
 */
export function convertToGrayscale(imageData) {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Calculate grayscale value using luminance formula
    const gray = Math.round(
      0.299 * data[i] + // Red
        0.587 * data[i + 1] + // Green
        0.114 * data[i + 2] // Blue
    );

    // Set all channels to the grayscale value
    data[i] = data[i + 1] = data[i + 2] = gray;
  }

  return imageData;
}
