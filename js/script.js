document.addEventListener('DOMContentLoaded', function() {
    const resizers = document.querySelectorAll('th .resizer');
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
            var newWidth = startWidth + (e.clientX - startX);
            resizerParent.style.width = newWidth + 'px';
            resizerParent.style.minWidth = newWidth + 'px';
            resizerParent.style.maxWidth = newWidth + 'px';
        }

        function stopResize() {
            document.documentElement.removeEventListener('mousemove', doResize);
            document.documentElement.removeEventListener('mouseup', stopResize);
        }
    });
});
