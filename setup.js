/** Used to keep track of the uploaded image for drawing and posititoning. */
class UserImage {
    constructor() {
        /**
         * Used to download the image given by the user
         * @type {HTMLImageElement}
         * */
        this.img = new Image();
        this.img.onload = enableCanvas;

        /** Horizontal percentage to draw the center of the image at
         * @type {number}
         */
        this.x = 0.5;

        /** Vertical percentage to draw the center of the image at
         * @type {number}
         */
        this.y = 0.5;

        /** Angle of rotation of the image. Clockwise, radians.
         * @type {number}
         */
        this.angle = 0;

        /**
         * @type {Object.<string, HTMLInputElement?>}
         */
        this.inputs = {
            xPosSlider: null,
            yPosSlider: null,
            xPosNumber: null,
            yPosNumber: null,
            rotationSlider: null,
            rotationNumber: null,
        };
    }

    /**
     * Stores the necessary inputs in this.inputs and sets the event handlers.
     */
    setupInputs() {
        // -- Position
        this.inputs.xPosSlider = document.getElementById("x-pos-slider");
        this.inputs.yPosSlider = document.getElementById("y-pos-slider");
        this.inputs.xPosNumber = document.getElementById("x-pos-number");
        this.inputs.yPosNumber = document.getElementById("y-pos-number");

        this.inputs.xPosSlider.oninput = (e) => this.changeX(e.target.value);
        this.inputs.yPosSlider.oninput = (e) => this.changeY(e.target.value);
        this.inputs.xPosNumber.oninput = (e) => {
            if (this.canChangeNumber(e)) {
                this.changeX(e.target.value);
            }
        };
        this.inputs.yPosNumber.oninput = (e) => {
            if (this.canChangeNumber(e)) {
                this.changeY(e.target.value);
            }
        };

        // -- Rotation
        this.inputs.rotationSlider = document.getElementById("rotation-slider");
        this.inputs.rotationNumber = document.getElementById("rotation-number");

        this.inputs.rotationSlider.oninput = (e) =>
            this.changeAngle(e.target.value);
        this.inputs.rotationNumber.oninput = (e) => {
            if (this.canChangeNumber(e)) {
                this.changeAngle(e.target.value);
            }
        };
    }

    /** Makes it so the number textfield doesn't delete the decimal point. */
    canChangeNumber(event) {
        const v = event.target.value;
        return !(
            Number.isNaN(+v) ||
            Number.isNaN(+event.data) ||
            (v.length == 1 && event.data == null)
        );
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        const dX = this.x * canvas.width;
        const dY = this.y * canvas.height;
        ctx.translate(dX, dY);
        ctx.rotate(this.angle);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2);
        ctx.rotate(-this.angle);
        ctx.translate(-dX, -dY);
    }

    /** @param{number} val The angle in *degrees* */
    changeAngle(val) {
        this.angle = val * (Math.PI / 180);

        this.inputs.rotationNumber.value = val;
        this.inputs.rotationSlider.value = val;

        redrawCanvas();
    }

    /** @param {number} val */
    changeX(val) {
        this.x = val;

        this.inputs.xPosNumber.value = val;
        this.inputs.xPosSlider.value = val;

        redrawCanvas();
    }

    /** @param {number} val */
    changeY(val) {
        this.y = val;

        this.inputs.yPosNumber.value = val;
        this.inputs.yPosSlider.value = val;

        redrawCanvas();
    }

    get width() {
        return this.img.width;
    }

    get height() {
        return this.img.height;
    }
}

/** @type{UserImage} */
const userImage = new UserImage();

/** @type {HTMLCanvasElement} */
let canvas;

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
    extraControls = document.getElementById("extra-controls");
    backgroundPreview = document.getElementById("background-preview");

    // Start with a square canvas bc it looks better.
    canvas.height = canvas.width;

    // Let user drag and drop
    setupCanvasDrop();

    // Create the clickable grid of previews
    setupBackgroundGrid();

    // Grab the transformation slider and number inputs, then set their events.
    userImage.setupInputs();

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
