/**
 * Applies saturation adjustment to the image data
 * @param {ImageData} imageData - The image data to process
 * @param {number} factor - The saturation adjustment factor (-100 to 100)
 * @returns {ImageData} The processed image data with adjusted saturation
 */
export function applySaturationAdjustment(imageData, factor = 0) {
  // Create a copy of the image data to preserve original values
  const originalData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  // Convert factor to multiplier (0 to 2)
  const multiplier = 1 + factor / 100;

  // Process each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Get RGB values
      const r = originalData[idx];
      const g = originalData[idx + 1];
      const b = originalData[idx + 2];

      // Calculate grayscale value
      const gray = (r + g + b) / 3;

      // Apply saturation adjustment
      imageData.data[idx] = Math.max(0, Math.min(255, gray + (r - gray) * multiplier));
      imageData.data[idx + 1] = Math.max(0, Math.min(255, gray + (g - gray) * multiplier));
      imageData.data[idx + 2] = Math.max(0, Math.min(255, gray + (b - gray) * multiplier));

      // Preserve the alpha channel
      imageData.data[idx + 3] = originalData[idx + 3];
    }
  }

  return imageData;
}
