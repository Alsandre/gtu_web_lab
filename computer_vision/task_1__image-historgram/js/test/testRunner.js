/**
 * Test runner for image processing tools
 */

import { createTestImage, createNoisyTestImage, loadImage, compareImages, createHistogram, calculateStats } from "./testUtils.js";
import { thresholdingTool } from "../tools/thresholding.js";
import { contrastTool } from "../tools/contrast.js";
import { gaussianBlurTool } from "../tools/gaussianBlur.js";
import { medianFilterTool } from "../tools/medianFilter.js";
import { colorHistogramTool } from "../tools/colorHistogram.js";
import { imageStatsTool } from "../tools/imageStats.js";
import { brightnessTool } from "../tools/brightness.js";
import { saturationTool } from "../tools/saturation.js";
import { sharpeningTool } from "../tools/sharpening.js";

/**
 * UI Tests
 */
export const uiTests = {
  /**
   * Test tool panel visibility
   */
  async testToolPanel() {
    const toolPanel = document.querySelector(".tools-panel");
    if (!toolPanel) {
      throw new Error("Tool panel not found");
    }

    // Test initial state
    if (toolPanel.classList.contains("visible")) {
      throw new Error("Tool panel should be hidden initially");
    }

    // Test toggle button
    const toggleButton = document.querySelector(".toggle-tools");
    if (!toggleButton) {
      throw new Error("Toggle button not found");
    }

    toggleButton.click();
    if (!toolPanel.classList.contains("visible")) {
      throw new Error("Tool panel should be visible after toggle");
    }

    toggleButton.click();
    if (toolPanel.classList.contains("visible")) {
      throw new Error("Tool panel should be hidden after second toggle");
    }

    return "Tool panel tests passed";
  },

  /**
   * Test image upload functionality
   */
  async testImageUpload() {
    const dropZone = document.querySelector(".drop-zone");
    const fileInput = document.querySelector('input[type="file"]');

    if (!dropZone || !fileInput) {
      throw new Error("Upload elements not found");
    }

    // Test drag and drop events
    const dragEnterEvent = new DragEvent("dragenter", {
      bubbles: true,
      cancelable: true,
    });
    dropZone.dispatchEvent(dragEnterEvent);

    if (!dropZone.classList.contains("dragover")) {
      throw new Error("Drop zone should show dragover state");
    }

    const dragLeaveEvent = new DragEvent("dragleave", {
      bubbles: true,
      cancelable: true,
    });
    dropZone.dispatchEvent(dragLeaveEvent);

    if (dropZone.classList.contains("dragover")) {
      throw new Error("Drop zone should not show dragover state");
    }

    return "Image upload tests passed";
  },

  /**
   * Test pipeline functionality
   */
  async testPipeline() {
    const pipelineContainer = document.querySelector(".pipeline-container");
    const clearButton = document.querySelector(".clear-pipeline");

    if (!pipelineContainer || !clearButton) {
      throw new Error("Pipeline elements not found");
    }

    // Test adding tools
    const testTool = {
      name: "Test Tool",
      category: "Test",
      description: "A test tool",
    };

    // Simulate adding a tool
    const toolElement = document.createElement("div");
    toolElement.className = "pipeline-step";
    toolElement.textContent = testTool.name;
    pipelineContainer.appendChild(toolElement);

    if (pipelineContainer.children.length !== 1) {
      throw new Error("Tool should be added to pipeline");
    }

    // Test removing tool
    toolElement.remove();
    if (pipelineContainer.children.length !== 0) {
      throw new Error("Tool should be removed from pipeline");
    }

    return "Pipeline tests passed";
  },
};

/**
 * Algorithm Tests
 */
export const algorithmTests = {
  /**
   * Test thresholding algorithm
   */
  async testThresholding() {
    const testImage = await loadImage(createTestImage(100, 100));
    const result = await thresholdingTool.apply(testImage, { threshold: 128 });

    if (!result || result.width !== testImage.width || result.height !== testImage.height) {
      throw new Error("Thresholding failed to produce valid output");
    }

    // Check if output is binary
    const canvas = document.createElement("canvas");
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(result, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 0 && data[i] !== 255) {
        throw new Error("Thresholding failed to produce binary output");
      }
    }

    return "Thresholding tests passed";
  },

  /**
   * Test contrast adjustment
   */
  async testContrast() {
    const testImage = await loadImage(createTestImage(100, 100));
    const result = await contrastTool.apply(testImage, { factor: 1.5 });

    if (!result || result.width !== testImage.width || result.height !== testImage.height) {
      throw new Error("Contrast adjustment failed to produce valid output");
    }

    // Check if contrast was increased
    const canvas = document.createElement("canvas");
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(result, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const stats = calculateStats(imageData);

    // Check if standard deviation increased
    if (stats.red.stdDev <= 0 || stats.green.stdDev <= 0 || stats.blue.stdDev <= 0) {
      throw new Error("Contrast adjustment failed to increase image contrast");
    }

    return "Contrast adjustment tests passed";
  },

  /**
   * Test Gaussian blur
   */
  async testGaussianBlur() {
    const noisyImage = await loadImage(createNoisyTestImage(100, 100, 0.1));
    const result = await gaussianBlurTool.apply(noisyImage, { kernelSize: 3, sigma: 1.5 });

    if (!result || result.width !== noisyImage.width || result.height !== noisyImage.height) {
      throw new Error("Gaussian blur failed to produce valid output");
    }

    // Check if noise was reduced
    const canvas = document.createElement("canvas");
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(result, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const stats = calculateStats(imageData);

    // Check if standard deviation decreased
    if (stats.red.stdDev >= 50 || stats.green.stdDev >= 50 || stats.blue.stdDev >= 50) {
      throw new Error("Gaussian blur failed to reduce noise");
    }

    return "Gaussian blur tests passed";
  },

  /**
   * Test median filter
   */
  async testMedianFilter() {
    const noisyImage = await loadImage(createNoisyTestImage(100, 100, 0.2));
    const result = await medianFilterTool.apply(noisyImage, { kernelSize: 3 });

    if (!result || result.width !== noisyImage.width || result.height !== noisyImage.height) {
      throw new Error("Median filter failed to produce valid output");
    }

    // Check if noise was reduced
    const canvas = document.createElement("canvas");
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(result, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const stats = calculateStats(imageData);

    // Check if standard deviation decreased
    if (stats.red.stdDev >= 70 || stats.green.stdDev >= 70 || stats.blue.stdDev >= 70) {
      throw new Error("Median filter failed to reduce noise");
    }

    return "Median filter tests passed";
  },

  /**
   * Test color histogram
   */
  async testColorHistogram() {
    const testImage = await loadImage(createTestImage(100, 100));
    const result = await colorHistogramTool.apply(testImage);

    if (!result || result.width !== testImage.width || result.height !== testImage.height) {
      throw new Error("Color histogram failed to produce valid output");
    }

    // Check if histogram was created
    const canvas = document.createElement("canvas");
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(result, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const histogram = createHistogram(imageData);

    // Check if histogram data is valid
    for (let channel of ["red", "green", "blue"]) {
      const sum = histogram[channel].reduce((a, b) => a + b, 0);
      if (sum !== canvas.width * canvas.height) {
        throw new Error("Color histogram failed to produce valid histogram data");
      }
    }

    return "Color histogram tests passed";
  },

  /**
   * Test image statistics
   */
  async testImageStats() {
    const testImage = await loadImage(createTestImage(100, 100));
    const result = await imageStatsTool.apply(testImage);

    if (!result || result.width !== testImage.width || result.height !== testImage.height) {
      throw new Error("Image statistics failed to produce valid output");
    }

    // Check if statistics were calculated
    const canvas = document.createElement("canvas");
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(result, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const stats = calculateStats(imageData);

    // Check if statistics are valid
    for (let channel of ["red", "green", "blue"]) {
      if (stats[channel].mean < 0 || stats[channel].mean > 255 || stats[channel].stdDev < 0 || stats[channel].stdDev > 255) {
        throw new Error("Image statistics failed to produce valid statistics");
      }
    }

    return "Image statistics tests passed";
  },

  /**
   * Test brightness adjustment
   */
  async testBrightness() {
    const testImage = await loadImage(createTestImage(100, 100));
    const result = await brightnessTool.apply(testImage, { factor: 1.2 });

    if (!result || result.width !== testImage.width || result.height !== testImage.height) {
      throw new Error("Brightness adjustment failed to produce valid output");
    }

    // Check if brightness was increased
    const canvas = document.createElement("canvas");
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(result, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const stats = calculateStats(imageData);

    // Check if mean increased
    if (stats.red.mean <= 127 || stats.green.mean <= 127 || stats.blue.mean <= 127) {
      throw new Error("Brightness adjustment failed to increase image brightness");
    }

    return "Brightness adjustment tests passed";
  },

  /**
   * Test saturation adjustment
   */
  async testSaturation() {
    const testImage = await loadImage(createTestImage(100, 100));
    const result = await saturationTool.apply(testImage, { factor: 1.5 });

    if (!result || result.width !== testImage.width || result.height !== testImage.height) {
      throw new Error("Saturation adjustment failed to produce valid output");
    }

    // Check if saturation was increased
    const canvas = document.createElement("canvas");
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(result, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const stats = calculateStats(imageData);

    // Check if color channels have different values
    if (Math.abs(stats.red.mean - stats.green.mean) < 10 || Math.abs(stats.green.mean - stats.blue.mean) < 10) {
      throw new Error("Saturation adjustment failed to increase color saturation");
    }

    return "Saturation adjustment tests passed";
  },

  /**
   * Test sharpening
   */
  async testSharpening() {
    const testImage = await loadImage(createTestImage(100, 100));
    const result = await sharpeningTool.apply(testImage, { factor: 1.5 });

    if (!result || result.width !== testImage.width || result.height !== testImage.height) {
      throw new Error("Sharpening failed to produce valid output");
    }

    // Check if edges were enhanced
    const canvas = document.createElement("canvas");
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(result, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const stats = calculateStats(imageData);

    // Check if standard deviation increased
    if (stats.red.stdDev <= 0 || stats.green.stdDev <= 0 || stats.blue.stdDev <= 0) {
      throw new Error("Sharpening failed to enhance image edges");
    }

    return "Sharpening tests passed";
  },
};

/**
 * Run all tests
 */
export async function runAllTests() {
  const results = {
    ui: {},
    algorithms: {},
  };

  // Run UI tests
  for (const [name, test] of Object.entries(uiTests)) {
    try {
      results.ui[name] = await test();
    } catch (error) {
      results.ui[name] = `Failed: ${error.message}`;
    }
  }

  // Run algorithm tests
  for (const [name, test] of Object.entries(algorithmTests)) {
    try {
      results.algorithms[name] = await test();
    } catch (error) {
      results.algorithms[name] = `Failed: ${error.message}`;
    }
  }

  return results;
}
