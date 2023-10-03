let test = /foo/;

onmessage = function(event) {
    const resCanvas = event.data.offscreen;
    const imageUrl = event.data.imageUrl;
    const containerWidth = event.data.containerWidth;
    const containerHeight = event.data.containerHeight;

    fetch(imageUrl).then((res) => {
        res.blob().then((blob) => {
            createImageBitmap(blob).then((imageBitmap) => {
                pfpExtend(resCanvas, imageBitmap, containerWidth, containerHeight);
            })
        })
    })
}

function pfpExtend(resCanvas, imageBitmap, containerWidth, containerHeight) {
    function getContainedSize(img, cWidth, cHeight) {
        let ratio = img.width/img.height;
        let width = cHeight*ratio;
        let height = cHeight
        if (width > cWidth) {
            width = cWidth
            height = cWidth/ratio
        }
        return [Math.floor(width), Math.floor(height)]
    }

    function getPixelData(imageData, width, col, row) {
        let start = row * 4 * width;
        let colOffset = col * 4;

        return [
            // Red
            imageData[start + colOffset],
            // Green
            imageData[start + colOffset + 1],
            // Blue
            imageData[start + colOffset + 2],
            // Alpha
            imageData[start + colOffset + 3],
        ];
    }

    function colorDistance(e1, e2) {
        let rmean = Math.ceil((e1[0] + e2[0]) / 2);
        let r = e1[0] - e2[0];
        let g = e1[1] - e2[1];
        let b = e1[2] - e2[2];
        return Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8));
    }

    const COLOR_EPSILON = 150;

    function colorSimilar(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        let dist = colorDistance(a, b);
        return dist < COLOR_EPSILON;
    }

    function addRowColorStops(gradient, imageData, width, row) {
        // The rowColors of the row in color stop format of
        // 0 to 1 inclusive for location and then color in
        // an rgba css color string
        let mostRecentColor = null;
        for (let col = 0; col < width; col += 1) {
            let pixel = getPixelData(imageData, width, col, row);
            if (!colorSimilar(mostRecentColor, pixel)) {
                mostRecentColor = pixel;
                gradient.addColorStop(col / width, `rgb(${pixel[0]} ${pixel[1]} ${pixel[2]} / ${pixel[3] / 255})`);
            }
        }
    }

    function addColColorStops(gradient, imageData, width, height, col) {
        // The colColors of the row in color stop format of
        // 0 to 1 inclusive for location and then color in
        // an rgba css color string
        let mostRecentColor = null;
        for (let row = 0; row < height; row += 1) {
            let pixel = getPixelData(imageData, width, col, row);
            if (!colorSimilar(mostRecentColor, pixel)) {
                mostRecentColor = pixel;
                let color = `rgb(${pixel[0]} ${pixel[1]} ${pixel[2]} / ${(pixel[3]) / 255})`;
                gradient.addColorStop(row / height, color);
            }
        }
    }

    /** @type {ImageBitmap} */
    let image = imageBitmap;

    // Then, calculate where the image will be drawn
    let [containedWidth, containedHeight] = getContainedSize(image, containerWidth, containerHeight);

    let verticalMargin = (containerHeight - containedHeight) / 2;
    let horizontalMargin = (containerWidth - containedWidth) / 2;

    let imageStart = {x: horizontalMargin, y: verticalMargin};
    let imageEnd = {x: horizontalMargin + containedWidth, y: verticalMargin + containedHeight};

    // Then, calculate the gradients
    let canvas = new OffscreenCanvas(containedWidth, containedHeight);
    let context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    let resContext = resCanvas.getContext("2d");
    resContext.imageSmoothingQuality = "high";

    context.drawImage(image, 0, 0, containedWidth, containedHeight);
    let imageData = context.getImageData(0, 0, containedWidth, containedHeight).data;

    const MASK_ADJUST = 0.25;

    if (verticalMargin > 0) {
        // console.log("Need vertical margin filling gradients");
        // let maskGradient = resContext.createLinearGradient(0, 0, 0, containerHeight);
        // maskGradient.addColorStop(imageStart.y / containerHeight * MASK_ADJUST, "transparent");
        // maskGradient.addColorStop(imageStart.y / containerHeight, "white");
        // maskGradient.addColorStop(imageEnd.y / containerHeight, "white");
        // maskGradient.addColorStop(1 - (imageStart.y / containerHeight * MASK_ADJUST), "transparent");
        // resContext.fillStyle = maskGradient;
        // resContext.fillRect(0, 0, containerWidth, containerHeight);
        // resContext.globalCompositeOperation = "source-atop";

        let topGradient = resContext.createLinearGradient(0, 0, containerWidth, 0);
        let bottomGradient = resContext.createLinearGradient(0, 0, containerWidth, 0);

        // console.log("Adding rowColorStops to topGradient");
        addRowColorStops(topGradient, imageData, containedWidth, 0);
        // console.log("Adding rowColorStops to bottomGradient");
        addRowColorStops(bottomGradient, imageData, containedWidth, containedHeight - 1);

        // console.log("Filling topGradient");
        resContext.fillStyle = topGradient;
        resContext.fillRect(0, 0, containerWidth, verticalMargin + 1);
        // console.log("Filling bottomGradient");
        resContext.fillStyle = bottomGradient;
        resContext.fillRect(0, imageEnd.y - 1, containerWidth, verticalMargin);
    } else if (horizontalMargin > 0) {
        // console.log("Need horizontal margin filling gradients");
        // let maskGradient = resContext.createLinearGradient(0, 0, containerWidth, 0);
        // maskGradient.addColorStop(imageStart.x / containerWidth * MASK_ADJUST, "transparent");
        // maskGradient.addColorStop(imageStart.x / containerWidth, "black");
        // maskGradient.addColorStop(imageEnd.x / containerWidth, "black");
        // maskGradient.addColorStop(1 - (imageStart.x / containerWidth * MASK_ADJUST), "transparent");
        // resContext.fillStyle = maskGradient;
        // resContext.fillRect(0, 0, containerWidth, containerHeight);
        // resContext.globalCompositeOperation = "source-atop";
        let leftGradient = context.createLinearGradient(0, 0, 0, containerHeight);
        let rightGradient = context.createLinearGradient(0, 0, 0, containerHeight);

        addColColorStops(leftGradient, imageData, containedWidth, containedHeight, 0);
        addColColorStops(rightGradient, imageData, containedWidth, containedHeight, containedWidth - 1);
        resContext.fillStyle = leftGradient;
        resContext.fillRect(0, 0, horizontalMargin, containerHeight);
        resContext.fillStyle = rightGradient;
        resContext.fillRect(imageEnd.x - 1, 0, horizontalMargin, containerHeight);
    }

    resContext.drawImage(image, imageStart.x, imageStart.y, containedWidth, containedHeight);
}