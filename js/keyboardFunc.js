document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("deleteButton").onclick = deleteclick;
});

function deleteclick() {
    if (Object.keys(selectedFiles).length > 0) {

        for (const [fileName, pathId] of Object.entries(selectedFiles)) {
            console.log(fileName, pathId);
            deleteFile(fileName, pathId);
        }
        
        selectedFiles = {};
        selectedRows.forEach(row => row.style.backgroundColor = "");
        selectedRows = [];
        selectedPaths = null;
    }
    else if (selectedFile) {
        deleteFile(selectedFile.name, selectedPaths);
        selectedFile = null;
        if (selectedRow) {
            selectedRow.style.backgroundColor = "";
            selectedRow = null;
        }
        selectedPaths = null;
    }
    else {
        alert("nincs kivalasztva file");
    }
}

document.addEventListener("keydown", function (pressedKey) {
    if ((pressedKey.key === "Delete" || pressedKey.key === "F8") && (selectedFile || selectedFiles.length > 0)) {
        pressedKey.preventDefault();
        deleteclick();
    }
    if (pressedKey.key === "F7") {
        document.getElementById("createFolderButton").onclick = function folderclick() {
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
            }
            else {
                alert("Nincs kivalasztva ablak");
            }
        }
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
        }
        else {
            alert("Nincs kivalasztva ablak");
        }
    }
    if (pressedKey.key === "F4") {
        document.getElementById("editButton").onclick = function editclick() {
            pressedKey.preventDefault();
            if (!selectedFile) {
                alert("Nincs kivalasztva file");
                return;
            }
            if (selectedFile.extension === "txt" || selectedFile.extension === "html") {
                createMenu(pressedKey.pageX, pressedKey.pageY, "showContent");
                showContent(selectedFile.content, selectedFile.name, selectedFile.extension);

                let saveButton = document.getElementById("saveButton");
                if (saveButton) {
                    saveButton.onclick = function () {
                        modifyTxtContent(selectedFile.name, selectedPaths);
                        closeMenu("showContent");
                    };
                }
            }
            else {
                alert("Ezt nem lehet modoositani");
            }
        }
        pressedKey.preventDefault();
        if (!selectedFile) {
            alert("Nincs kivalasztva file");
            return;
        }
        if (selectedFile.extension === "txt" || selectedFile.extension === "html") {
            createMenu(pressedKey.pageX, pressedKey.pageY, "showContent");
            showContent(selectedFile.content, selectedFile.name, selectedFile.extension);

            let saveButton = document.getElementById("saveButton");
            if (saveButton) {
                saveButton.onclick = function () {
                    modifyTxtContent(selectedFile.name, selectedPaths);
                    closeMenu("showContent");
                };
            }
        }
        else {
            alert("Ezt nem lehet módosítani");
        }
    } if (pressedKey.key === "F3") {
        document.getElementById("viewButton").onclick = function viewclick() {
            pressedKey.preventDefault();
            let edit = document.getElementById("contentDiv");
            if (!selectedFile) {
                alert("Nincs kivalasztva file");
                return;
            }
            if (selectedFile.extension === "png" || selectedFile.extension === "jpg") {
                showImg(selectedFile.content, selectedFile.name, selectedFile.extension);
            }
            else if (selectedFile.extension === "txt" || selectedFile.extension === "html") {
                createMenu(pressedKey.pageX, pressedKey.pageY, "showContent");
                showContent(selectedFile.content, selectedFile.name, selectedFile.extension);
                edit.contentEditable = false;
            }
            else {
                alert("Ezt nem lehet megtekinteni");
            }
        }
        pressedKey.preventDefault();
        let edit = document.getElementById("contentDiv");
        if (!selectedFile) {
            alert("Nincs kivalasztva file");
            return;
        }
        if (selectedFile.extension === "png" || selectedFile.extension === "jpg") {
            showImg(selectedFile.content, selectedFile.name, selectedFile.extension);
        }
        else if (selectedFile.extension === "txt" || selectedFile.extension === "html") {
            createMenu(pressedKey.pageX, pressedKey.pageY, "showContent");
            showContent(selectedFile.content, selectedFile.name, selectedFile.extension);
            edit.contentEditable = false;
        }
        else {
            alert("Ezt nem lehet megtekinteni");
        }
    }
});