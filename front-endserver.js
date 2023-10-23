//requirements
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { Liquid } = require('liquidjs');

//app setup
const app = express();
const upload = multer();
const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './views');
app.set('view engine', 'liquid');

utils = {
  isLandscape: function(image) {
    return image.width >= image.height;
  }
}

const { fromBuffer } = require("pdf2pic");
app.post('/upload-document', upload.any(), (req, res, next) => {
  try {
    //Check file type
    const uploadedPdf = req.files[0];
    if (uploadedPdf.mimetype != 'application/pdf') { return; }

    // Build PDF conversion options
    const options = {
      density: 100,
      format: "jpeg",
      width: 550,
      height: 425
    };

    //Try to convert pdf
    async function convert(){ 
      try {
         pdfImage = await fromBuffer(uploadedPdf.buffer, options)(1, {responseType: "base64"});
         
         // debug output to file
         // const objString = JSON.stringify(pdfImage);
         // fs.writeFileSync('stored-upload.json', objString);
         
         return pdfImage;
      }catch(err){
        next(err);
      }
    }

    //convert and send
    convert().then(newImage => {
      res.json({image: newImage, metadata: {}});
    });
} catch (err) {
    next(err);
  }
});


app.post('/upload-document-test', upload.any(), (req, res, next) => {
  const savedImage = JSON.parse(fs.readFileSync('stored-upload.json'));
  res.json({image: savedImage, metadata: {name: "NFPA1006"}})
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server error');
});

// Spin up a server
app.use(express.static('public'));
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});