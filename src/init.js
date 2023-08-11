import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneFileImageLoader from "cornerstone-file-image-loader";

import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import Hammer from 'hammerjs';
import dicomParser from 'dicom-parser';
import wadoUriCustomMetaDataProvider from './metadataProvider'

import InvertColorTool from './components/InvertColorTool';

export default function initCornerstone() {

  // Cornerstone Tools
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  cornerstoneTools.init({ showSVGCursors: true });

  // WADO Image Loader
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
        usePDFJS: false,
        strict: false,
      },
    },
  });

  // dicom meta data provider
  cornerstone.metaData.addProvider(wadoUriCustomMetaDataProvider);

  // jpg png file image loder
  cornerstoneFileImageLoader.external.cornerstone = cornerstone;



}