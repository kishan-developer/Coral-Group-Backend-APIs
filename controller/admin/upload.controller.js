
// Upload Image
const uploadImage = (req, res) => {
  const productName = req.body.name || 'unknown';
  const images = req.files?.files;

  if (!images) {
      return res.status(400).json({
          success: false,
          message: "Please upload at least one image",
      });
  }

  const imageList = Array.isArray(images) ? images : [images];
  
  // This controller seems to be a placeholder or for local uploads.
  // Standardized on returning local-style paths for now.
  const fileUrls = imageList.map(file => ({
    filename: file.name,
    path: `/uploads/${file.name}`
  }));


  res.json({
    message: `Uploaded ${fileUrls.length} image(s) for "${productName}"`,
    images: fileUrls
  });
};

module.exports = { uploadImage };
