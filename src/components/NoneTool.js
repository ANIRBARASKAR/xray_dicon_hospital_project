import csTools from 'cornerstone-tools';
const BaseTool = csTools.importInternal('base/BaseTool');
import cornerstone from 'cornerstone-core';

export default class NoneTool extends BaseTool {
  constructor(name = 'None') {
    super({
      name,
      supportedInteractionTypes: ['Mouse'],
    });
  }

  // This function is called when the mouse is clicked on an element
  preMouseDownCallback(event) {
    // Get the element from the event detail
    const element = event.detail.element;
    console.log("element from none tool 🎊🎊🎊🎊");

    // Reset the image using cornerstone
  }
}
