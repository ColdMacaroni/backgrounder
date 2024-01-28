/** @type {HTMLCanvasElement} */
let canvas;

/**
 * @description Used to download the image given by the user
 * @type {HTMLImageElement}
 * */
let image = new Image();

/** @type {HTMLOListElement}*/
let stripes;

/** @type {CanvasRenderingContext2D} */
let context;

/** @type {HTMLElement} */
let backgroundPreview;

/** @type{HTMLDivElement} */
let extraControls;

/** @type{string} */
let selectedBackground = "none";

function bodyLoad() {
    canvas = document.getElementById("main-canvas");
    context = canvas.getContext("2d");
    stripes = document.getElementById("stripes");
    extraControls = document.getElementById("extra-controls");
    backgroundPreview = document.getElementById("background-preview");

    // Start with a square canvas bc it looks better.
    canvas.height = canvas.width;

    // Let user drag and drop
    setupCanvasDrop();

    // Create the clickable grid of previews
    setupBackgroundGrid();

    // When refreshed, the browser might keep an image there. This loads it.
    /** @type {File?} */
    const maybeFile = document.getElementById("image-input").files.item(0);
    if (maybeFile) {
        loadImage(maybeFile);
    }
}

/** Lets the user drag and drop and image into the preview to load it. */
function setupCanvasDrop() {
    // From https://stackoverflow.com/a/38968948
    // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations#droptargets
    // Allow drag and drop image
    canvas.ondragover = canvas.ondragenter = (event) => {
        event.preventDefault();

        event.target.classList.add("dragover");
    };

    canvas.ondragleave = (event) => {
        event.target.classList.remove("dragover");
    };

    canvas.ondrop = (event) => {
        event.preventDefault();
        event.target.classList.remove("dragover");

        let file = event.dataTransfer.files[0];

        // Update input box
        document.getElementById("image-input").files = event.dataTransfer.files;

        loadImage(file);
    };
}

/** Populates the grid with all backgrounds. */
function setupBackgroundGrid() {
    for (let [id, obj] of Object.entries(allDesigns)) {
        // Holds the background and the name
        const previewBlock = document.createElement("button");
        previewBlock.value = id;
        previewBlock.onclick = () => selectBackground(id);
        previewBlock.classList.add("preview-block");

        const newCanvas = document.createElement("canvas");
        previewBlock.appendChild(newCanvas);

        const nameElement = document.createElement("p");
        nameElement.innerText = obj.name;
        previewBlock.appendChild(nameElement);

        backgroundPreview.appendChild(previewBlock);
        obj.button = previewBlock;

        // Use the actual computed width to force it to render as a square
        // From https://stackoverflow.com/a/5321487, Ben J's comment.
        const compWidth = window
            .getComputedStyle(newCanvas)
            .getPropertyValue("width");
        newCanvas.setAttribute("height", compWidth);

        // Make the drawable area a square as well so it's not stretched.
        newCanvas.height = newCanvas.width;

        const newCtx = newCanvas.getContext("2d");
        obj.draw(newCtx);
    }

    // Make it clear which is selected by default.
    allDesigns[selectedBackground].button.classList.add("selected-background");
}
