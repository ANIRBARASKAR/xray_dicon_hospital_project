import csTools from "cornerstone-tools";
const BaseTool = csTools.importInternal("base/BaseTool");
import cornerstone from "cornerstone-core";

export default class ResetTool extends BaseTool {
  constructor(name = "Reset") {
    super({
      name,
      supportedInteractionTypes: ["Mouse"],
    });
  }

  // This function is called when the mouse is clicked on an element
  preMouseDownCallback(event) {
    // // Get the element from the event detail
    // const element = event.detail.element;
    // const imageId = event.detail.image.imageId;
    // console.log("imageId from ResetTool",imageId);

    // console.log("element fro ResetTool 🌟🌟🌟🌟",element);

    // // Reset the image using cornerstone
    // cornerstone.reset(element);

    // ************
    const element = event.detail.element;
    const imageId = event.detail.image.imageId;
    console.log("imageId from ResetTool", imageId);
    console.log("element from ResetTool", element);
    // Load the image using cornerstone
    cornerstone.loadImage(imageId).then(function (image) {
      // Display the image
      cornerstone.displayImage(element, image);

      // Invert the image
      var viewport = cornerstone.getViewport(element);
      // viewport.invert = !viewport.invert;
      // cornerstone.setViewport(element, viewport);
      cornerstone.reset(element);
    });
  }
}
