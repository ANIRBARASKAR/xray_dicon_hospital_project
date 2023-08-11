import React, { useState, Component } from "react";
import PropTypes from "prop-types";
import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
import CornerstoneViewport from "react-cornerstone-viewport";

export default function DicomThumbnail({ imageIds }) {
  if (imageIds?.length == 0) {
    return "imageids is empty!!";
  }

  let [viewport, setViewport] = useState({});
  let state = {
    tools: [],
    imageIds,

    // : [imageIds[0] + '?frame=' + frame]
  };

  // // console.log(state.imageIds);

  let imageId = state.imageIds[0];
  const seriesMetadata =
    cornerstone.metaData.get("generalSeriesModule", imageId) || {};
  // console.log(seriesMetadata, 'seriesMetadata 🤘🤘');
  const imagePlaneModule =
    cornerstone.metaData.get("imagePlaneModule", imageId) || {};
  // // console.log(imagePlaneModule, 'imagePlaneModule');
  const generalStudyModule =
    cornerstone.metaData.get("generalStudyModule", imageId) || {};
  // // console.log(generalStudyModule, 'generalStudyModule');
  const patientModule =
    cornerstone.metaData.get("patientModule", imageId) || {};
  // // console.log(patientModule, 'patientModule ');
  const generalImageModule =
    cornerstone.metaData.get("generalImageModule", imageId) || {};
  // // console.log(generalImageModule, 'generalImageModule');
  const cineModule = cornerstone.metaData.get("cineModule", imageId) || {};
  // // console.log(cineModule, 'cineModule');

  //   let numFrames = cineModule?.numFrames || 1
  let numFrames = 1;

  let imageIdsNew = [];
  for (let index = 0; index < numFrames; index++) {
    imageIdsNew.push(imageId + "?frame=" + index);
  }
  // // console.log(imageIdsNew)

  //? here sx height has to be given , and that too in pixels. otherwise after drag drop operation, canvas elements strancely start expanding in height...
  return (
    <CornerstoneViewport
      tools={state.tools}
      imageIds={imageIdsNew}
      sx={{
        minWidth: "30%",
        height: "2000px",
        marginBottom: "1rem",
        zIndex: "-1",
        position: "relative",
      }}
      // isPlaying={true}
      // frameRate={10}
      onElementEnabled={(elementEnabledEvt) => {
        const cornerstoneElement = elementEnabledEvt.detail.element;

        // Save this for later
        // this.setState({
        //   cornerstoneElement,
        // });

        // // console.log('fired', elementEnabledEvt);

        cornerstoneElement.addEventListener(
          "cornerstoneimagerendered",
          (imageRenderedEvent) => {
            const viewport = imageRenderedEvent.detail.viewport;
            setViewport(viewport);
          }
        );

        cornerstoneElement.addEventListener(
          cornerstoneTools.EVENTS.MOUSE_DRAG,
          (dragEvent) => {
            // console.log('MOUSE_DRAG');
          }
        );
        cornerstoneElement.addEventListener(
          cornerstoneTools.EVENTS.MOUSE_WHEEL,
          (scrollEvent) => {
            console.log('🥰🥰🥰dragStart');
          }
        );
        cornerstoneElement.addEventListener(
          "some event",
          (imageRenderedEvent) => {
            //some script
          }
        );
      }}
      isOverlayVisible={false}
    />
  );
}
