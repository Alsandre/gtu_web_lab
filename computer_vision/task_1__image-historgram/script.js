const imageInput = document.getElementById("imageInput");
const imageCanvas = document.getElementById("imageCanvas");
const imageCtx = imageCanvas.getContext("2d");
const histogramChartCtx = document.getElementById("histogramChart").getContext("2d");
let chartInstance; // To hold Chart.js instance

imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      // Set the processing canvas dimensions to match the image
      imageCanvas.width = img.width;
      imageCanvas.height = img.height;
      imageCtx.drawImage(img, 0, 0);

      // Retrieve image data from the processing canvas
      const imageData = imageCtx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      const histogram = new Array(256).fill(0);

      // Loop over every pixel (4 values per pixel: R, G, B, A)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Convert RGB to grayscale using the luminosity method
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        histogram[gray]++;
      }

      console.log("Histogram Data:", histogram);
      renderHistogramChart(histogram);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// Function to render the histogram using Chart.js
function renderHistogramChart(histogram) {
  // If a chart instance already exists, destroy it before creating a new one
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create labels for grayscale values (0-255)
  const labels = Array.from({ length: 256 }, (_, i) => i);

  // Create a new Chart.js bar chart
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
            maxTicksLimit: 16, // Adjust to reduce clutter on the x-axis
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
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => `Frequency: ${context.parsed.y}`,
          },
        },
      },
    },
  });
}
