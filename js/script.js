/** Global variables for storing file system data and last used drives */
var adatok;
var lastlemez1 = "C";
var lastlemez2 = "C";
var selectedRow = null;
var selectedFile = null;
var selectedPaths = null;
var selectedWindow = null;
var selectedRows = [];
var selectedFiles = {};
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
  tableResizing2();
});

/**
 * Resizes table columns using mouse drag
 * Attaches event listeners to column resizer elements
 */
function tableResizing() {
  const resizers = document.querySelectorAll("th .resizer");
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

function tableResizing2() {
  const resizers = document.querySelectorAll(".window .valami");
  let startX, startWidth, resizerParent;

  resizers.forEach((resizer) => {
    resizer.addEventListener("mousedown", initResize);

    function initResize(e) {
      startX = e.clientX;
      resizerParent = resizer.parentElement;
      pathResize = document.getElementById("leftPath");
      startWidth = resizerParent.offsetWidth;
      document.documentElement.addEventListener("mousemove", doResize);
      document.documentElement.addEventListener("mouseup", stopResize);
    }

    function doResize(e) {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth > 200 && newWidth < 1100) {
        pathResize.style.width = newWidth + "px";
        pathResize.style.minWidth = newWidth + "px";
        pathResize.style.maxWidth = newWidth + "px";
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

/**
 * Toggles visibility of a dropdown menu
 * @param {string} dropdownId - ID of the dropdown element to toggle
 */
function showDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

/**
 * Changes the current drive and updates the path display
 * @param {string} lemez - Drive letter to switch to
 * @param {string} pathId - ID of the path element to update
 * @param {string} dropdownId - ID of the dropdown to toggle
 */
function lemezchange(lemez, pathId, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.classList.toggle("show");
  document.getElementById(pathId).innerHTML = lemez + ":\\";
  if (pathId == "path1") {
    lastlemez1 = lemez;
  } else {
    lastlemez2 = lemez;
  }

  loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
}

/**
 * Loads contents of a folder into view
 * @param {string} folderName - Name of folder to load
 * @param {string} pathId - ID of the path element to update
 */
function load(folderName, pathId) {
  let path = document.getElementById(pathId).innerHTML;
  document.getElementById(pathId).innerHTML = path + folderName + "\\";
  loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
}

/**
 * Finds and returns the current folder object based on path
 * @param {string} pathId - ID of the path element
 * @returns {Object} Current folder object containing files
 */
function getCurrentFolder(pathId) {
  let path = document.getElementById(pathId).innerHTML;
  const driv = path[0];
  const pathArray = path.split("\\").filter(Boolean).slice(1);

  let currentFolder = { files: adatok.drives[driv].files };
  for (let i = 0; i < pathArray.length; i++) {
    let talal = false;
    const found = currentFolder.files.find(
      (folder) => folder.name === pathArray[i]
    );
    if (found && found.files) {
      currentFolder = found;
      talal = true;
    }
    if (talal == false) {
      defaultdriver(pathId === "path1" ? "path1" : "path2");
      loadData(
        pathId === "path1" ? "tbody1" : "tbody2",
        pathId === "path1" ? "path1" : "path2"
      );
    }
  }
  return currentFolder;
}

/**
 * Loads file/folder data into the specified table
 * @param {string} tbodyId - ID of table body to populate
 * @param {string} pathId - ID of path element
 */
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
      } else if (file.extension == "png" || file.extension == "jpg") {
        nameCell.innerHTML = "<i class='fa-solid fa-image'></i> " + file.name;
      } else if (file.extension == "mp4") {
        nameCell.innerHTML = "<i class='fa-solid fa-video'></i> " + file.name;
      } else if (file.extension == "mp3") {
        nameCell.innerHTML = "<i class='fa-solid fa-music'></i> " + file.name;
      } else if (file.extension == "txt") {
        nameCell.innerHTML = "<i class='fas fa-file-alt'></i> " + file.name;
      } else if (file.extension == "html") {
        nameCell.innerHTML = "<i class='fa-solid fa-globe'></i> " + file.name;
      } else if(file.extension=="zip"){
        nameCell.innerHTML = "<i class='fa-solid fa-file-zipper'></i> " + file.name;
      }
      else {
        nameCell.innerHTML = file.name;
      }

      row.appendChild(nameCell);

      const extensionCell = document.createElement("td");
      extensionCell.textContent = file.extension;
      row.appendChild(extensionCell);

      const sizeCell = document.createElement("td");
      if (file.extension == "txt" || file.extension == "html") {
        let hossz = file.content.length;
        let meret = Math.round((hossz / 1024) * 10) / 10;
        let meretbyte = "KB";
        if (meret > 1000) {
          meretbyte = "MB";
          meret = meret / 1000;
          Math.round(meret * 10) / 10;
        } else if (hossz < 100) {
          meretbyte = "B";
          meret = hossz;
          Math.round(meret * 10) / 10;
        }
        sizeCell.textContent = meret + meretbyte;
      } else if (file.extension == "png" || file.extension == "jpg") {
        var openedFile = document.getElementById("openedFileName2");
        var imageParent = document.getElementById("Temp");
        imageParent.innerHTML = "";

        var image = document.createElement("img");
        var filenev = file.name + "." + file.extension;
        image.id = filenev;

        image.src = file.content;
        image.alt = filenev;
        imageParent.appendChild(image);
        openedFile.textContent = filenev;

        const magas = image.naturalWidth;
        const hossz = image.naturalHeight;
        let meret = magas * hossz;
        let meretbyte = "B";

        if (meret > 1000) {
          meretbyte = "KB";
          meret = meret / 1000;
          Math.round(meret * 10) / 10;
        }
        if (meret > 1024) {
          meretbyte = "MB";
          meret = meret / 1024;
          meret = Math.round(meret * 10) / 10;
        }
        meret = Math.round(meret * 10) / 10;
        sizeCell.textContent = meret + meretbyte;
      } else {
        sizeCell.textContent = file.size;
      }
      row.appendChild(sizeCell);

      const dateCell = document.createElement("td");
      dateCell.textContent = file.date;
      row.appendChild(dateCell);

      let controlPressed = false;

      document.addEventListener("keydown", function (pressedKey) {
        if (pressedKey.key === "Control") {
          controlPressed = true;
        }
      });

      document.addEventListener("keyup", function (pressedKey) {
        if (pressedKey.key === "Control") {
          controlPressed = false;
        }
      });

      row.onclick = function () {
        let fileName = row.cells[0].textContent.trim();
        let newWindow = pathId === "path1" ? "win1" : "win2";

        if (selectedWindow !== newWindow) {
          if (selectedWindow) {
            document
              .getElementById(
                selectedWindow == "win1" ? "leftPath" : "rightPath"
              )
              .classList.remove("window-selected");
          }
          document
            .getElementById(newWindow == "win1" ? "leftPath" : "rightPath")
            .classList.add("window-selected");
          selectedWindow = newWindow;
        }

        if (controlPressed) {
          row.style.backgroundColor = "lightblue";
          if (selectedRow) {
            selectedRows.push(selectedRow);
            selectedFiles[selectedRow.cells[0].textContent.trim()] =
              selectedPaths;
            selectedRow = null;
          }
          if (!selectedRows.includes(row)) {
            selectedRows.push(row);
            selectedFiles[fileName] = pathId;
            selectedPaths = pathId;
            console.log(selectedFiles);
          }
        } else {
          selectedRows.forEach((row) => {
            row.style.backgroundColor = "";
          });
          selectedRows = [];

          if (selectedRow == row) {
            selectedRow.style.backgroundColor = "";
            selectedRow = null;
            selectedFile = null;
          } else {
            if (selectedRow) {
              selectedRow.style.backgroundColor = "";
            }
            row.style.backgroundColor = "lightblue";
            selectedRow = row;
            selectedFile = getCurrentFolder(pathId).files.find(
              (folder) => folder.name === fileName
            );
          }
          selectedPaths = pathId;
        }
      };

      row.ondblclick = function () {
        if (file.extension === "folder") {
          load(file.name, pathId);
        } else if (file.extension === "txt" || file.extension === "html") {
          createMenu("50%", "50%", "showContent");
          showContent(file.content, file.name, file.extension);

          let saveButton = document.getElementById("saveButton");
          if (saveButton) {
            saveButton.onclick = function () {
              modifyTxtContent(file.name, pathId);
              closeMenu("showContent");
            };
          }
        } else if (file.extension === "mp4" || file.extension === "mp3") {
          alert("Idk how to play this file");
        } else if (file.extension === "png" || file.extension === "jpg") {
          showImg(file.content, file.name, file.extension);
        }
      };
      row.oncontextmenu = function (event) {
        var contextMenu = document.getElementById("modOptions");
        console.log(row)
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
        let createCopyMenu = document.getElementById("copyFile");
        createCopyMenu.onclick = function () {
          createMenu(event.pageX, event.pageY, "copy");
          let copyButton = document.getElementById("copyButton");
          copyButton.onclick = function () {
            copyFile(file.name, pathId);
          };
        };
        let createMoveMenu = document.getElementById("moveFile");
        createMoveMenu.onclick = function () {
          createMenu(event.pageX, event.pageY, "move");
          let moveButton = document.getElementById("moveButton");
          moveButton.onclick = function () {
            moveFile(file.name, pathId);
          };
        };
        
        if(row.childNodes[1].innerHTML=="folder"){
          document.getElementById("zipFile").style.display="block"
          let createzipMenu = document.getElementById("zipFile");
          createzipMenu.onclick = function () {
            createMenu(event.pageX, event.pageY, "move");
            let moveButton = document.getElementById("moveButton");
            moveButton.onclick = function () {
              zipfile(file.name, pathId);
            };
          };
        }
        else{
          console.log("nem hal")
          document.getElementById("zipFile").style.display="none"
        }

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

  // select current window
  windows.forEach((window) => {
    window.addEventListener("click", function () {
      if (selectedWindow) {
        document
          .getElementById(selectedWindow == "win1" ? "leftPath" : "rightPath")
          .classList.remove("window-selected");
      }
      document
        .getElementById(window.id == "win1" ? "leftPath" : "rightPath")
        .classList.add("window-selected");
      selectedWindow = window.id;
    });
  });
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
        } catch {
          defaultdriver(div.id === "path1" ? "path1" : "path2");
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
      document.getElementById(path).innerHTML = lastlemez1 + ":\\";
    } else {
      document.getElementById(path).innerHTML = lastlemez2 + ":\\";
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
        if (text === "") {
          alert("Add meg a fajl nevet");
          return;
        } else if (extension === "") {
          alert("Add meg a fajl tipusat");
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

/**
 * Creates and displays a menu at specified coordinates
 * @param {number|string} posX - X position or percentage
 * @param {number|string} posY - Y position or percentage
 * @param {string} menuId - ID of menu element to show
 */
function createMenu(posX, posY, menuId) {
  let menuElement = document.getElementById(menuId);
  menuElement.style.display = "block";

  if (menuId === "showContent") {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const menuWidth = menuElement.offsetWidth;
    const menuHeight = menuElement.offsetHeight;

    menuElement.style.left =
      Math.max(0, windowWidth / 2 - menuWidth / 2) + "px";
    menuElement.style.top =
      Math.max(0, windowHeight / 2 - menuHeight / 2) + "px";
  } else {
    menuElement.style.left = posX + "px";
    menuElement.style.top = posY + "px";
  }

  setTimeout(() => {
    menuElement.classList.add("fade-in");
  }, 5);
}

/**
 * Displays text file content in viewer
 * @param {string} fileContent - Content to display
 * @param {string} fileName - Name of file
 * @param {string} extension - File extension
 */
function showContent(fileContent, fileName, extension) {
  var contentDiv = document.getElementById("contentDiv");
  var openedFile = document.getElementById("openedFileName");

  contentDiv.textContent = fileContent;
  openedFile.textContent = fileName + "." + extension;
}

/**
 * Displays image in viewer
 * @param {string} fileContent - Image source/content
 * @param {string} fileName - Name of image file
 * @param {string} extension - Image file extension
 */
function showImg(fileContent, fileName, extension) {
  var openedFile = document.getElementById("openedFileName2");
  var imageParent = document.getElementById("Temp");
  imageParent.innerHTML = "";

  var image = document.createElement("img");
  var filenev = fileName + "." + extension;
  image.id = filenev;

  image.onload = function () {
    const originalWidth = image.naturalWidth;
    const originalHeight = image.naturalHeight;

    createMenuImage("showContent2", originalHeight, originalWidth);
  };

  image.src = fileContent;
  image.alt = filenev;
  imageParent.appendChild(image);
  openedFile.textContent = filenev;
}

/**
 * Creates image viewer menu with proper dimensions
 * @param {string} menuId - Menu element ID
 * @param {number} height - Image height
 * @param {number} width - Image width
 */
function createMenuImage(menuId, height, width) {
  let menuElement = document.getElementById(menuId);
  menuElement.style.display = "block";

  document.getElementById("showContent2").style.height = height + "px";
  document.getElementById("showContent2").style.width = width + "px";

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  menuElement.style.left = windowWidth / 2 - width / 2 + "px";
  menuElement.style.top = windowHeight / 2 - height / 2 + "px";

  setTimeout(() => {
    menuElement.classList.add("fade-in");
  }, 5);
}

/**
 * Creates a new file or folder in the current directory
 * @param {string} pathId - Path element ID
 * @param {string} extension - File extension or "folder"
 */
function createAnyFile(pathId, extension) {
  let folderName =
    extension === "folder"
      ? document.getElementById("folderName").value
      : document.getElementById("fileName").value;

  if (
    getCurrentFolder(pathId).files.find((file) => file.name === folderName) &&
    getCurrentFolder(pathId).files.find((file) => file.extension === extension)
  ) {
    var i =
      getCurrentFolder(pathId).files.filter(
        (file) => file.name === folderName
      ) &&
      getCurrentFolder(pathId).files.filter(
        (file) => file.extension === extension
      );
    console.log(i);
    folderName = folderName + "(" + i.length + ")";
  }

  const currentFolder = getCurrentFolder(pathId);
  let fileSize =
    extension === "folder" ? "" : Math.floor(Math.random() * 1000) + "mb";
  let content = "";
  if (extension === "png" || extension === "jpg") {
    content = "img/" + folderName + "." + extension;
  }
  currentFolder.files.push({
    name: folderName,
    extension: extension,
    size: fileSize,
    date: new Intl.DateTimeFormat("en-CA").format(new Date()),
    ...(extension === "folder" ? { files: [] } : { content: "" }),
    content: content,
  });

  loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("contentDiv").addEventListener("input", function () {
    document.querySelector(".save").style.display = "block";
    document.querySelector(".contentButtons").style.display = "block";
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

/**
 * Updates content of a text file
 * @param {string} fileName - Name of file to modify
 * @param {string} pathId - Path element ID
 */
function modifyTxtContent(fileName, pathId) {
  const currentFolder = getCurrentFolder(pathId);

  if (currentFolder.files) {
    currentFolder.files.forEach((file) => {
      if (file.name === fileName) {
        file.content = document.getElementById("contentDiv").textContent;
        file.date = new Intl.DateTimeFormat("en-CA").format(new Date());
      }
    });
  }

  loadData("tbody1", "path1");
  loadData("tbody2", "path2");
}

/**
 * Renames a file or folder
 * @param {string} fileName - Current name of file
 * @param {string} pathId - Path element ID
 */
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

/**
 * Deletes a file or folder
 * @param {string} fileName - Name of file to delete
 * @param {string} pathId - Path element ID
 */
function deleteFile(fileName, pathId) {
  const currentFolder = getCurrentFolder(pathId);
  const indexToDelete = currentFolder.files.findIndex(
    (item) => item.name === fileName
  );
  currentFolder.files.splice(indexToDelete, 1);

  loadData("tbody1", "path1");
  loadData("tbody2", "path2");
}


function copyFile(fileName, pathId) {
  const currentFolder = getCurrentFolder(pathId);
  const indexToCopy = currentFolder.files.find(
    (item) => item.name === fileName
  );
  let ext = indexToCopy.extension;

  let id = "path1";
  if (pathId == "path1") {
    id = "path2";
  }
  document.getElementById("fileName").value = indexToCopy.name;
  let content;
  if (ext == "folder") {
    content = indexToCopy.files;
  } else {
    content = indexToCopy.content;
  }
  console.log(content);
  CreateCopy(indexToCopy.name, id, ext, content);
}

function CreateCopy(name, pathId, extension, content) {
  let folderName = name;

  if (
    getCurrentFolder(pathId).files.find((file) => file.name === folderName) &&
    getCurrentFolder(pathId).files.find((file) => file.extension === extension)
  ) {
    let justName = name.split(" ");
    justName = justName.splice(0, justName.length).join(" ");
    console.log(justName);
    var i = getCurrentFolder(pathId)
      .files.filter((file) => file.name.includes(justName))
      .filter((file) => file.extension === extension);
    folderName = justName + " (" + i.length + ")";
  }

  const currentFolder = getCurrentFolder(pathId);
  let fileSize =
    extension === "folder" ? "" : Math.floor(Math.random() * 1000) + "mb";

  currentFolder.files.push({
    name: folderName,
    extension: extension,
    size: fileSize,
    date: new Intl.DateTimeFormat("en-CA").format(new Date()),
    ...(extension === "folder" ? { files: content } : { content: content }),
  });
  loadData(pathId === "path1" ? "tbody1" : "tbody2", pathId);
}

function moveFile(fileName, pathId) {
  const currentFolder = getCurrentFolder(pathId);
  const indexToCopy = currentFolder.files.find(
    (item) => item.name === fileName
  );
  let ext = indexToCopy.extension;

  let id = "path1";
  if (pathId == "path1") {
    id = "path2";
  }
  document.getElementById("fileName").value = indexToCopy.name;
  let content;
  if (ext == "folder") {
    content = indexToCopy.files;
  } else {
    content = indexToCopy.content;
  }
  console.log(content);
  CreateCopy(indexToCopy.name, id, ext, content);
  const indexToDelete = currentFolder.files.findIndex(
    (item) => item.name === fileName
  );
  currentFolder.files.splice(indexToDelete, 1);
  loadData("tbody1", "path1");
  loadData("tbody2", "path2");
}

function zipfile(fileName, pathId){
  const currentFolder = getCurrentFolder(pathId);
  const indexToCopy = currentFolder.files.find(
    (item) => item.name === fileName
  );
  let ext = "zip";


  
  document.getElementById("fileName").value = indexToCopy.name;
  let content;
  if (ext == "folder") {
    content = indexToCopy.files;
  } else {
    content = indexToCopy.content;
  }
  console.log(content);
  CreateCopy(indexToCopy.name, pathId, ext, content);
}


