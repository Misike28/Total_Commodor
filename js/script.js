var adatok;
var lastlemez1 = "C";
var lastlemez2 = "C";

// Data fetching and loading data into tables
document.addEventListener("DOMContentLoaded", async function () {
  await fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      adatok = data;
    });

  loadData("tbody1", "path1");
  loadData("tbody2", "path2");

  tableResizing();
});

// Table resizing
function tableResizing() {
  const resizers = document.querySelectorAll("th .resizer, .middle .resizer");
  let startX, startWidth, resizerParent;

  resizers.forEach((resizer) => {
    resizer.addEventListener("mousedown", initResize);

    function initResize(e) {
      startX = e.clientX;
      resizerParent = resizer.parentElement;
      startWidth = resizerParent.offsetWidth;
      document.documentElement.addEventListener("mousemove", doResize);
      document.documentElement.addEventListener("mouseup", stopResize);
    }

    function doResize(e) {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth > 50) {
        resizerParent.style.width = newWidth + "px";
        resizerParent.style.minWidth = newWidth + "px";
        resizerParent.style.maxWidth = newWidth + "px";
      }
    }

    function stopResize() {
      document.documentElement.removeEventListener("mousemove", doResize);
      document.documentElement.removeEventListener("mouseup", stopResize);
    }
  });
}

// Dropdown menu
function showDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

// Drive change and folder load
function lemezchange(lemez, pathId, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.classList.toggle("show");
  document.getElementById(pathId).innerHTML = lemez + ":\\";
  if (pathId == "path1") {
    lastlemez1 = lemez;
  }
  else {
    lastlemez2 = lemez;
  }

  loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
}

function load(folderName, pathId) {
  let path = document.getElementById(pathId).innerHTML;
  document.getElementById(pathId).innerHTML = path + folderName + "\\";
  loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
}

// Find current folder
function getCurrentFolder(pathId) {
  let path = document.getElementById(pathId).innerHTML;
  const driv = path[0];
  const pathArray = path.split("\\").filter(Boolean).slice(1);

  let currentFolder = { files: adatok.drives[driv].files };

  for (let i = 0; i < pathArray.length; i++) {
<<<<<<< Updated upstream
    const found = currentFolder.files.find((folder) => folder.name === pathArray[i]);
    if (found && found.files) {
      currentFolder = found;
    }
  }


=======
    let talal = false;
      const found = currentFolder.files.find((folder) => folder.name === pathArray[i]);
      if (found && found.files) {
          currentFolder = found;
          talal = true;
      }
      if(talal==false){
        defaultdriver(pathId === "path1" ? "path1" : "path2")
        loadData(
          pathId === "path1" ? "tbody1" : "tbody2",
          pathId === "path1" ? "path1" : "path2"
        );
      }

    }
>>>>>>> Stashed changes
  return currentFolder;
}

// Data loading
function loadData(tbodyId, pathId) {
  let path = document.getElementById(pathId).innerHTML;
  if (path == "<br>") {
    alert("Path is empty!");
    path = lastlemez;
    lemezchange(path, pathId, pathId === "path1" ? "dropdown" : "dropdown1");
  }

  const tableBody = document.getElementById(tbodyId);
  tableBody.innerHTML = "";
  const pathArray = path.split("\\").filter(Boolean).slice(1);
  const currentFolder = getCurrentFolder(pathId);

  if (pathArray.length > 0) {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerHTML = "<i class='fa-solid fa-arrow-left'></i>";
    row.appendChild(nameCell);
    tableBody.appendChild(row);

    row.onclick = function () {
      let newPath = path.split("\\").filter(Boolean).slice(0, -1).join("\\");
      document.getElementById(pathId).innerHTML = newPath + "\\";
      loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
    };
  }

  if (currentFolder.files) {
    currentFolder.files.forEach((file) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      if (file.extension == "folder") {
        nameCell.innerHTML = "<i class='fas fa-folder'></i> " + file.name;
      }
      else if (file.extension == "png") {
        nameCell.innerHTML = "<i class='fa-solid -image'></i> " + "<a href='img/asd.jpg'>"+file.name +"</a>";
      }
      else if (file.extension == "mp4") {
        nameCell.innerHTML = "<i class='fa-solid fa-video'></i> " + file.name;
      }
      else if (file.extension == "mp3") {
        nameCell.innerHTML = "<i class='fa-solid fa-music'></i> " + file.name;
      }
      else if (file.extension == "txt") {
        nameCell.innerHTML = "<i class='fas fa-file-alt'></i> " + file.name;
      }
      else if (file.extension == "html") {
        nameCell.innerHTML = "<i class='fa-solid fa-globe'></i> " + file.name;
      }
      else {
        nameCell.innerHTML = file.name;

      }


      row.appendChild(nameCell);

      const extensionCell = document.createElement("td");
      extensionCell.textContent = file.extension;
      row.appendChild(extensionCell);

      const sizeCell = document.createElement("td");
      if(file.extension=="txt" || file.extension=="html"){
        let hossz = file.content.length;
        let meret = Math.round(hossz/1024*10)/10;
        console.log(meret)
        let meretbyte = "KB"; 
        if(meret>1000){
          meretbyte="MB"
          meret= meret/1000
          Math.round(meret*10)/10
        }
        else if(hossz<100){
          console.log("hal")
          meretbyte = "B"
          meret = hossz;
          Math.round(meret*10)/10
        }
        sizeCell.textContent = meret + meretbyte;
      }
      else{
        sizeCell.textContent = file.size;
      }
      row.appendChild(sizeCell);

      const dateCell = document.createElement("td");
      dateCell.textContent = file.date;
      row.appendChild(dateCell);

      row.ondblclick = function () {
        if (file.extension === "folder") {
          load(file.name, pathId);
        }
        else if (file.extension === "txt" || file.extension === "html") {
          createMenu("50%", "50%", "showContent");
          showContent(file.content, file.name, file.extension);

          let saveButton = document.getElementById("saveButton");
          if (saveButton) {
            saveButton.onclick = function () {
              modifyTxtContent(file.name, pathId);
              closeMenu("showContent");
            };
          }
        }
        else if (file.extension === "mp4" || file.extension === "mp3") {
          alert("Idk how to play this file");
        }
        else if (file.extension === "png" || file.extension === "jpg") {
          createMenu("50%", "50%", "showContent2");
          showImg(file.content, file.name, file.extension);
        }
      };

      row.oncontextmenu = function (event) {
        var contextMenu = document.getElementById("modOptions");
        contextMenu.style.display = "block";
        contextMenu.style.left = event.pageX + "px";
        contextMenu.style.top = event.pageY + "px";

        let createModMenu = document.getElementById("modifyFile");
        createModMenu.onclick = function () {
          createMenu(event.pageX, event.pageY, "modify");
          let modifyButton = document.getElementById("modButton");
          modifyButton.onclick = function () {
            modifyFile(file.name, pathId);
          };
        };

        let createDelMenu = document.getElementById("deleteFile");
        createDelMenu.onclick = function () {
          createMenu(event.pageX, event.pageY, "delete");
          let deleteButton = document.getElementById("delButton");
          deleteButton.onclick = function () {
            deleteFile(file.name, pathId);
          };
        };
      };

      document.addEventListener("click", function () {
        var contextMenu = document.getElementById("modOptions");
        contextMenu.style.display = "none";
      });

      tableBody.appendChild(row);
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const editableDiv = [
    document.getElementById("path1"),
    document.getElementById("path2"),
  ];
  const windows = [
    document.getElementById("win1"),
    document.getElementById("win2"),
  ];

  // path keyboard event handler
  editableDiv.forEach((div) => {
    div.addEventListener("keypress", function (event) {
      if (event.key == "Enter") {
        try {
          event.preventDefault();
          loadData(
            div.id === "path1" ? "tbody1" : "tbody2",
            div.id === "path1" ? "path1" : "path2"
          );
        }
        catch {
          defaultdriver(div.id === "path1" ? "path1" : "path2")
          loadData(
            div.id === "path1" ? "tbody1" : "tbody2",
            div.id === "path1" ? "path1" : "path2"
          );
        }
      }
    });
  });
  function defaultdriver(path) {
    if (path == "path1") {
      document.getElementById(path).innerHTML = lastlemez1 + ":\\"
    }
    else {
      document.getElementById(path).innerHTML = lastlemez2 + ":\\"
    }


  }

  // right click event handler
  windows.forEach((window) => {
    window.addEventListener("contextmenu", function (event) {
      event.preventDefault();

      // File creation menu
      var contextMenu = document.getElementById("options");
      contextMenu.style.display = "block";
      contextMenu.style.left = event.pageX + "px";
      contextMenu.style.top = event.pageY + "px";

      // Folder creation menu
      let createFolderMen = document.getElementById("createFolder");
      createFolderMen.onclick = function () {
        createMenu(event.pageX, event.pageY, "folderCreate");
      };

      // File creation menu
      let createFileMen = document.getElementById("createFile");
      createFileMen.onclick = function () {
        createMenu(event.pageX, event.pageY, "fileCreate");
      };

      // folder creation
      let createFolderS = document.getElementById("create");
      createFolderS.onclick = function () {
        if (document.getElementById("folderName").value === "") {
          alert("A nev nem lehet ures");
          return;
        }
        createAnyFile(window.id === "win1" ? "path1" : "path2", "folder");
      };

      // file creation
      let createFileS = document.getElementById("createFileButton");
      createFileS.onclick = function () {
        let extension = document.getElementById("extension").value;
        let text = document.getElementById("fileName").value;
        if (text === "" && extension === "") {
          alert("Toltsed mar ki a dolgokat pls");
          return;
        }
        createAnyFile(window.id === "win1" ? "path1" : "path2", extension);
      };
    });

    // Close menu
    document.addEventListener("click", function () {
      var contextMenu = document.getElementById("options");
      contextMenu.style.display = "none";
    });
  });
});

//show and hide Create menu
function createMenu(posX, posY, menuId) {
  let createMenu = document.getElementById(menuId);
  createMenu.style.display = "block";

  setTimeout(() => {
    createMenu.classList.add('fade-in');
  }, 5);
  createMenu.style.left = posX + "px";
  createMenu.style.top = posY + "px";
}

function closeMenu(menuId) {
  let createFolderMenu = document.getElementById(menuId);
  createFolderMenu.classList.remove('fade-in');

  setTimeout(() => {
    createFolderMenu.style.display = "none";
    if (menuId === 'showContent') {
      document.querySelector('.save').style.display = 'none';
    }
  }, 100);
}

function showContent(fileContent, fileName, extension) {
  var contentDiv = document.getElementById("contentDiv");
  var openedFile = document.getElementById("openedFileName");

  contentDiv.textContent = fileContent;
  openedFile.textContent = fileName + "." + extension;
}

function showImg(fileContent, fileName, extension) {
  var openedFile = document.getElementById("openedFileName2");

  var image = document.createElement("img");
  var imageParent = document.getElementById("Temp");
  image.src = fileContent;
  imageParent.appendChild(image);

  openedFile.textContent = fileName + "." + extension;
}


// Create file or folder
function createAnyFile(pathId, extension) {
  let folderName =
    extension === "folder"
      ? document.getElementById("folderName").value
      : document.getElementById("fileName").value;

  const currentFolder = getCurrentFolder(pathId);
  let fileSize =
    extension === "folder" ? "" : Math.floor(Math.random() * 1000) + "mb";

  currentFolder.files.push({
    name: folderName,
    extension: extension,
    size: fileSize,
    date: new Date().toLocaleDateString(),
    ...(extension === "folder" ? { files: [] } : { content: "" })
  });

  loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('contentDiv').addEventListener('input', function () {

    document.querySelector('.save').style.display = 'block';
  });

  const tables = [
    document.getElementById("table1"),
    document.getElementById("table2"),
  ];

  tables.forEach((table) => {
    table.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
  });
});

function modifyTxtContent(fileName, pathId) {
  const currentFolder = getCurrentFolder(pathId);

  if (currentFolder.files) {
    currentFolder.files.forEach((file) => {
      if (file.name === fileName) {
        file.content = document.getElementById("contentDiv").textContent;
      }
    });
  }

  loadData("tbody1", "path1");
  loadData("tbody2", "path2");
}

function modifyFile(fileName, pathId) {
  const currentFolder = getCurrentFolder(pathId);

  if (currentFolder.files) {
    currentFolder.files.forEach((file) => {
      if (file.name === fileName) {
        file.name = document.getElementById("modName").value;
      }
    });
  }
  loadData("tbody1", "path1");
  loadData("tbody2", "path2");
}

function deleteFile(fileName, pathId) {
  const currentFolder = getCurrentFolder(pathId);
  const indexToDelete = currentFolder.files.findIndex(item => item.name === fileName);
  currentFolder.files.splice(indexToDelete, 1);

  loadData("tbody1", "path1");
  loadData("tbody2", "path2");
}

// yep ezt en irtam 100% Source: https://www.w3schools.com/howto/howto_js_draggable.asp es valami random stackoverflow thread meg copilot
dragElement(document.getElementById("showContent"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const header = document.getElementById("dragHeader");

  if (header) {
    header.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    if (e.target !== header) return;
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    const newTop = elmnt.offsetTop - pos2;
    const newLeft = elmnt.offsetLeft - pos1;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const elementWidth = elmnt.offsetWidth;
    const elementHeight = elmnt.offsetHeight;


    const padding = 10;
    const maxX = windowWidth - elementWidth - padding;
    const maxY = windowHeight - elementHeight - padding;

    elmnt.style.top = Math.min(Math.max(padding, newTop), maxY) + "px";
    elmnt.style.left = Math.min(Math.max(padding, newLeft), maxX) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  dragElement(document.getElementById("showContent"));
});


dragElement(document.getElementById("showContent2"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const header = document.getElementById("dragHeader2");

  if (header) {
    header.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    if (e.target !== header) return;
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    const newTop = elmnt.offsetTop - pos2;
    const newLeft = elmnt.offsetLeft - pos1;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const elementWidth = elmnt.offsetWidth;
    const elementHeight = elmnt.offsetHeight;


    const padding = 10;
    const maxX = windowWidth - elementWidth - padding;
    const maxY = windowHeight - elementHeight - padding;

    elmnt.style.top = Math.min(Math.max(padding, newTop), maxY) + "px";
    elmnt.style.left = Math.min(Math.max(padding, newLeft), maxX) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  dragElement(document.getElementById("showContent2"));
});

