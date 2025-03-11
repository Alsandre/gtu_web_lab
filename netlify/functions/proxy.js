// netlify/functions/proxy.js

exports.handler = async function (event, context) {
  // Expect the image URL as a query parameter: ?url=...
  const url = event.queryStringParameters.url;
  if (!url) {
    return {
      statusCode: 400,
      body: "Missing URL parameter",
    };
  }

  try {
    // Fetch the image from the provided URL
    const response = await fetch(url);
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: "Error fetching image",
      };
    }

    // Get the content type (e.g., image/jpeg)
    const contentType = response.headers.get("content-type");
    // Read the response as a buffer (or arrayBuffer)
    const buffer = await response.arrayBuffer();

    // Return the image with appropriate headers including CORS
    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*", // Allows any origin
      },
      // Encode the binary data in base64
      body: Buffer.from(buffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Server error: " + error.toString(),
    };
  }
};
