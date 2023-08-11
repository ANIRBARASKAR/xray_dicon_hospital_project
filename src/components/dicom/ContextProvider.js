import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  createContext,
} from "react";

import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import cornerstoneFileImageLoader from "cornerstone-file-image-loader";

import ErrorPage from "../ErrorPage.jsx";

export const NavContext = createContext(null);
export const ViewerContext = createContext(null);
export const InfoContext = createContext(null);
export const DataContext = createContext(null);

export default function DicomContext({ children, nodeList }) {
  let [NodeList, setNodeList] = useState(nodeList);

  // following 4 viewAddSomething or SyncData functions are stale functionality, althou works but was removed due to UX ...
  // just adding the data inside the view, NOT in the database
  function viewAddPatient(patient) {
    let t = JSON.parse(JSON.stringify(NodeList));
    t.push(patient);
    // console.log(t);
    setNodeList(t);
    syncData(patient);
  }
  function viewAddAppointment(patientId, appointment) {
    let t = JSON.parse(JSON.stringify(NodeList));
    if (!getById(t, patientId)) {
      alert("no patient matched!");
    }
    getById(t, patientId).appointments.push(appointment);
    setNodeList(t);
    syncData(appointment);
  }
  function viewAddReport(patientId, appointmentId, report) {
    let t = JSON.parse(JSON.stringify(NodeList));
    let appointmentList = getById(t, patientId).appointments;
    getById(appointmentList, appointmentId).reports.push(report);
    setNodeList(t);
    syncData(report);
  }
  function syncData(node) {
    syncOpenNodes(node);
    syncImageId(node);
  }
  let [AddAppointmentModalPatientId, setAddAppointmentModalPatientId] =
    useState(undefined);
  function closeAddAppointmentModal(appointment) {
    setAddAppointmentModalPatientId(undefined);
    if (appointment) {
      viewAddAppointment(AddAppointmentModalPatientId, appointment);
    }
  }
  function openAddAppointmentModal(patientId) {
    setAddAppointmentModalPatientId(patientId);
  }

  // json of nodeId vs node for if the node with that nodeId is selected,
  // storing node itself instead of boolean as we need to directly access these nodes while opening them, or passing them to AI modules, or any upcoming functionality...
  // unsorted, in orer in which reports were selected w.r.t. time
  const [SelectedReports, setSelectedReports] = useState({});

  function selectNode(node) {
    let tSelectedReports = JSON.parse(JSON.stringify(SelectedReports));
    tSelectedReports[node._id] = node;

    // if (tSelectedReports.length >= 9) tSelectedReports = tSelectedReports.slice(0, 9) //

    // console.log(node, tSelectedReports);

    setSelectedReports(tSelectedReports);
  }

  function unselectNode(node) {
    let tSelectedReports = JSON.parse(JSON.stringify(SelectedReports));
    if (
      !tSelectedReports[node._id] ||
      tSelectedReports[node._id] == undefined
    ) {
      alert("error, trying to unselect node that was not selected", "error");
      console.log(
        "error, trying to unselect node that was not selected",
        node,
        tSelectedReports
      );
      return;
    } else {
      // console.log('unselected node', node, tSelectedReports);
      delete tSelectedReports[node._id];
      setSelectedReports(tSelectedReports);
    }
  }

  function cancelSelection() {
    // unselect All Nodes
    // console.log('clearing', SelectedReports)
    setSelectedReports({});
    // console.log('cleared', SelectedReports)
  }

  const [OpenNodes, setOpenNodes] = useState(DFSgetNodeIds({ NodeList }, true));

  //when new node is added, we need to sync its children to be open or close...
  function syncOpenNodes(node) {
    // if appointment, it must be open by default
    let g = DFSgetNodeIds(node, true);
    // console.log(g, 'ggggg');
    setOpenNodes({ ...OpenNodes, ...g });
  }

  // opens cosed node & closes opened node
  function toggleNode(nodeId) {
    if (OpenNodes[nodeId] == undefined) {
      // console.log(`invalid node passed`, nodeId, OpenNodes)
      return;
    }

    let tOpenNodes = JSON.parse(JSON.stringify(OpenNodes));
    tOpenNodes[nodeId] = !tOpenNodes[nodeId];

    setOpenNodes(tOpenNodes);
  }

  function closeAllNodes() {
    let tOpenNodes = JSON.parse(JSON.stringify(OpenNodes));

    Object.keys(tOpenNodes).forEach((nodeId) => (tOpenNodes[nodeId] = false));

    setOpenNodes(tOpenNodes);
  }

  function expandAllNodes() {
    let tOpenNodes = JSON.parse(JSON.stringify(OpenNodes));

    Object.keys(tOpenNodes).forEach((nodeId) => (tOpenNodes[nodeId] = true));

    setOpenNodes(tOpenNodes);
  }

  // viewReports is the array of 9 reports that are actually displayed on the dicom
  let [viewReports, setViewReports] = useState(new Array(9).fill({}));

  function setView(reports) {
    if (reports.length == 0 || !reports) {
      // console.log('reports array not there!!', reports);
      return;
    }
    while (reports.length < 9) {
      reports.push({});
    }
    setViewReports(reports);
  }

  function editViewReports(index = null) {
    let tviewReports = JSON.parse(JSON.stringify(viewReports));

    let reports = Object.keys(SelectedReports).map(
      (key) => SelectedReports[key]
    );

    tviewReports[index] = reports[0];

    setView(tviewReports);
  }

  function displaySelected() {
    let reports = Object.keys(SelectedReports).map(
      (key) => SelectedReports[key]
    );
    // console.log(SelectedReports, reports);

    let newLayout = {
      columns: Math.min(reports.length, 3),
      rows: Math.ceil(reports.length / 3),
    };
    if (reports.length == 4) {
      newLayout = { columns: 2, rows: 2 };
    }
    setLayout(newLayout);
    setView(reports);
    cancelSelection();
  }

  function getSelectedReportFiles() {
    let reports = Object.keys(SelectedReports).map(
      (key) => SelectedReports[key]?.report_data?.path
    );
    // console.log(reports);
    return reports;
  }

  let [Layout, setLayout] = useState({ rows: 1, columns: 1 });

  let [Mode, setMode] = useState("dicom");
  let [ActiveTool, setActiveTool] = useState("Wwwc");
  function getActiveTool() {
    return ActiveTool; 
  }
  function activateTool(tool) {
    // console.log("activateTool 🎉🎉🎉🎉🎉🎉🎉🎉 ",activateTool);
    if (tool == ActiveTool) {
      setActiveTool("None");
    } else {
      setActiveTool(tool);
    }
  }

  const CornerstoneImageId = useRef(DFSgetNodeIds({ NodeList }));

  // when new node is added in dicom, to add its image ids as well to existing ones
  function syncImageId(node) {
    CornerstoneImageId.current = {
      ...CornerstoneImageId.current,
      ...DFSgetNodeIds(node),
    };
  }

  function getCornerstoneImageId(node) {
    // console.log(CornerstoneImageId);

    if (CornerstoneImageId.current[node._id])
      return CornerstoneImageId.current[node._id];
    else {
      let imageId = generateCornerstoneId(node.report_data.path);

      CornerstoneImageId.current[node._id] = imageId;

      return imageId;
    }
  }

  let [showNav, setShowNav] = useState(true);

  const Nav = {
    toggleNode,
    OpenNodes,
    SelectedReports,
    closeAllNodes,
    expandAllNodes,
    selectNode,
    unselectNode,
    cancelSelection,
    showNav,
    setShowNav,
  };

  const Info = {};

  const Viewer = {
    Layout,
    setLayout,
    viewReports,
    displaySelected,
    editViewReports,
    Mode,
    setMode,
    getCornerstoneImageId,
    ActiveTool,
    activateTool,
    getActiveTool,
  };

  const Data = {
    viewAddPatient,
    viewAddAppointment,
    viewAddReport,
    AddAppointmentModalPatientId,
    closeAddAppointmentModal,
    openAddAppointmentModal,
    NodeList,
    getSelectedReportFiles,
  };

  // let resp = validateTree(NodeList)
  // if (resp.error != {}) return <ErrorPage error={{ resp }} />

  return (
    <NavContext.Provider value={Nav}>
      <InfoContext.Provider value={Info}>
        <ViewerContext.Provider value={Viewer}>
          <DataContext.Provider value={Data}>{children}</DataContext.Provider>
        </ViewerContext.Provider>
      </InfoContext.Provider>
    </NavContext.Provider>
  );
}

// iterates noses in NodeList and gets one with nodeId else
function getById(NodeList, nodeId) {
  let target;
  NodeList.forEach((node) => {
    if (node._id == nodeId) {
      target = node;
    }
  });
  return target;
}

// gives JSON of all node's connected to passed node in form of : {nodeId1: false, nodeId2:true, ...} default all false.
function DFSgetNodeIds(node, openPatientNode = false) {
  let ans = { [node._id]: node.appointments ? openPatientNode : false };
  if (node.report_data) return ans;
  let NodeList = node.appointments || node.reports || node.NodeList;
  if (!NodeList) {
    // console.log('exeption: ', node)
    return {};
  }
  NodeList.forEach((node) => {
    ans = { ...ans, ...DFSgetNodeIds(node, openPatientNode) };
  });
  return ans;
}

function generateCornerstoneId(path) {
  let imageId = false;

  if (isUrl(path)) {
    // console.log('no online file access allowed!! ...')
    return false;
  }

  let file = createFileFromPath(path);

  if (!file) {
    // console.log('no file created...')
    return false;
  } else {
    // console.log(file);
  }

  if (isDicomFile(path)) {
    imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
  } else if (isImage(path)) {
    imageId = cornerstoneFileImageLoader.fileManager.add(file);
  } else {
    // console.log('no imageId created...', file)
    return false;
  }

  // console.log('imageID created : ', imageId);
  return imageId;
}

function createFileFromPath(path) {
  let blob;
  try {
    blob = electron.fileHandler.read(path);
  } catch (e) {
    // console.log(e)
    return;
  }

  if (!blob || Object.keys(blob).length <= 0) {
    // console.log(blob, 'file could not be accessed on disk...')
  }

  // todo pass filename and file type inn so that DCM or JPG or anything else can also be readed properly...

  let name, mimeType;
  name = "report.dcm";
  mimeType = "";

  let file = makeFile(blob, name, mimeType);
  // console.log(blob, file, 'file --.')
  return file;
}

function makeFile(blob, name, mimeType) {
  return new File([blob], name, {
    type: mimeType,
  });
}
//todo optimise all these dirty string functions
function isUrl(path) {
  return path.indexOf("https://") == 0 || path.indexOf("http://") == 0;
}
function isDicomFile(path) {
  return (
    path.indexOf(".dcm") == path.length - 4 ||
    path.indexOf(".DCM") == path.length - 4
  );
}
function isImage(path) {
  return (
    path.indexOf(".jpg") == path.length - 4 ||
    path.indexOf(".png") == path.length - 4 ||
    path.indexOf(".jpeg") == path.length - 5 ||
    path.indexOf(".JPG") == path.length - 4 ||
    path.indexOf(".JPEG") == path.length - 5 ||
    path.indexOf(".PNG") == path.length - 4
  );
}
