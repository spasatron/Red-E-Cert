//requirements
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
  isLandscape: function(page) {
    return page.getWidth() >= page.getHeight();
  }
}

//Read input PDFs into base64 OBJ 
const { fromBuffer } = require("pdf2pic");
app.post('/upload', upload.any(), (req, res, next) => {
  try {
    //Filter for PDFs
    const uploadedPdfs = req.files.filter(file => file.mimetype === 'application/pdf');

    // Build PDF conversion options
    let pdfImages = {};
    let converted = Object.keys(uploadedPdfs).length;
    const options = {
      density: 100,
      format: "jpeg",
      width: 650,
      height: 425
    };

    //Loop through PDFs
    uploadedPdfs.forEach(pdf => {
      //Try to convert each pdf
      async function convert(){ 
        try {
           pdfImages[pdf.originalname] = await fromBuffer(pdf.buffer, options)(1, {responseType: "base64"});
        }catch(err){
          next(err)
        }
      }

      //When finished, decrement counter
      convert().then(() => {
        converted -= 1;

        //Send html when all images are done
        if (converted == 0){drawHTML(pdfImages, req.body)};

        // --!-- I would like to rewrite this so that the template renders and the base64 data is sent in
      });
    });

    // Draw html and send
    const drawHTML = (images, form) => { 

      //Header archetype
      const tableHeader = () => {
        let row = `<tr style="border: 5px dashed black">`;
        row += `<th><b>Name:</b> ${form.name}</th>`;
        row += `<th><b>E-mail:</b> <a href="mailto:"${form.email}">${form.email}</a></th>`;
        row += `</tr>`;
        return row;
      }

      //Loop the images to generate tables
      let index = 0;
      let htmlTable = `<table>` + tableHeader();
      Object.keys(images).forEach(imageName => {

        //Add a new cell and either row tag
        if (index % 2 === 0) { htmlTable += `<tr>`; }
        htmlTable += `
          <td class="cert">
            <b style="size: 0.5em;">${imageName}</b>
            <img id="img-${imageName}" src="data:image/jpeg;base64, ${images[imageName].base64}">
            <button type="button" class="edit-button btn btn-primary" data="img-${imageName}" data-toggle="modal" data-target="#crop-modal">Crop Image</button>
          </td>
        `;
        if (index % 2 === 1) { htmlTable += `</tr>`; }

        //Pagebreak every 6 cells
        if ((index % 6 === 5) && (index > 0)) { 
          htmlTable += `
          </table>
          <div class="pagebreak"></div>
          <table>` + tableHeader();
        }

        index++;

      });
      htmlTable += `</table>`;

      //Push with template
      res.render('grid.liquid', {title: 'Combined PDFs', body: htmlTable});
    }


  } catch (err) {
    next(err);
  }
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