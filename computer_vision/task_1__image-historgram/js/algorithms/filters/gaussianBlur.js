/**
 * Generates a Gaussian kernel for blurring
 * @param {number} size - The size of the kernel (odd number)
 * @param {number} sigma - The standard deviation
 * @returns {number[][]} The Gaussian kernel
 */
function generateGaussianKernel(size, sigma) {
  const kernel = [];
  const center = Math.floor(size / 2);
  let sum = 0;

  for (let i = 0; i < size; i++) {
    kernel[i] = [];
    for (let j = 0; j < size; j++) {
      const x = i - center;
      const y = j - center;
      kernel[i][j] = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      sum += kernel[i][j];
    }
  }

  // Normalize the kernel
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      kernel[i][j] /= sum;
    }
  }

  return kernel;
}

/**
 * Applies Gaussian blur to the image data
 * @param {ImageData} imageData - The image data to process
 * @param {number} kernelSize - The size of the Gaussian kernel (odd number)
 * @param {number} sigma - The standard deviation
 * @returns {ImageData} The processed image data with Gaussian blur applied
 */
export function applyGaussianBlur(imageData, kernelSize = 5, sigma = 1.5) {
  // Create a copy of the image data to preserve original values
  const originalData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  const kernel = generateGaussianKernel(kernelSize, sigma);
  const radius = Math.floor(kernelSize / 2);

  // Process each pixel
  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      let r = 0,
        g = 0,
        b = 0;

      // Apply kernel to each color channel
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[ky + radius][kx + radius];

          r += originalData[idx] * weight;
          g += originalData[idx + 1] * weight;
          b += originalData[idx + 2] * weight;
        }
      }

      // Set the blurred values
      const centerIdx = (y * width + x) * 4;
      imageData.data[centerIdx] = Math.round(r);
      imageData.data[centerIdx + 1] = Math.round(g);
      imageData.data[centerIdx + 2] = Math.round(b);
      // Preserve the alpha channel
      imageData.data[centerIdx + 3] = originalData[centerIdx + 3];
    }
  }

  return imageData;
}
