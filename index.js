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


class Background {
    /**
     * @name {string} name The pretty name of the background
     * @param {function(): void} setup The function called once when this is selected.
     * @param {function(CanvasRenderingContext2D): void} draw The function called when redrawing.
     */
    constructor(name, setup, draw) {
        this.name = name;
        this.setup = setup;
        this.draw = draw;

        /**  The button that showcases this background.
         * @type {HTMLButtonElement} */
        this.button = undefined;
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Array<string>} stripes Array of ctx.fillStyle values.
 */
function drawStripes(ctx, stripes) {
    let stripeHeight = canvas.height / stripes.length;
    for (let i = 0; i < stripes.length; i++) {
        console.log(stripes[i]);
        ctx.fillStyle = stripes[i];

        // Flooring avoids some weird aliasing artifacts.
        ctx.fillRect(
            0,
            Math.floor(stripeHeight * i),
            canvas.width,
            stripeHeight,
        );
    }
}

/**
 * Convenience higher order function that returns a call to drawStripes
 * @param {Array<string>} stripes Array of ctx.fillStyle values.
 */
function drawStripesFunc(stripes) {
    return (ctx) => {
        drawStripes(ctx, stripes);
    };
}

function resetControls() {
    extraControls.innerHTML = "";
}

/** All backgrounds available by default.
 * @type {Object.<string, Background>}
 */
let allDesigns = {
    none: new Background("None", resetControls, (ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }),

    "custom-image": new Background( //{{{
        "Custom Image",
            () => {
                if (!this["backgroundInput"]){
                    // If the background input doesn't exist then this probably doesn't either.
                    const backgroundImage = new Image();

                    const backgroundInput = document.createElement("input");
                    backgroundInput.type = "file";
                    backgroundInput.id = "background-image-input";
                    backgroundInput.name = "background";
                    backgroundInput.onchange = (event) => {
                        backgroundImage.src = URL.createObjectURL(event.target.files[0]);
                        redrawCanvas();
                        setTimeout(redrawCanvas, 500);
                    };

                    backgroundInput.accept = "image/png, image/jpeg"
                    this.backgroundInput = backgroundInput;
                    this.backgroundImage = backgroundImage;
                }

                extraControls.appendChild(this.backgroundInput);
            },
            (ctx) => {
                const bgfile = this.backgroundImage;
                if (!bgfile) {
                    ctx.fillStyle = "#ff00dc";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    ctx.fillStyle = "black";
                    ctx.fillRect(
                        canvas.width / 2,
                        0,
                        canvas.width / 2,
                        canvas.height / 2,
                    );
                    ctx.fillRect(
                        0,
                        canvas.height / 2,
                        canvas.width / 2,
                        canvas.height / 2,
                    );
                } else {
                    ctx.drawImage(bgfile, 0, 0, canvas.width, canvas.height);
                }
            },
    ), //}}}

    "custom-javascript": new Background( //{{{
        "Custom JavaScript",
        resetControls,
        (ctx) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.ellipse(
                canvas.width / 4,
                canvas.height / 5,
                canvas.width / 10,
                canvas.height / 10,
                0,
                0,
                2 * Math.PI,
            );
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(
                (canvas.width * 3) / 4,
                canvas.height / 5,
                canvas.width / 10,
                canvas.height / 10,
                0,
                0,
                2 * Math.PI,
            );
            ctx.fill();

            ctx.lineWidth = canvas.width / 30;
            ctx.beginPath();
            ctx.ellipse(
                canvas.width / 2,
                (canvas.height * 3) / 4,
                canvas.width / 4,
                canvas.height / 4,
                0,
                Math.PI,
                0,
            );
            ctx.stroke();
        },
    ), //}}}

    rainbow: new Background(
        "Rainbow",
        resetControls,
        drawStripesFunc([
            "#e60000",
            "#ff8e00",
            "#ffef00",
            "#00821b",
            "#004bff",
            "#780089",
        ]),
    ),

    "progress-pride-ratio": new Background(
        "Progress Pride (Ratio)",
        resetControls,
        (ctx) => {
            // Background rainbow
            drawStripes(ctx, [
                "#e60000",
                "#ff8e00",
                "#ffef00",
                "#00821b",
                "#004bff",
                "#780089",
            ]);

            // Ratios taken from svg version of flag
            // Black stripe
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width * 0.16, 0);
            ctx.lineTo(canvas.width * 0.4773, canvas.height / 2);
            ctx.lineTo(canvas.width * 0.16, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Brown stripe
            ctx.fillStyle = "#613915";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width * 0.08, 0);
            ctx.lineTo(canvas.width * 0.3973, canvas.height / 2);
            ctx.lineTo(canvas.width * 0.08, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Light blue stripe
            ctx.fillStyle = "#74d7ee";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width * 0.3173, canvas.height / 2);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Light pink stripe
            ctx.fillStyle = "#ffafc8";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width * -0.08, 0);
            ctx.lineTo(canvas.width * 0.2373, canvas.height / 2);
            ctx.lineTo(canvas.width * -0.08, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // White stripe
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width * -0.16, 0);
            ctx.lineTo(canvas.width * 0.1573, canvas.height / 2);
            ctx.lineTo(canvas.width * -0.16, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();
        },
    ),

    "progress-pride-angle": new Background(
        "Progress Pride (Angle)",
        resetControls,
        (ctx) => {
            // Background rainbow
            drawStripes(ctx, [
                "#e60000",
                "#ff8e00",
                "#ffef00",
                "#00821b",
                "#004bff",
                "#780089",
            ]);

            const chevronAngle = 0.7896347613;
            const chevronWidth = canvas.width * 0.08;

            // Ratios taken from svg version of flag
            // Black stripe
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(chevronWidth * 2, 0);
            ctx.lineTo(
                chevronWidth * 2 + canvas.height / 2 / Math.tan(chevronAngle),
                canvas.height / 2,
            );
            ctx.lineTo(chevronWidth * 2, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Brown stripe
            ctx.fillStyle = "#613915";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(chevronWidth, 0);
            ctx.lineTo(
                chevronWidth + canvas.height / 2 / Math.tan(chevronAngle),
                canvas.height / 2,
            );
            ctx.lineTo(chevronWidth, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Light blue stripe
            ctx.fillStyle = "#74d7ee";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
                canvas.height / 2 / Math.tan(chevronAngle),
                canvas.height / 2,
            );
            ctx.lineTo(0, canvas.height);
            ctx.fill();

            // Light pink stripe
            ctx.fillStyle = "#ffafc8";
            ctx.beginPath();
            ctx.moveTo(-chevronWidth, 0);
            ctx.lineTo(
                -chevronWidth + canvas.height / 2 / Math.tan(chevronAngle),
                canvas.height / 2,
            );
            ctx.lineTo(-chevronWidth, canvas.height);
            ctx.fill();

            // White stripe
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.moveTo(-2 * chevronWidth, 0);
            ctx.lineTo(
                -2 * chevronWidth + canvas.height / 2 / Math.tan(chevronAngle),
                canvas.height / 2,
            );
            ctx.lineTo(-2 * chevronWidth, canvas.height);
            ctx.fill();
        },
    ),

    lesbian5: new Background(
        "Lesbian (5)",
        resetControls,
        drawStripesFunc([
            "#d62900",
            "#ff9b55",
            "#ffffff",
            "#d462a6",
            "#a50062",
        ]),
    ),

    lesbian7: new Background(
        "Lesbian (7)",
        resetControls,
        drawStripesFunc([
            "#d62900",
            "#f07722",
            "#ff9b55",
            "#ffffff",
            "#d462a6",
            "#b75591",
            "#a50062",
        ]),
    ),

    gay5: new Background(
        "Gay (5)",
        resetControls,
        drawStripesFunc([
            "#018e71",
            "#99e9c2",
            "#ffffff",
            "#7cafe3",
            "#3b1379",
        ]),
    ),

    gay7: new Background(
        "Gay (7)",
        resetControls,
        drawStripesFunc([
            "#018e71",
            "#21cfac",
            "#99e9c2",
            "#ffffff",
            "#7cafe3",
            "#4f47cc",
            "#3b1379",
        ]),
    ),

    bisexual: new Background(
        "Bisexual",
        resetControls,
        drawStripesFunc([
            "#d70071",
            "#d70071",
            "#9c4e97",
            "#0035aa",
            "#0035aa",
        ]),
    ),

    trans: new Background(
        "Transgender",
        resetControls,
        drawStripesFunc([
            "#5bcffa",
            "#f5abb9",
            "#ffffff",
            "#f5abb9",
            "#5bcffa",
        ]),
    ),

    queer: new Background(
        "Queer",
        resetControls,
        drawStripesFunc([
            "#000000",
            "#9adaeb",
            "#00a4e9",
            "#b6e717",
            "#ffffff",
            "#ffca05",
            "#fd6666",
            "#ffb0ca",
            "#000000",
        ]),
    ),

    nonbinary: new Background(
        "Non-binary",
        resetControls,
        drawStripesFunc(["#fff42f", "#fefefe", "#9c59d1", "#292929"]),
    ),

    "nonbinary-war": new Background(
        "Non-binary (wartime)",
        resetControls,
        drawStripesFunc(["#fff42f", "#292929", "#9c59d1", "#fefefe"]),
    ),

    intersex: new Background("Intersex", resetControls, (ctx) => {
        ctx.fillStyle = "#ffd800";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ratio from svg on wikipedia
        const outerRad = (Math.min(canvas.height, canvas.width) * 43) / 150;
        const innerRad = Math.min(canvas.height, canvas.width) * 0.2025;

        ctx.fillStyle = "#7902aa";
        ctx.beginPath();
        ctx.ellipse(
            canvas.width / 2,
            canvas.height / 2,
            outerRad,
            outerRad,
            0,
            0,
            2 * Math.PI,
        );
        ctx.fill();

        ctx.fillStyle = "#ffd800";
        ctx.beginPath();
        ctx.ellipse(
            canvas.width / 2,
            canvas.height / 2,
            innerRad,
            innerRad,
            0,
            0,
            2 * Math.PI,
        );
        ctx.fill();
    }),

    pansexual: new Background(
        "Pansexual",
        resetControls,
        drawStripesFunc(["#ff1b8d", "#ffd900", "#1bb3ff"]),
    ),

    asexual: new Background(
        "Asexual",
        resetControls,
        drawStripesFunc(["#000000", "#a5a5a5", "#ffffff", "#810081"]),
    ),

    aromantic: new Background(
        "Aromantic",
        resetControls,
        drawStripesFunc([
            "#3aa740",
            "#a8d47a",
            "#ffffff",
            "#ababab",
            "#000000",
        ]),
    ),

    aroace: new Background(
        "Aroace",
        resetControls,
        drawStripesFunc([
            "#e38d00",
            "#edce00",
            "#ffffff",
            "#62b0dd",
            "#1a3555",
        ]),
    ),
};

function bodyLoad() {
    canvas = document.getElementById("main-canvas");
    context = canvas.getContext("2d");
    stripes = document.getElementById("stripes");
    extraControls = document.getElementById("extra-controls");
    backgroundPreview = document.getElementById("background-preview");

    // Start with a square canvas bc it looks better.
    canvas.height = canvas.width;

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

    // background preview
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

        // Make the drawable area a square as well so it's no stretched.
        newCanvas.height = newCanvas.width;

        const newCtx = newCanvas.getContext("2d");
        obj.draw(newCtx);
    }

    allDesigns[selectedBackground].button.classList.add("selected-background");

    // When refreshed, the browser might keep an image there. This loads it.
    /** @type {File?} */
    const maybeFile = document.getElementById("image-input").files.item(0);
    if (maybeFile) {
        loadImage(maybeFile);
    }
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
