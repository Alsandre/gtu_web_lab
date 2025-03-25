/**
 * Applies thresholding to the image data
 * @param {ImageData} imageData - The image data to process
 * @param {number} threshold - The threshold value (0-255)
 * @returns {ImageData} The processed image data with binary values
 */
export function applyThresholding(imageData, threshold = 128) {
  // Create a copy of the image data to preserve original values
  const originalData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  // Process each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Calculate grayscale value
      const gray = (originalData[idx] + originalData[idx + 1] + originalData[idx + 2]) / 3;

      // Apply threshold
      const binaryValue = gray > threshold ? 255 : 0;

      // Set the binary value to all channels
      imageData.data[idx] = binaryValue;
      imageData.data[idx + 1] = binaryValue;
      imageData.data[idx + 2] = binaryValue;
      // Preserve the alpha channel
      imageData.data[idx + 3] = originalData[idx + 3];
    }
  }

  return imageData;
}
