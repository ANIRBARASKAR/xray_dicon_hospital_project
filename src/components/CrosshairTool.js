import csTools from 'cornerstone-tools';
const BaseTool = csTools.importInternal('base/BaseTool');
import cornerstone from 'cornerstone-core';

export default class CrosshairTool extends BaseTool {
    constructor(name = 'Crosshair') {
        // console.log("CrosshairTool Called 🌟🌟🌟🌟🌟");
        super({
            name,
            supportedInteractionTypes: ['Mouse'],
        });
    }

    // This function is called when the mouse is clicked on an element
    preMouseDownCallback(event) {
        // Get the element and image from the event detail

        // console.log("event 🌟🌟🌟🌟",event.detail);
        const element = event.detail.element;
        const imageId = event.detail.image.imageId;
        // console.log("imageId from InvertColorTool",imageId);
        // console.log("element from InvertColorTool",element);

        // Load the image using cornerstone
        cornerstone.loadImage(imageId).then(function (image) {
            // Display the image
            cornerstone.displayImage(element, image);

            // Invert the image
            var viewport = cornerstone.getViewport(element);

            console.log("viewport from 🎊🎊🎊🎊",viewport);
            viewport.Crosshair = !viewport.Crosshair;
            cornerstone.setViewport(element, viewport);
        });
    }
}
