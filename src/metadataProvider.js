import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

const { getNumberValue, getValue } = cornerstoneWADOImageLoader.wadors.metaData;

function wadoUriCustomMetaDataProvider(type, imageId) {
  const { parseImageId, dataSetCacheManager } =
    cornerstoneWADOImageLoader.wadouri;
  const parsedImageId = parseImageId(imageId);
  const dataSet = dataSetCacheManager.get(parsedImageId.url);

  if (!dataSet) {
    //  console.log('dataset could not be loded!!!', imageId, parseImageId, dataSetCacheManager)
    return;
  } else {
    //  if(g--)console.log('dataset  loded!!!', imageId, parseImageId, dataSetCacheManager)
  }

  if (type === "generalImageModule") {
    return {
      sopInstanceUid: dataSet.string("x00080018"),
      instanceNumber: dataSet.intString("x00200013"),
      lossyImageCompression: dataSet.string("x00282110"),
      lossyImageCompressionRatio: dataSet.string("x00282112"),
      lossyImageCompressionMethod: dataSet.string("x00282114"),
    };
  }

  if (type === "patientModule") {
    return {
      patientName: dataSet.string("x00100010"),
      patientId: dataSet.string("x00100020"),
    };
  }

  if (type === "generalStudyModule") {
    return {
      studyDescription: dataSet.string("x00081030"),
      studyDate: dataSet.string("x00080020"),
      studyTime: dataSet.string("x00080030"),
    };
  }

  if (type === "cineModule") {
    return {
      frameTime: dataSet.floatString("x00181063"),
      numFrames: dataSet.intString("x00280008"),
    };
  }

  if (dataSet.elements[type] !== undefined) {
    const element = dataSet.elements[type];
    if (!element.vr) {
      return;
    }

    return dicomParser.explicitElementToString(dataSet, element);
  }
}
export default wadoUriCustomMetaDataProvider;
