const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      // Set canvas size to the image dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Extract image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const histogram = new Array(256).fill(0);

      // Convert each pixel to grayscale and update the histogram
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Calculate the grayscale value using the luminosity method
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        histogram[gray]++;
      }

      console.log("Histogram Data:", histogram);
      // Optionally, visualize the histogram here or process it further
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});
