document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("deleteButton").onclick = deleteclick;
  document.getElementById("createFolderButton").onclick = createClick;
  document.getElementById("editButton").onclick = editclick;
  document.getElementById("viewButton").onclick = viewclick;
});

function deleteclick() {
  if (Object.keys(selectedFiles).length > 0) {
    for (const [fileName, pathId] of Object.entries(selectedFiles)) {
      console.log(fileName, pathId);
      deleteFile(fileName, pathId);
    }

    selectedFiles = {};
    selectedRows.forEach((row) => (row.style.backgroundColor = ""));
    selectedRows = [];
    selectedPaths = null;
  } else if (selectedFile) {
    deleteFile(selectedFile.name, selectedPaths);
    selectedFile = null;
    if (selectedRow) {
      selectedRow.style.backgroundColor = "";
      selectedRow = null;
    }
    selectedPaths = null;
  } else {
    alert("nincs kivalasztva file");
  }
}

function createClick(pressedKey) {
  pressedKey.preventDefault();
  if (selectedWindow) {
    createMenu(pressedKey.pageX, pressedKey.pageY, "folderCreate");
    let createFolderS = document.getElementById("create");
    createFolderS.onclick = function () {
      if (document.getElementById("folderName").value === "") {
        alert("A nev nem lehet ures");
        return;
      }
      createAnyFile(selectedWindow === "win1" ? "path1" : "path2", "folder");
    };
  } else {
    alert("Nincs kivalasztva ablak");
  }
}

function editclick(pressedKey) {
  if (!selectedFile) {
    alert("Nincs kivalasztva file");
    return;
  }
  if (selectedFile.extension === "txt" || selectedFile.extension === "html") {
    createMenu(pressedKey.pageX, pressedKey.pageY, "showContent");
    showContent(
      selectedFile.content,
      selectedFile.name,
      selectedFile.extension
    );

    let saveButton = document.getElementById("saveButton");
    if (saveButton) {
      saveButton.onclick = function () {
        modifyTxtContent(selectedFile.name, selectedPaths);
        closeMenu("showContent");
      };
    }
  } else {
    alert("Ezt nem lehet modoositani");
  }
}

function viewclick(pressedKey) {
  let edit = document.getElementById("contentDiv");
  if (!selectedFile) {
    alert("Nincs kivalasztva file");
    return;
  }
  if (selectedFile.extension === "png" || selectedFile.extension === "jpg") {
    showImg(selectedFile.content, selectedFile.name, selectedFile.extension);
  } else if (
    selectedFile.extension === "txt" ||
    selectedFile.extension === "html"
  ) {
    createMenu(pressedKey.pageX, pressedKey.pageY, "showContent");
    showContent(
      selectedFile.content,
      selectedFile.name,
      selectedFile.extension
    );
    edit.contentEditable = false;
  } else {
    alert("Ezt nem lehet megtekinteni");
  }
}

function copyclick(){
  if (Object.keys(selectedFiles).length > 0) {
    for (const [fileName, pathId] of Object.entries(selectedFiles)) {
      copyFile(fileName,pathId)
    }

    selectedFiles = {};
    selectedRows.forEach((row) => (row.style.backgroundColor = ""));
    selectedRows = [];
    selectedPaths = null;
  } else if (selectedFile) {
    copyFile(selectedFile.name, selectedPaths);
    selectedFile = null;
    if (selectedRow) {
      selectedRow.style.backgroundColor = "";
      selectedRow = null;
    }
    selectedPaths = null;
  } else {
    alert("nincs kivalasztva file");
  }
}

function moveclick(){
  if (Object.keys(selectedFiles).length > 0) {
    for (const [fileName, pathId] of Object.entries(selectedFiles)) {
      moveFile(fileName,pathId)
    }

    selectedFiles = {};
    selectedRows.forEach((row) => (row.style.backgroundColor = ""));
    selectedRows = [];
    selectedPaths = null;
  } else if (selectedFile) {
    moveFile(selectedFile.name, selectedPaths);
    selectedFile = null;
    if (selectedRow) {
      selectedRow.style.backgroundColor = "";
      selectedRow = null;
    }
    selectedPaths = null;
  } else {
    alert("nincs kivalasztva file");
  }
}

document.addEventListener("keydown", function (pressedKey) {
  if (
    (pressedKey.key === "Delete" || pressedKey.key === "F8") &&
    (selectedFile || selectedFiles.length > 0)
  ) {
    pressedKey.preventDefault();
    deleteclick();
  }
  if (pressedKey.key === "F7") {
    pressedKey.preventDefault();
    createClick(pressedKey);
  }
  if (pressedKey.key === "F6") {
    pressedKey.preventDefault();
    if (selectedFile) {
      moveclick(selectedFile.name, selectedPaths);
    } else {
      alert("Válassz már ki egy filet te szerencsétlen");
    }
  }
  if (pressedKey.key === "F5") {
    pressedKey.preventDefault();
    console.log(selectedFile);
    if (selectedFile) {
      copyclick(selectedFile.name, selectedPaths);
    } else {
      alert("Válassz már ki egy filet te szerencsétlen");
    }
  }
  if (pressedKey.key === "F4") {
    pressedKey.preventDefault();
    editclick(pressedKey);
  }
  if (pressedKey.key === "F3") {
    pressedKey.preventDefault();
    viewclick(pressedKey);
  }
});
