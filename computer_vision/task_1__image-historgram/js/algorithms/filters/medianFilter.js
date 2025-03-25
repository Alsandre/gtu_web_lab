/**
 * Applies median filter to the image data
 * @param {ImageData} imageData - The image data to process
 * @param {number} kernelSize - The size of the kernel (odd number)
 * @returns {ImageData} The processed image data with median filter applied
 */
export function applyMedianFilter(imageData, kernelSize = 3) {
  // Create a copy of the image data to preserve original values
  const originalData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const radius = Math.floor(kernelSize / 2);

  // Process each pixel
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      // Collect values for each channel in the kernel window
      const rValues = [];
      const gValues = [];
      const bValues = [];

      // Gather values from the kernel window
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          rValues.push(originalData[idx]);
          gValues.push(originalData[idx + 1]);
          bValues.push(originalData[idx + 2]);
        }
      }

      // Sort arrays and find median
      rValues.sort((a, b) => a - b);
      gValues.sort((a, b) => a - b);
      bValues.sort((a, b) => a - b);

      const medianIdx = Math.floor(rValues.length / 2);

      // Set the median values
      const centerIdx = (y * width + x) * 4;
      imageData.data[centerIdx] = rValues[medianIdx];
      imageData.data[centerIdx + 1] = gValues[medianIdx];
      imageData.data[centerIdx + 2] = bValues[medianIdx];
      // Preserve the alpha channel
      imageData.data[centerIdx + 3] = originalData[centerIdx + 3];
    }
  }

  return imageData;
}
