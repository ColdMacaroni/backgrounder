/**
 * Updates the canvas's width and height with the image's and redraws.
 * Meant to be called after an image is loaded.
 */
function enableCanvas() {
    canvas.width = image.width;
    canvas.height = image.height;

    redrawCanvas();
}
image.onload = enableCanvas;

function saveCanvas() {
    // Adapted from: https://stackoverflow.com/a/58652379
    let downloadLink = document.createElement("a");

    downloadLink.setAttribute(
        "download",
        `backgrounder-${Math.round(Math.random() * 9999)}.png`,
    );

    canvas.toBlob(function (blob) {
        let url = URL.createObjectURL(blob);
        downloadLink.setAttribute("href", url);
        downloadLink.click();
    });
}

/**
 * Redraws the canvas stack: Background -> User Image -> Overlay?
 */
function redrawCanvas() {
    // Removes artifacts from previous backgrounds.
    context.clearRect(0, 0, canvas.width, canvas.height);

    allDesigns[selectedBackground].draw(context);

    context.drawImage(image, 0, 0);
}

/**
 * Meant to be called when an image is reset.
 * For example: Before a new image has loaded.
 */
function disableCanvas() {
    canvas.width = "30%";
}

function selectBackground(newBackground) {
    allDesigns[selectedBackground].button.classList.remove(
        "selected-background",
    );

    selectedBackground = newBackground;

    allDesigns[selectedBackground].button.classList.add("selected-background");
    allDesigns[newBackground].setup();

    // Scroll back up to show the selected option better
    window.scrollTo(0, 0);
    redrawCanvas();
}

function imageUploaded(event) {
    loadImage(event.target.files[0]);
}

function loadImage(file) {
    disableCanvas();
    image.src = URL.createObjectURL(file);
}
