/**
 * Applies a 3x3 averaging filter to the image data
 * @param {ImageData} imageData - The image data to filter
 * @returns {ImageData} The filtered image data
 */
export function applyAveragingFilter(imageData) {
  // Create a copy of the image data to preserve original values
  const originalData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;

  // Process each pixel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calculate the bounds of the 3x3 box
      const startX = Math.max(0, x - 1);
      const endX = Math.min(width - 1, x + 1);
      const startY = Math.max(0, y - 1);
      const endY = Math.min(height - 1, y + 1);

      // Calculate the number of pixels in the box
      const boxWidth = endX - startX + 1;
      const boxHeight = endY - startY + 1;
      const totalPixels = boxWidth * boxHeight;

      // Initialize sums for each color channel
      let rSum = 0,
        gSum = 0,
        bSum = 0;

      // Sum up all pixel values in the box
      for (let boxY = startY; boxY <= endY; boxY++) {
        for (let boxX = startX; boxX <= endX; boxX++) {
          const idx = (boxY * width + boxX) * 4;
          rSum += originalData[idx];
          gSum += originalData[idx + 1];
          bSum += originalData[idx + 2];
        }
      }

      // Calculate averages
      const rAvg = Math.round(rSum / totalPixels);
      const gAvg = Math.round(gSum / totalPixels);
      const bAvg = Math.round(bSum / totalPixels);

      // Set the averaged values to the center pixel
      const centerIdx = (y * width + x) * 4;
      imageData.data[centerIdx] = rAvg;
      imageData.data[centerIdx + 1] = gAvg;
      imageData.data[centerIdx + 2] = bAvg;
      // Preserve the alpha channel
      imageData.data[centerIdx + 3] = originalData[centerIdx + 3];
    }
  }

  return imageData;
}
