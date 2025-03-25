/**
 * Applies Sobel edge detection to the image data
 * @param {ImageData} imageData - The image data to process
 * @returns {ImageData} The processed image data with edges detected
 */
export function applyEdgeDetection(imageData) {
  // Create a copy of the image data to preserve original values
  const originalData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  // Sobel operators
  const sobelX = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ];

  const sobelY = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ];

  // Process each pixel
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0,
        gy = 0;

      // Apply Sobel operators
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const idx = ((y + i) * width + (x + j)) * 4;
          const gray = (originalData[idx] + originalData[idx + 1] + originalData[idx + 2]) / 3;

          gx += gray * sobelX[i + 1][j + 1];
          gy += gray * sobelY[i + 1][j + 1];
        }
      }

      // Calculate gradient magnitude
      const magnitude = Math.sqrt(gx * gx + gy * gy);

      // Normalize to 0-255 range
      const normalized = Math.min(255, Math.round(magnitude));

      // Set the edge value to all channels
      const centerIdx = (y * width + x) * 4;
      imageData.data[centerIdx] = normalized;
      imageData.data[centerIdx + 1] = normalized;
      imageData.data[centerIdx + 2] = normalized;
      // Preserve the alpha channel
      imageData.data[centerIdx + 3] = originalData[centerIdx + 3];
    }
  }

  return imageData;
}
