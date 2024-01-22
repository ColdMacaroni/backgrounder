let canvas;
let stripes;
let image = new Image();
let context;

function bodyLoad() {
    canvas = document.getElementById("main-canvas");
    context = canvas.getContext("2d");
    stripes = document.getElementById("controls");

    // From https://stackoverflow.com/a/38968948
    // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations#droptargets
    // Allow drag and drop image
    canvas.ondragover = canvas.ondragenter = (event) => {
        event.preventDefault();

        event.target.classList.add("dragover");
    };

    canvas.ondragleave =(event) => {
        event.target.classList.remove("dragover");
    }

    canvas.ondrop = (event) => {
        event.target.classList.remove("dragover");
        event.preventDefault();
        let file = event.dataTransfer.files[0];
        loadImage(file);
    };
}

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

/**
 * Redraws the canvas stack: Background -> User Image -> Overlay?
 */
function redrawCanvas() {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
}

/**
 * Meant to be called when an image is reset.
 * For example: Before a new image has loaded.
 */
function disableCanvas() {
    canvas.width = "30%";
}

function imageUploaded(event) {
    loadImage(event.target.files[0]);
}

function loadImage(file) {
    disableCanvas();
    image.src = URL.createObjectURL(file);

    console.log(file.name);
}
