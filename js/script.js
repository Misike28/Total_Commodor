document.addEventListener('DOMContentLoaded', function () {

    var datak = {
        "drive": {
            "name": "C",
            "folders": {
                "folder1": {
                    "name": "windows",
                    "extension": "txt",
                    "size": "555 gb",
                    "date": "2069.69.6"
    
                },
                "folder2": {
                    "name": "steam",
                    "extension": "mp5",
                    "size": "23 mb",
                    "date": "2069.69.6"
                },
                "folder3": {
                    "name": "crypto",
                    "extension": "gun",
                    "size": "56 tb",
                    "date": "2069.69.6"
                }
            }
        }
    }

    // Get the table body element 
    const tableBody = document.getElementById('table1').getElementsByTagName('tbody')[0];

    datak.forEach()

    // Create a new row 
    const newRow = tableBody.insertRow();

    // Insert new cells (columns) into the row 
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);

    // Add data to the cells 
    cell1.textContent = datak.drive.folders.folder1.name;  
    cell2.textContent = datak.drive.folders.folder1.extension;        
    cell3.textContent = datak.drive.folders.folder1.size;
    cell4.textContent = datak.drive.folders.folder1.date;    


    const resizers = document.querySelectorAll('th .resizer, .middle .resizer');
    let startX, startWidth, resizerParent;

    resizers.forEach(resizer => {
        resizer.addEventListener('mousedown', initResize);

        function initResize(e) {
            startX = e.clientX;
            resizerParent = resizer.parentElement;
            startWidth = resizerParent.offsetWidth;
            document.documentElement.addEventListener('mousemove', doResize);
            document.documentElement.addEventListener('mouseup', stopResize);
        }

        function doResize(e) {
            const newWidth = startWidth + (e.clientX - startX);
            if (newWidth > 50) {
                resizerParent.style.width = newWidth + 'px';
                resizerParent.style.minWidth = newWidth + 'px';
                resizerParent.style.maxWidth = newWidth + 'px';
            }
        }

        function stopResize() {
            document.documentElement.removeEventListener('mousemove', doResize);
            document.documentElement.removeEventListener('mouseup', stopResize);
        }
    });
});

function showDropdown() {
    document.getElementById("dropdown").classList.toggle("show");
}

function showDropdown1() {
    document.getElementById("dropdown1").classList.toggle("show");
}



