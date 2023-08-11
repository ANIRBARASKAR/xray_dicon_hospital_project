import React, { useState, useContext } from "react";

import cornerstone from "cornerstone-core";
import CornerstoneViewport from "react-cornerstone-viewport";
import { ViewerContext, NavContext } from "./ContextProvider.js";
import cornerstoneTools from "cornerstone-tools";
import InvertColorTool from "../InvertColorTool.js";
import CrosshairTool from "../CrosshairTool.js";
import ResetTool from "../ResetTool.js";
import NoneTool from "../NoneTool.js";
import { allTools } from "./cornerstoneTools";
import smalltalk from "smalltalk";

export default function DicomView({ imageIds, reportId }) {
  let { getActiveTool } = useContext(ViewerContext);
  // console.log("getActiveTool from DicomView",getActiveTool);
  let [refresh, setRefresh] = useState(false);

  if (imageIds?.length == 0) {
    return "imageids is empty!!";
  }

  // let [viewport, setViewport] = useState({})
  // let [actveFrame, setActveFrame] = useState()
  let actveFrame = 0;
  function setActveFrame(frame) {
    actveFrame = frame;
  }

  let tools = [
    ...allTools,
    // Mouse
    // {
    //   name: 'Zoom',
    //   mode: 'active',
    //   modeOptions: { mouseButtonMask: 2 },
    // },
    // {
    //   name: 'Pan',
    //   mode: 'active',
    //   modeOptions: { mouseButtonMask: 4 },
    // },
    // Scroll
    { name: "StackScrollMouseWheel", mode: "active" },
    // Touch
    { name: "PanMultiTouch", mode: "active" },
    { name: "ZoomTouchPinch", mode: "active" },
    { name: "StackScrollMultiTouch", mode: "active" },
    "InvertColorTool",
    "CrosshairTool",
  ];

  // console.log(tools);
  cornerstoneTools.addTool(InvertColorTool);
  cornerstoneTools.addTool(CrosshairTool);
  cornerstoneTools.addTool(ResetTool);
  cornerstoneTools.addTool(NoneTool);

  let imageId = imageIds[0];

  let metaData = {};
  let metaDataModules = [
    "generalSeriesModule",
    "imagePlaneModule",
    "patientModule",
    "generalImageModule",
    "cineModule",
  ];
  let imageIdsNew = [];

  if (imageId.indexOf("imagefile:") == -1) {
    metaDataModules.forEach((module) => {
      let moduleData = cornerstone.metaData.get(module, imageId);
      if (!moduleData) {
        // console.error(module, "metadata could not be loaded for " + module);
      } else {
        metaData[module] = moduleData;
      }
    });

    let numFrames = metaData.cineModule?.numFrames || 1;

    for (let index = 0; index < numFrames; index++) {
      imageIdsNew.push(imageId + "?frame=" + index);
    }
  } else {
    imageIdsNew = imageIds;
  }
  // console.log("imageIds, imageIdsNew, reportId  👑👑👑👑👑👑👑👑👑",imageIds, imageIdsNew, reportId);

  function saveAnnotationsData(frame, measurment) {
    let annotationsData = localStorage.getItem(reportId);
    annotationsData = JSON.parse(annotationsData) || {};
    if (!annotationsData) {
      annotationsData = {};
    }
    if (!annotationsData[frame]) {
      annotationsData[frame] = [];
    }
    annotationsData[frame].push(measurment);
    // console.log("saveAnnotationsData 🎈🎈🎈", reportId, annotationsData);
    localStorage.setItem(
      reportId,
      JSON.stringify(markAllAnnotationsUnrendered(annotationsData))
    );
  }
  function markAllAnnotationsUnrendered(annotationsData) {
    Object.keys(annotationsData).forEach((frame) => {
      // console.log(typeof annotationsData[frame], annotationsData[frame]);
      Object.keys(annotationsData[frame]).forEach((measurment) => {
        if (annotationsData[frame][measurment]) {
          annotationsData[frame][measurment].rendered = false;
          annotationsData[frame][measurment].old = true;
        }
      });
    });
    // console.log(annotationsData, typeof annotationsData);
    return annotationsData;
  }
  function removeMeasurmentData(uuidRemoved) {
    let annotationsData = localStorage.getItem(reportId);
    annotationsData = JSON.parse(annotationsData) || [];

    Object.keys(annotationsData).forEach((frame) => {
      // console.log(typeof annotationsData[frame], annotationsData[frame]);
      Object.keys(annotationsData[frame]).forEach((measurment) => {
        if (
          annotationsData[frame][measurment]?.measurementData?.uuid ==
          uuidRemoved
        ) {
          annotationsData[frame][measurment] = undefined;
        }
      });
    });
    localStorage.setItem(
      reportId,
      JSON.stringify(markAllAnnotationsUnrendered(annotationsData))
    );
  }

  // console.log('rerenered!!!!');

  let annotationsData = localStorage.getItem(reportId);
  annotationsData = JSON.parse(annotationsData) || [];

  function displayAnnotations(CustomEvent, cornerstoneElement) {
    let y = parseInt(CustomEvent.detail.image.imageId.split("frame=")[1]);
    setActveFrame(y);
    // console.log(y);
    // console.log(reportId);
    // console.log(CustomEvent);

    if (annotationsData[y] && annotationsData[y].length > 0) {
      annotationsData[y].forEach((measurment) => {
        if (
          measurment &&
          measurment.old &&
          !measurment.rendered &&
          measurment.toolName &&
          measurment.measurementData
        ) {
          // console.log(1, measurment.toolName, "👑👑👑 1, measurment.toolName");
          // cornerstoneTools.setToolActive(measurment.toolName, {
          //   mouseButtonMask: 1,
          // });
          cornerstoneTools.addToolState(
            cornerstoneElement,
            measurment.toolName,
            measurment.measurementData
          );
          cornerstoneTools.setToolActive(getActiveTool(), {
            mouseButtonMask: 1,
          });

          measurment.rendered = true;
        }
      });
    }
  }
  var Magnify = "Magnify";

  // console.log("tools",tools  ,"CustomEvent 🌟🌟",CustomEvent);
  return (
    <CornerstoneViewport
      tools={tools}
      // Magnify={Magnify}
      activeTool={getActiveTool()}
      imageIds={imageIdsNew}
      sx={{ minWidth: "100%", height: "100%", flex: "1"  }}
      // isPlaying={true}
      // frameRate={10}
      onElementEnabled={(elementEnabledEvt) => {
        const cornerstoneElement = elementEnabledEvt.detail.element;
        cornerstoneElement.addEventListener(
          cornerstone.EVENTS.IMAGE_RENDERED,
          (imageRenderedEvent) => {
            const viewport = imageRenderedEvent.detail.viewport;
          }
        );
        cornerstoneElement.addEventListener(
          cornerstone.EVENTS.NEW_IMAGE,
          (CustomEvent) => {
            displayAnnotations(CustomEvent, cornerstoneElement);
          }
        );
        cornerstoneElement.addEventListener(
          cornerstoneTools.EVENTS.MEASUREMENT_COMPLETED,
          async (CustomEvent) => {
            if (CustomEvent.detail.toolName == "ArrowAnnotate") {
              console.log("CustomEvent  from if", CustomEvent);
              await smalltalk
                .prompt("Question", "Enter the lable name", "lable:")
                .then((value) => {
                  console.log(value);
                  CustomEvent.detail.measurementData.text = value;
                })
                .catch((e) => {
                  console.log("cancel", e);
                });
            }

            console.log("measurment added to :", actveFrame, reportId);
            saveAnnotationsData(actveFrame, {
              toolName: CustomEvent.detail.toolName,
              measurementData: CustomEvent.detail.measurementData,
              old: false,
              rendered: true,
            });
          }
        );
        cornerstoneElement.addEventListener(
          cornerstoneTools.EVENTS.MEASUREMENT_REMOVED,
          (CustomEvent) => {
            // console.log('MEASUREMENT_REMOVED :', CustomEvent);

            let uuidRemoved = CustomEvent.detail.measurementData.uuid;
            removeMeasurmentData(uuidRemoved);

            saveAnnotationsData(actveFrame, {
              toolName: CustomEvent.detail.toolName,
              measurementData: CustomEvent.detail.measurementData,
              old: false,
              rendered: true,
            });
            localStorage.setItem(
              reportId,
              JSON.stringify({
                toolName: CustomEvent.detail.toolName,
                measurementData: CustomEvent.detail.measurementData,
              })
            );
          }
        );
        cornerstoneElement.addEventListener(
          cornerstoneTools.EVENTS.MEASUREMENT_MODIFIED,
          (CustomEvent) => {
            console.log("MEASUREMENT_MODIFIED :", CustomEvent);
            saveAnnotationsData(actveFrame, {
              toolName: CustomEvent.detail.toolName,
              measurementData: CustomEvent.detail.measurementData,
              old: false,
              rendered: true,
            });
            localStorage.setItem(
              reportId,
              JSON.stringify({
                toolName: CustomEvent.detail.toolName,
                measurementData: CustomEvent.detail.measurementData,
              })
            );
          }
        );
      }}
    />
  );
}

/*
cornerstone.EVENTS:
{
  ACTIVE_LAYER_CHANGED: "cornerstoneactivelayerchanged"
  ELEMENT_DISABLED: "cornerstoneelementdisabled"
  ELEMENT_ENABLED: "cornerstoneelementenabled"
  ELEMENT_RESIZED: "cornerstoneelementresized"
  IMAGE_CACHE_CHANGED: "cornerstoneimagecachechanged"
  IMAGE_CACHE_FULL: "cornerstoneimagecachefull"
  IMAGE_CACHE_MAXIMUM_SIZE_CHANGED: "cornerstoneimagecachemaximumsizechanged"
  IMAGE_CACHE_PROMISE_REMOVED: "cornerstoneimagecachepromiseremoved"
  IMAGE_LOADED: "cornerstoneimageloaded"
  IMAGE_LOAD_FAILED: "cornerstoneimageloadfailed"
  IMAGE_LOAD_PROGRESS: "cornerstoneimageloadprogress"
  IMAGE_RENDERED: "cornerstoneimagerendered"
  INVALIDATED: "cornerstoneinvalidated"
  LAYER_ADDED: "cornerstonelayeradded"
  LAYER_REMOVED: "cornerstonelayerremoved"
  NEW_IMAGE: "cornerstonenewimage"
  PRE_RENDER: "cornerstoneprerender"
  WEBGL_TEXTURE_CACHE_FULL: "cornerstonewebgltexturecachefull"
  WEBGL_TEXTURE_REMOVED: "cornerstonewebgltextureremoved"
}

cornerstoneTools.EVENTS: 
{
  CLIP_STOPPED: "cornerstonetoolsclipstopped"
  DOUBLE_TAP: "cornerstonetoolsdoubletap"
  KEY_DOWN: "cornerstonetoolskeydown"
  KEY_PRESS: "cornerstonetoolskeypress"
  KEY_UP: "cornerstonetoolskeyup"
  LABELMAP_MODIFIED: "cornersontetoolslabelmapmodified"
  MEASUREMENT_ADDED: "cornerstonetoolsmeasurementadded"
  MEASUREMENT_COMPLETED: "cornerstonetoolsmeasurementcompleted"
  MEASUREMENT_MODIFIED: "cornerstonetoolsmeasurementmodified"
  MEASUREMENT_REMOVED: "cornerstonetoolsmeasurementremoved"
  MOUSE_CLICK: "cornerstonetoolsmouseclick"
  MOUSE_DOUBLE_CLICK: "cornerstonetoolsmousedoubleclick"
  MOUSE_DOWN: "cornerstonetoolsmousedown"
  MOUSE_DOWN_ACTIVATE: "cornerstonetoolsmousedownactivate"
  MOUSE_DRAG: "cornerstonetoolsmousedrag"
  MOUSE_MOVE: "cornerstonetoolsmousemove"
  MOUSE_UP: "cornerstonetoolsmouseup"
  MOUSE_WHEEL: "cornerstonetoolsmousewheel"
  MULTI_TOUCH_DRAG: "cornerstonetoolsmultitouchdrag"
  MULTI_TOUCH_START: "cornerstonetoolsmultitouchstart"
  MULTI_TOUCH_START_ACTIVE: "cornerstonetoolsmultitouchstartactive"
  STACK_PREFETCH_DONE: "cornerstonetoolsstackprefetchdone"
  STACK_PREFETCH_IMAGE_LOADED: "cornerstonetoolsstackprefetchimageloaded"
  STACK_SCROLL: "cornerstonetoolsstackscroll"
  TAP: "cornerstonetoolstap"
  TOOL_DEACTIVATED: "cornerstonetoolstooldeactivated"
  TOUCH_DRAG: "cornerstonetoolstouchdrag"
  TOUCH_DRAG_END: "cornerstonetoolstouchdragend"
  TOUCH_END: "cornerstonetoolstouchend"
  TOUCH_PINCH: "cornerstonetoolstouchpinch"
  TOUCH_PRESS: "cornerstonetoolstouchpress"
  TOUCH_ROTATE: "cornerstonetoolstouchrotate"
  TOUCH_START: "cornerstonetoolstouchstart"
  TOUCH_START_ACTIVE: "cornerstonetoolstouchstartactive"
}
*/
