// Get DOM elements
const form = document.getElementById('uploadForm');
const documentUploads = document.getElementById('documentUploads');
const addFileBtn = document.getElementById('addFileBtn');
const resultDiv = document.getElementById('result');
const template = document.getElementById('fileTemplate');
const addBtn = document.getElementById('addInput');


//Add additional PDF uploads
function add_pdf_input(infoTag, toggleable) {
  let input = template.content.cloneNode(true);

  if (!toggleable) {
    let deleteRow = input.getElementById("deleteRow");
    deleteRow.remove();
  }

  var inputLabel = document.createElement("label");
  inputLabel.innerHTML = infoTag;
  input.children[0].prepend(inputLabel);
  documentUploads.appendChild(input);
}

// Track input count
let totalInputs = 0;

// Add input
addBtn.addEventListener('click', () => {
  if (totalInputs >= 10) {
    alert("Limit reached");
    return;
  }
  
  add_pdf_input("Additional PDFs:", true);
  totalInputs++;
});

function removeRow() {
  totalInputs--;
}

window.onload = () => {
  // Generate initial inputs 
  for (totalInputs; totalInputs < 1; totalInputs++) {
    add_pdf_input("PDF for doc #" + totalInputs, false);
  }
}