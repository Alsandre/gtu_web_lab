// Import tools
import { grayscaleTool } from "../tools/grayscale.js";
import { histogramTool } from "../tools/histogram.js";
import { averagingTool } from "../tools/averaging.js";

// UI State Management
const state = {
  currentImage: null,
  pipeline: [],
  previews: new Map(),
  activeTool: null,
  tools: {
    grayscale: grayscaleTool,
    histogram: histogramTool,
    averaging: averagingTool,
  },
};

// DOM Elements
const elements = {
  toolsPanel: document.querySelector(".tools-panel"),
  togglePanelBtn: document.querySelector(".toggle-panel-btn"),
  toolsList: document.querySelector(".tools-list"),
  dropZone: document.getElementById("dropZone"),
  imageInput: document.getElementById("imageInput"),
  urlInput: document.getElementById("urlInput"),
  loadUrlBtn: document.getElementById("loadUrlBtn"),
  pipelineSteps: document.querySelector(".pipeline-steps"),
  previewContainer: document.querySelector(".preview-container"),
};

// Event Listeners
function initializeEventListeners() {
  // Toggle tools panel
  elements.togglePanelBtn.addEventListener("click", () => {
    elements.toolsPanel.classList.toggle("collapsed");
  });

  // File upload handling
  elements.dropZone.addEventListener("click", () => {
    elements.imageInput.click();
  });

  elements.dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    elements.dropZone.classList.add("hover");
  });

  elements.dropZone.addEventListener("dragleave", () => {
    elements.dropZone.classList.remove("hover");
  });

  elements.dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    elements.dropZone.classList.remove("hover");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  });

  elements.imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  });

  // URL image loading
  elements.loadUrlBtn.addEventListener("click", () => {
    const url = elements.urlInput.value.trim();
    if (url) {
      loadImageFromUrl(url);
    }
  });
}

// Tool management
function initializeTools() {
  // Group tools by category
  const toolsByCategory = {};
  Object.values(state.tools).forEach((tool) => {
    if (!toolsByCategory[tool.category]) {
      toolsByCategory[tool.category] = [];
    }
    toolsByCategory[tool.category].push(tool);
  });

  // Create tool list HTML
  elements.toolsList.innerHTML = Object.entries(toolsByCategory)
    .map(
      ([category, tools]) => `
      <div class="tool-category">
        <h3>${category}</h3>
        ${tools
          .map(
            (tool) => `
          <div class="tool-item" data-tool="${tool.name}">
            <div class="tool-name">${tool.name}</div>
            <div class="tool-description">${tool.description}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `
    )
    .join("");

  // Add click handlers to tool items
  elements.toolsList.querySelectorAll(".tool-item").forEach((item) => {
    item.addEventListener("click", () => {
      const toolName = item.dataset.tool;
      const tool = Object.values(state.tools).find((t) => t.name === toolName);
      if (tool) {
        addToPipeline(tool);
      }
    });
  });
}

// Image handling
async function handleImageUpload(file) {
  try {
    const image = await createImageFromFile(file);
    state.currentImage = image;
    updatePreviews();
    clearPipeline();
  } catch (error) {
    console.error("Error handling image upload:", error);
    alert("Error loading image. Please try again.");
  }
}

async function loadImageFromUrl(url) {
  try {
    const image = await createImageFromUrl(url);
    state.currentImage = image;
    updatePreviews();
    clearPipeline();
  } catch (error) {
    console.error("Error loading image from URL:", error);
    alert("Error loading image. Please check the URL and try again.");
  }
}

function createImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function createImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// Pipeline management
function addToPipeline(tool) {
  state.pipeline.push(tool);
  updatePipelineDisplay();
  updatePreviews();
}

function removeFromPipeline(index) {
  state.pipeline.splice(index, 1);
  updatePipelineDisplay();
  updatePreviews();
}

function clearPipeline() {
  state.pipeline = [];
  updatePipelineDisplay();
  updatePreviews();
}

function updatePipelineDisplay() {
  elements.pipelineSteps.innerHTML = state.pipeline
    .map(
      (tool, index) => `
        <div class="pipeline-step ${tool === state.activeTool ? "active" : ""}" 
             data-index="${index}">
            ${tool.name}
            <button class="remove-step" data-index="${index}">×</button>
        </div>
    `
    )
    .join("");

  // Add event listeners to pipeline steps
  elements.pipelineSteps.querySelectorAll(".pipeline-step").forEach((step) => {
    step.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-step")) {
        const index = parseInt(e.target.dataset.index);
        removeFromPipeline(index);
      } else {
        const index = parseInt(step.dataset.index);
        state.activeTool = state.pipeline[index];
        updatePipelineDisplay();
      }
    });
  });
}

// Preview management
function updatePreviews() {
  elements.previewContainer.innerHTML = "";

  if (!state.currentImage) {
    elements.previewContainer.innerHTML = '<div class="placeholder">Please upload an image to begin processing.</div>';
    return;
  }

  // Add original image preview
  addPreview("Original Image", state.currentImage);

  // Add processed image previews based on pipeline
  let currentImage = state.currentImage;
  state.pipeline.forEach((tool, index) => {
    currentImage = processImageWithTool(currentImage, tool);
    addPreview(`${tool.name} Result`, currentImage);
  });
}

function addPreview(title, image) {
  const previewItem = document.createElement("div");
  previewItem.className = "preview-item";
  previewItem.innerHTML = `
        <div class="preview-item-header">
            <h3>${title}</h3>
        </div>
        <div class="preview-content">
            <img src="${image.src}" class="thumbnail" alt="${title}">
        </div>
    `;

  // Add click handler for full preview
  previewItem.querySelector(".thumbnail").addEventListener("click", () => {
    showFullPreview(image);
  });

  elements.previewContainer.appendChild(previewItem);
}

function showFullPreview(image) {
  // Implementation for showing full preview
  // This could be a modal or replacing the current preview
  console.log("Show full preview:", image);
}

// Tool processing
function processImageWithTool(image, tool) {
  return tool.apply(image);
}

// Initialize the application
function initialize() {
  initializeEventListeners();
  initializeTools();
  // Load any saved state or configuration
}

// Start the application
initialize();
