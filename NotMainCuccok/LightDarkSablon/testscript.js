document.addEventListener("DOMContentLoaded", function () {
    const editableDiv = [
      document.getElementById("left-path"),
      document.getElementById("right-path"),
    ];
    const windows = [
      document.getElementById("window-left"),
      document.getElementById("window-right"),
    ];
  
    // path keyboard event handler
    editableDiv.forEach((div) => {
      div.addEventListener("keypress", function (event) {
        if (event.key == "Enter") {
          event.preventDefault();
          loadData(
            div.id === "left-path" ? "tbody1" : "tbody2",
            div.id === "left-path" ? "left-path" : "right-path"
          );
        }
      });
    });
  
    // right click event handler
    windows.forEach((window) => {
      window.addEventListener("contextmenu", function (event) {
        event.preventDefault();

        // File creation menu
        var contextMenu = document.getElementById("fileCreationMenu");
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
          createAnyFile(window.id === "win1" ? "left-path" : "right-path", "folder");
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
          createAnyFile(window.id === "win1" ? "left-path" : "right-path", extension);
        };
      });
  
      // Close menu
      document.addEventListener("click", function () {
        var contextMenu = document.getElementById("fileCreationMenu");
        contextMenu.style.display = "none";
      });
    });
  });

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