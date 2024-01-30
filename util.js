function resetControls() {
    extraControls.innerHTML = "";
}

/**
 * Meant to be called when an image is reset.
 * For example: Before a new image has loaded.
 */
function disableCanvas() {
    canvas.width = "30%";
}

/**
 * Updates the canvas's width and height with the image's and redraws.
 * Meant to be called after an image is loaded.
 */
function enableCanvas() {
    canvas.width = userImage.img.width;
    canvas.height = userImage.img.height;

    redrawCanvas();
}

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

    // Drawn background can return an overlay to be drawn over the image.
    const overlay = allDesigns[selectedBackground].draw(context);
    userImage.draw(context);

    overlay?.call(this, context);
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

function loadImage(file) {
    disableCanvas();
    userImage.img.src = URL.createObjectURL(file);
}

function imageUploaded(event) {
    loadImage(event.target.files[0]);
}

/**
 * Draws equal sized stripes horizontally in the given context.
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Array<string>} stripes Array of ctx.fillStyle values.
 */
function drawStripes(ctx, stripes) {
    let stripeHeight = canvas.height / stripes.length;
    for (let i = 0; i < stripes.length; i++) {
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
