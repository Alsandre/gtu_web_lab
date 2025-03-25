/**
 * Applies brightness adjustment to the image data
 * @param {ImageData} imageData - The image data to process
 * @param {number} factor - The brightness adjustment factor (-100 to 100)
 * @returns {ImageData} The processed image data with adjusted brightness
 */
export function applyBrightnessAdjustment(imageData, factor = 0) {
  // Create a copy of the image data to preserve original values
  const originalData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  // Process each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Apply brightness adjustment to each channel
      for (let c = 0; c < 3; c++) {
        // Adjust brightness and clamp to 0-255 range
        const adjusted = Math.max(0, Math.min(255, originalData[idx + c] + factor));
        imageData.data[idx + c] = adjusted;
      }

      // Preserve the alpha channel
      imageData.data[idx + 3] = originalData[idx + 3];
    }
  }

  return imageData;
}
