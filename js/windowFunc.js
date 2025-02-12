/**
 * Makes an element draggable by its header
 * @param {HTMLElement} elmnt - Element to make draggable
 */
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const header = elmnt.querySelector('.headerDrag');


  if (header) {
    header.style.cursor = 'move';
    header.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
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

// Initialize draggable elements
document.addEventListener("DOMContentLoaded", function () {
  dragElement(document.getElementById("showContent"));
  dragElement(document.getElementById("showContent2"));
});

/**
 * Toggles fullscreen state of a window
 * @param {string} windowId - ID of window to maximize/restore
 */
var fullscreen = false;
function maximizeWindow(windowId) {
  const window = document.getElementById(windowId);

  if (fullscreen) {
    // Restore
    if (windowId === "showContent2") {
      const img = window.querySelector('img');
      if (img) {
        window.style.height = img.naturalHeight + "px";
        window.style.width = img.naturalWidth + "px";
      }
    } else {
      window.style.width = "50%";
      window.style.height = "50vh";
    }

    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    window.style.left = (windowWidth / 2 - window.offsetWidth / 2) + "px";
    window.style.top = (windowHeight / 2 - window.offsetHeight / 2) + "px";
    fullscreen = false;
  } else {
    // Maximize

    window.style.width = "95vw";
    window.style.height = "95vh";
    window.style.left = "2.5vw";
    window.style.top = "2.5vh";
    fullscreen = true;
  }
}

/**
 * Closes a menu with fade animation
 * @param {string} menuId - ID of menu element to close
 */
function closeMenu(menuId) {
  if (fullscreen) {
    fullscreen = false;
  }
  let createFolderMenu = document.getElementById(menuId);
  createFolderMenu.classList.remove('fade-in');

  setTimeout(() => {
    createFolderMenu.style.display = "none";
    if (menuId === 'showContent') {
      document.querySelector('.save').style.display = 'none';
    }
  }, 100);
}