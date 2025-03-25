/**
 * Applies contrast adjustment to the image data
 * @param {ImageData} imageData - The image data to process
 * @param {number} factor - The contrast factor (0.5-2.0)
 * @returns {ImageData} The processed image data with adjusted contrast
 */
export function applyContrastAdjustment(imageData, factor = 1.5) {
  // Create a copy of the image data to preserve original values
  const originalData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  // Process each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Apply contrast adjustment to each channel
      for (let c = 0; c < 3; c++) {
        // Convert to 0-1 range
        const pixel = originalData[idx + c] / 255;

        // Apply contrast adjustment
        const adjusted = ((pixel - 0.5) * factor + 0.5) * 255;

        // Clamp to 0-255 range
        imageData.data[idx + c] = Math.max(0, Math.min(255, adjusted));
      }

      // Preserve the alpha channel
      imageData.data[idx + 3] = originalData[idx + 3];
    }
  }

  return imageData;
}
