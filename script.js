// Initialize Quill editor
const quill = new Quill('#editor', {
    theme: 'snow'
  });
  
  // Handle file upload
  document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    if (file.name.endsWith(".docx")) {
      // Read docx files with Mammoth
      const reader = new FileReader();
      reader.onload = function(event) {
        const arrayBuffer = reader.result;
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
          .then(function(result) {
            quill.root.innerHTML = result.value; // Insert HTML into editor
          })
          .catch(function(err) {
            console.error("Mammoth conversion error:", err);
            alert("Failed to load DOCX file.");
          });
      };
      reader.readAsArrayBuffer(file);
  
    } else if (file.type === "text/plain" || file.type === "text/html") {
      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;
        quill.root.innerHTML = content;
      };
      reader.readAsText(file);
    } else {
        alert("Only .docx, .txt, and .html files are supported!");
      }
    });
    
    // Handle download
    document.getElementById('downloadBtn').addEventListener('click', function() {
      const content = document.querySelector('#editor .ql-editor');
      
      const opt = {
        margin:       10,
        filename:     'edited-document.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().from(content).set(opt).save();
    });
  