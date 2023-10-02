let workerUrl = document.baseURI + '/assets/js/pfp-worker.js';
const ImageLoaderWorker = new Worker(workerUrl);

let pfps = document.querySelectorAll("canvas.profilepic");

console.log("Hmm?")
for (const pfp of pfps) {
    const boundingRect = pfp.getBoundingClientRect();
    pfp.width = boundingRect.width;
    pfp.height = boundingRect.height;
    const offscreen = pfp.transferControlToOffscreen();
    const imageUrl = pfp.dataset.src;
    ImageLoaderWorker.postMessage({offscreen: offscreen, imageUrl: imageUrl, containerWidth: boundingRect.width, containerHeight: boundingRect.height}, [offscreen]);
}
