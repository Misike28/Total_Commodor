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

        var fileMethod = "";

        // File creation menu
        var contextMenu = document.getElementById("fileCreationMenu");
        contextMenu.style.display = "block";
        contextMenu.style.left = event.pageX + "px";
        contextMenu.style.top = event.pageY + "px";
  
        // Folder creation button
        let createFolderMen = document.getElementById("createFolder");
        createFolderMen.onclick = function () {
          fileMethod = "CreateFolder";
          document.getElementById("fileEdit-title").innerHTML = "Adja meg a mappa nevét!"
          createMenu(event.pageX, event.pageY);
        };
  
        // File creation button
        let createFileMen = document.getElementById("createFile");
        createFileMen.onclick = function () {
          fileMethod = "CreateFile";
          document.getElementById("fileEdit-title").innerHTML = "Adja meg a file nevét!"
          createMenu(event.pageX, event.pageY);
        };

        document.getElementById("cancel").onclick = function () {
          closeMenu();
        }

        // folyt - egyszerűbb file/folder creation egybe
        document.getElementById("confirm").onclick = function () {

          let name = document.getElementById("fileEditInput").value
          if(name === "") {
            closeMenu();
            return;
          }

          switch(fileMethod){
            case "CreateFolder":
              console.log(name);
              break;
            case "CreateFile":
              
              break;
          }

          closeMenu();
        }
  
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

  function createMenu(posX, posY) {
    let createMenu = document.getElementById("fileEdit");
    createMenu.style.display = "block";
    createMenu.style.left = posX + "px";
    createMenu.style.top = posY + "px";
  }
  
  function closeMenu() {
    let createFolderMenu = document.getElementById("fileEdit");
    createFolderMenu.style.display = "none";
  }