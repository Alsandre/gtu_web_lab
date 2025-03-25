/**
 * Calculates statistical measures for the image data
 * @param {ImageData} imageData - The image data to process
 * @returns {Object} Object containing various statistical measures
 */
export function calculateImageStats(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const totalPixels = width * height;

  // Initialize accumulators for each channel
  const stats = {
    red: { sum: 0, sumSquared: 0, min: 255, max: 0 },
    green: { sum: 0, sumSquared: 0, min: 255, max: 0 },
    blue: { sum: 0, sumSquared: 0, min: 255, max: 0 },
  };

  // Calculate sums, min, and max for each channel
  for (let i = 0; i < data.length; i += 4) {
    for (let channel = 0; channel < 3; channel++) {
      const value = data[i + channel];
      const channelName = ["red", "green", "blue"][channel];

      stats[channelName].sum += value;
      stats[channelName].sumSquared += value * value;
      stats[channelName].min = Math.min(stats[channelName].min, value);
      stats[channelName].max = Math.max(stats[channelName].max, value);
    }
  }

  // Calculate mean, variance, and standard deviation for each channel
  for (let channel of ["red", "green", "blue"]) {
    const mean = stats[channel].sum / totalPixels;
    const variance = stats[channel].sumSquared / totalPixels - mean * mean;
    const stdDev = Math.sqrt(variance);

    stats[channel].mean = mean;
    stats[channel].variance = variance;
    stats[channel].stdDev = stdDev;
  }

  // Calculate overall image statistics
  stats.overall = {
    brightness: (stats.red.mean + stats.green.mean + stats.blue.mean) / 3,
    contrast: (stats.red.stdDev + stats.green.stdDev + stats.blue.stdDev) / 3,
    dynamicRange: Math.max(stats.red.max - stats.red.min, stats.green.max - stats.green.min, stats.blue.max - stats.blue.min),
  };

  return stats;
}
