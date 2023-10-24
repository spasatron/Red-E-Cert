//---- Legitimate utility functions
function getLastRow(tableBody){
  const rows = tableBody.querySelectorAll('tr');
  return rows[rows.length - 1];
}

function getLastTable(){
  const tables = document.querySelectorAll('tbody');
  return tables[tables.length - 1];
}


//---- Hack helper functions

let pages = 0;
let cells = 0;

var userName = "";
var userEmail = "";
var currentImage = new Image();

//Create new table to put certs into
function addPage() {
  let endOfPage = document.getElementById('end-of-page');
  let template = document.getElementById('page-template');
  let newPage = template.content.cloneNode(true);
  newPage.id = "pg" + (++pages);
  newPage.getElementById('user-name').innerHTML = userName;
  newPage.getElementById('user-email').innerHTML = userEmail;
  newPage.getElementById('user-email').ref += userEmail;
  document.body.insertBefore(newPage, endOfPage);
}

//add a new cert, building as you go
function addCert(image, name) {
  //Add a page per six cells
  if (cells++ % 6 == 0 && cells != 1){ addPage(); }
  const lastPage = getLastTable();

  //Add a row per two cells
  if (cells % 2) { lastPage.appendChild(document.createElement("tr")); }
  const lastRow = getLastRow(lastPage);

  //Add the new cell
  let newCell = document.getElementById('cell-template').content.cloneNode(true);
  newCell.querySelector('img').src = image;
  newCell.getElementById('name').innerHTML = name;
  lastRow.appendChild(newCell);
}

//Pull a BS cert
function addDummyCert() {
  fetch('/upload-document-test', {
      method: 'POST',
      body: new FormData()
    })
      .then(res => res.json())
      .then(data => {
        addCert("data:image/jpeg;base64, " + data.image.base64, data.metadata.name);
      });
}

// Change crop image
function setCropModalCanvas(cert) {
  const cropCanvas = document.getElementById('crop-canvas');
  const ctx = cropCanvas.getContext('2d');

  currentImage.src = cert.querySelector('img').src;
  ctx.drawImage(currentImage, 0, 0);
}

//----Let the circus begin
window.onload = () => {

  //Populate name and email from GET
  const query = window.location.search.substring(1); 
  const pairs = query.split("&");
  var params = {};
  for(var i=0; i<pairs.length; i++) {
    const [name, value] = pairs[i].split('=');
    params[name] = decodeURIComponent(value.replace(/\+/g, " ") || '');
  }

  userName = params.name;
  userEmail = params.email;

  //Build a new page
  addPage();

  //Modal setup
  //--Edit
  const cropCanvas = document.getElementById('crop-canvas');
  cropCanvas.width = 550;
  cropCanvas.height = 425;

  cropCanvas.addEventListener("click", function () {
    const ctx = cropCanvas.getContext('2d');

    // State to track if user is dragging 
    let isDragging = false;
    let startX, startY;

    // Mouse events
    cropCanvas.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.offsetX;
      startY = e.offsetY;
    });

    cropCanvas.addEventListener('mouseup', e => {
      isDragging = false;
      ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);

      // If was dragging, get bounding box
      if (startX !== undefined) {
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;
        console.log({
          x: startX, 
          y: startY,
          width,
          height
        });
        startX = startY = undefined; 
      }
    });

    cropCanvas.addEventListener('mousemove', e => {
      if (!isDragging) return;
      // Draw selection rect
      ctx.drawImage(currentImage, 0, 0); 
      ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
    });
  });

  //--Upload
  const uploadCanvas = document.getElementById('modal-canvas');
  const ctx = uploadCanvas.getContext('2d');
  const canvas = {width: 550, height: 425};

  const fileInput = document.getElementById('file-upload');

  // Upload Button
  const submitBtn = document.getElementById('submit-btn')
  submitBtn.addEventListener('click', () => {

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch('/upload-document-test', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        // Draw image on canvas
        const [width, height] = data.image.size.split('x');
        uploadCanvas.width = width;
        uploadCanvas.height = height;
        
        image = document.getElementById('canvas-src');
        image.src = "data:image/jpeg;base64, " + data.image.base64;
        ctx.drawImage(image, 0, 0);
      });
    
  });


  const saveBtn = document.getElementById('save-btn');
  saveBtn.addEventListener('click', () => {

    //Push data to a new cell
    let image = document.getElementById('canvas-src');
    let name = document.getElementById('cert-name');
    addCert(image.src, name.value);

    //Reset form
    document.getElementById('uploadForm').reset();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}