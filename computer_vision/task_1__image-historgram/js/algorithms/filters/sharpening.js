/**
 * Applies sharpening filter to the image data
 * @param {ImageData} imageData - The image data to process
 * @param {number} factor - The sharpening factor (0 to 2)
 * @returns {ImageData} The processed image data with enhanced details
 */
export function applySharpening(imageData, factor = 1) {
  // Create a copy of the image data to preserve original values
  const originalData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  // Laplacian kernel
  const kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ];

  // Process each pixel
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0,
        g = 0,
        b = 0;

      // Apply kernel to each color channel
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[ky + 1][kx + 1];

          r += originalData[idx] * weight;
          g += originalData[idx + 1] * weight;
          b += originalData[idx + 2] * weight;
        }
      }

      // Apply sharpening factor and clamp to 0-255 range
      const centerIdx = (y * width + x) * 4;
      const centerR = originalData[centerIdx];
      const centerG = originalData[centerIdx + 1];
      const centerB = originalData[centerIdx + 2];

      imageData.data[centerIdx] = Math.max(0, Math.min(255, centerR + (r - centerR) * factor));
      imageData.data[centerIdx + 1] = Math.max(0, Math.min(255, centerG + (g - centerG) * factor));
      imageData.data[centerIdx + 2] = Math.max(0, Math.min(255, centerB + (b - centerB) * factor));

      // Preserve the alpha channel
      imageData.data[centerIdx + 3] = originalData[centerIdx + 3];
    }
  }

  return imageData;
}
