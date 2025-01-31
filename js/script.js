document.addEventListener('DOMContentLoaded', function () {


    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            function populateTable() {
                const folders = data.drives.C.folders;
                const tableBody = document.getElementsByTagName('tbody')[0];
    
                folders.forEach(folder => {
                    const row = document.createElement('tr');
    
                    const nameCell = document.createElement('td');
                    nameCell.textContent = folder.name;
                    row.appendChild(nameCell);
    
                    const extensionCell = document.createElement('td');
                    extensionCell.textContent = folder.extension;
                    row.appendChild(extensionCell);
    
                    const sizeCell = document.createElement('td');
                    sizeCell.textContent = folder.size;
                    row.appendChild(sizeCell);
    
                    const dateCell = document.createElement('td');
                    dateCell.textContent = folder.date;
                    row.appendChild(dateCell);
    
                    tableBody.appendChild(row);
                });
            }
            populateTable();
        })
        .catch(error => console.error('Error fetching JSON:', error));
    


    
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

function lemezchange(lemez, path) {
    let string = ":\\";
    document.getElementById(path).innerHTML = lemez + string;
}

function load(nev) {
    let szoveg = document.getElementById("path").innerHTML;
    document.getElementById("path").innerHTML = szoveg + nev;
    checkfiles();
}
function checkfiles() {

}



