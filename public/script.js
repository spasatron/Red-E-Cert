// -- Template handling
function clearPages(){
  const tables = document.querySelectorAll('table');
  tables.forEach(table => table.remove() );
}

function getLastRow(tableBody){
  const rows = tableBody.querySelectorAll('tr');
  return rows[rows.length - 1];
}

function getLastTable(){
  const tables = document.querySelectorAll('tbody');
  return tables[tables.length - 1];
}

function addPage() {
  let endOfPage = document.getElementById('end-of-page');
  let template = document.getElementById('page-template');
  let newPage = template.content.cloneNode(true);
  document.body.insertBefore(newPage, endOfPage);
}

function renderCert(cert) {
  let template = document.getElementById('cell-template');
  let newCell = template.content.cloneNode(true);
  newCell.getElementById('name').innerHTML = cert.id;
  newCell.querySelectorAll('buttons').forEach(button =>
    button.value = [cert.id, button.value]);
  newCell.getElementById('info').innerHTML = cert.metadata;
  newCell.getElementById('display-img').src = cert.image;
  return newCell;
}

function renderAll(certs) {
  clearPages();
  addPage();

  let cells = 0;

  for (var i = 0; i < certs.length; i++) {

    //Add a page per six cells, new row per two
    if (cells++ % 6 == 0 && cells != 1){ addPage(); }
    const lastPage = getLastTable();

    if (cells % 2) { lastPage.appendChild(document.createElement("tr")); }
    const lastRow = getLastRow(lastPage);

    //Add the new cell
    lastRow.appendChild(renderCert(certs[i]));
  }
}


// -- Edit Modal
const cropCanvas = document.getElementById('crop-canvas');
const ctx = cropCanvas.getContext('2d');
cropCanvas.width = 550;
cropCanvas.height = 425;

var currentImage = new Image();
function setCropModalCanvas(certWrapper) {
  currentImage.src = certWrapper.querySelector('img').src;
  ctx.drawImage(currentImage, 0, 0);
}

//Click-and-drag
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