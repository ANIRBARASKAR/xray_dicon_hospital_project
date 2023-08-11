## to track todos and prograss

* content security policy header to be set properly that was removed for putting inn dicom... 
* add patient crashes for single image upload patient add. probably array of reports is not formed!!
* selecting and displaing multiple reports breaks the viewer, setview always to set 9, if less than 9 then fill the gap... not throw exeption...
  


* useMemo over recussive list to avoid re-renders 

## backlogs

* password user auth update: add hashing. store hashed values and API will only give hashed values to server, which gives back only success token, so no password leak risk

*  loader should not cause re-render!!! make it ref class based component and useEffect loderRef.setLoder

* systematising the react components:
  *  what props to pass till what depth, where to use setUser and where metaData, where to pass navigate, where not to...setUSer only used for loging out as of now.
  *  naming event handlers, utility functions, request managers properly
  
*  try applying useMemo

*  state variables are passed as props, and props received are changed unknowingly, props are passed as referance, so to pass down the props as hard copy wherever data might be writen on db, as changes made unknowingly by child components unknowingly might also be writen to db unKnowingly

* left pane final commit
todo: may remove recursive component, add patient and appointment rendrer functions separately
todo: editing the data: adding/removing/renaming patient/appointment/report to be done in this component's state
