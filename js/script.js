var adatok;

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
  loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
}

function load(folderName, pathId) {
  let path = document.getElementById(pathId).innerHTML;
  document.getElementById(pathId).innerHTML = path + folderName + "\\";
  loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
}

// Data loading
function loadData(tbodyId, pathId) {
  let path = document.getElementById(pathId).innerHTML;
  if (path == "<br>") {
    alert("Path is empty!");
    path = "C";
    lemezchange(path, pathId, pathId === "path1" ? "dropdown" : "dropdown1");
  }

  const driv = path[0];
  const tableBody = document.getElementById(tbodyId);
  tableBody.innerHTML = "";
  const pathArray = path.split("\\").filter(Boolean).slice(1);
  let folders = adatok.drives[driv].files;
  let currentFolder;

  for (let i = 0; i < pathArray.length; i++) {
    currentFolder = folders.find((folder) => folder.name === pathArray[i]);
    if (currentFolder && currentFolder.files) {
      folders = currentFolder.files;
    }
  }

  if (pathArray.length === 0) {
    currentFolder = { files: folders };
  }

  if (pathArray.length > 0) {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = "←";
    row.appendChild(nameCell);
    tableBody.appendChild(row);

    row.ondblclick = function () {
      let newPath = path.split("\\").filter(Boolean).slice(0, -1).join("\\");
      document.getElementById(pathId).innerHTML = newPath + "\\";
      loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
    };
  }

  if (currentFolder.files) {
    currentFolder.files.forEach((file) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = file.name;
      row.appendChild(nameCell);

      const extensionCell = document.createElement("td");
      extensionCell.textContent = file.extension;
      row.appendChild(extensionCell);

      const sizeCell = document.createElement("td");
      sizeCell.textContent = file.size;
      row.appendChild(sizeCell);

      const dateCell = document.createElement("td");
      dateCell.textContent = file.date;
      row.appendChild(dateCell);

      row.ondblclick = function () {
        if (file.extension === "folder") {
          load(file.name, pathId);
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
        event.preventDefault();
        loadData(
          div.id === "path1" ? "tbody1" : "tbody2",
          div.id === "path1" ? "path1" : "path2"
        );
      }
    });
  });

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
  createMenu.style.left = posX + "px";
  createMenu.style.top = posY + "px";
}

function closeMenu(menuId) {
  let createFolderMenu = document.getElementById(menuId);
  createFolderMenu.style.display = "none";
}

// Create file or folder
function createAnyFile(pathId, extension) {
  let folderName =
    extension === "folder"
      ? document.getElementById("folderName").value
      : document.getElementById("fileName").value;
  let path = document.getElementById(pathId).innerHTML;

  const driv = path[0];
  const pathArray = path.split("\\").filter(Boolean).slice(1);

  let folders = adatok.drives[driv].files;
  let currentFolder;

  for (let i = 0; i < pathArray.length; i++) {
    currentFolder = folders.find((folder) => folder.name === pathArray[i]);
    if (currentFolder && currentFolder.files) {
      folders = currentFolder.files;
    }
  }

  if (pathArray.length === 0) {
    currentFolder = { files: folders };
  }

  let fileSize =
    extension === "folder" ? "" : Math.floor(Math.random() * 1000) + "mb";
  extension === "folder"
    ? folders.push({
        name: folderName,
        extension: extension,
        size: fileSize,
        date: new Date().toLocaleDateString(),
        files: [],
      })
    : folders.push({
        name: folderName,
        extension: extension,
        size: fileSize,
        date: new Date().toLocaleDateString(),
      });

  loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
}

document.addEventListener("DOMContentLoaded", function () {
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

function modifyFile(fileName, pathId) {
  let path = document.getElementById(pathId).innerHTML;

  const driv = path[0];
  const pathArray = path.split("\\").filter(Boolean).slice(1);

  let folders = adatok.drives[driv].files;
  let currentFolder;

  for (let i = 0; i < pathArray.length; i++) {
    currentFolder = folders.find((folder) => folder.name === pathArray[i]);
    if (currentFolder && currentFolder.files) {
      folders = currentFolder.files;
    }
  }

  if (pathArray.length === 0) {
    currentFolder = { files: folders };
  }

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
  let path = document.getElementById(pathId).innerHTML;
  const driv = path[0];
  const pathArray = path.split("\\").filter(Boolean).slice(1);

  let folders = adatok.drives[driv].files;
  let currentFolder;

  for (let i = 0; i < pathArray.length; i++) {
    currentFolder = folders.find((folder) => folder.name === pathArray[i]);
    if (currentFolder && currentFolder.files) {
      folders = currentFolder.files;
    }
  }

  if (pathArray.length === 0) {
    currentFolder = { files: folders };
  }

  const indexToDelete = folders.findIndex(item => item.name === fileName);

    folders.splice(indexToDelete, 1);
    
    loadData("tbody1", "path1");
    loadData("tbody2", "path2");

}

