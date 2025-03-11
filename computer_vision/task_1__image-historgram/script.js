const imageInput = document.getElementById("imageInput");
const dropZone = document.getElementById("dropZone");
const imageCanvas = document.getElementById("imageCanvas");
const imageCtx = imageCanvas.getContext("2d");
const histogramChartCtx = document.getElementById("histogramChart").getContext("2d");
const urlInput = document.getElementById("urlInput");
const loadUrlBtn = document.getElementById("loadUrlBtn");
const inputContainer = document.getElementById("inputContainer");
const placeholder = document.getElementById("placeholder");
let chartInstance; // Holds Chart.js instance

// Handle file input selection
imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    processFile(file);
  }
});
dropZone.addEventListener("click", () => imageInput.click());
loadUrlBtn.addEventListener("click", () => {
  const url = urlInput.value.trim();
  if (url) {
    processFileUrl(url);
  }
});

// Prevent default drag behaviors on dropZone
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Highlight drop area when item is dragged over it
["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, () => dropZone.classList.add("hover"));
});
// Remove highlight when dragging leaves or drops
["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, () => dropZone.classList.remove("hover"));
});

// Handle file drop into dropZone
dropZone.addEventListener("drop", (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 0) {
    processFile(files[0]);
  }
});

// Function to process an image file
function processFile(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file.");
    return;
  }
  showLoading();
  disableInputs();
  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      // Set the hidden canvas dimensions to match the image
      imageCanvas.width = img.width;
      imageCanvas.height = img.height;
      imageCtx.drawImage(img, 0, 0);

      // Retrieve image data from canvas
      const imageData = imageCtx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      const histogram = new Array(256).fill(0);

      // Convert each pixel to grayscale and update histogram
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        histogram[gray]++;
      }

      hidePlaceholder();
      renderHistogramChart(histogram);
      setTimeout(() => {
        enableInputs();
      }, 1500);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function processFileUrl(url) {
  showLoading();
  disableInputs();

  // Use your proxy endpoint to fetch the image
  const proxyUrl = `https://gtu-lab.netlify.app/.netlify/functions/proxy?url=${encodeURIComponent(url)}`;

  const img = new Image();
  // No need for crossOrigin here because our proxy will serve the image with proper headers.
  img.onload = function () {
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    imageCtx.drawImage(img, 0, 0);
    const imageData = imageCtx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      histogram[gray]++;
    }
    setTimeout(() => {
      renderHistogramChart(histogram);
      enableInputs();
      hidePlaceholder();
    }, 1500);
  };
  img.onerror = function () {
    alert("Failed to load image. Check the URL and CORS policy.");
    enableInputs();
    placeholder.textContent = "Failed to load image.";
  };
  img.src = proxyUrl;
}

// Render histogram using Chart.js
function renderHistogramChart(histogram) {
  // Destroy previous chart if exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create labels for grayscale intensities (0-255)
  const labels = Array.from({ length: 256 }, (_, i) => i);

  chartInstance = new Chart(histogramChartCtx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Pixel Frequency",
          data: histogram,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderColor: "rgba(0, 0, 0, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: "Grayscale Intensity",
          },
          ticks: {
            maxTicksLimit: 16, // Reduces clutter on x-axis
          },
        },
        y: {
          title: {
            display: true,
            text: "Pixel Frequency",
          },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Frequency: ${context.parsed.y}`,
          },
        },
      },
    },
  });
}

function disableInputs() {
  inputContainer.classList.add("disabled");
}

function enableInputs() {
  inputContainer.classList.remove("disabled");
}

// Function to show loading state in placeholder
function showLoading() {
  placeholder.textContent = "Processing image...";
  placeholder.classList.add("loading");
  placeholder.style.display = "block";
}

// Function to hide placeholder after processing
function hidePlaceholder() {
  placeholder.style.display = "none";
}
