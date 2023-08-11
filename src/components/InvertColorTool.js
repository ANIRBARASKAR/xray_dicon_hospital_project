import csTools from 'cornerstone-tools';
const BaseTool = csTools.importInternal('base/BaseTool');
import cornerstone from 'cornerstone-core';

export default class InvertColorTool extends BaseTool {
    constructor(name = 'InvertColor') {
        super({
            name,
            supportedInteractionTypes: ['Mouse'],
        });
    }

    // This function is called when the mouse is clicked on an element
    preMouseDownCallback(event) {
        // Get the element and image from the event detail

        console.log("event 🌟🌟🌟🌟",event);
        const element = event.detail.element;
        const imageId = event.detail.image.imageId;
        console.log("imageId from InvertColorTool",imageId);
        console.log("element from InvertColorTool",element);

        // Load the image using cornerstone
        cornerstone.loadImage(imageId).then(function (image) {
            // Display the image
            cornerstone.displayImage(element, image);

            // Invert the image
            var viewport = cornerstone.getViewport(element);

            console.log("viewport from 🎊🎊🎊🎊",viewport);
            viewport.invert = !viewport.invert;
            cornerstone.setViewport(element, viewport);
        });
    }
}
