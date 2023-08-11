* webpack: https://webpack.js.org/concepts/ 


* webpack externals: https://webpack.js.org/configuration/externals/#externalstypevar
  modules that are NOT bundled with output
  they are asumed to be preesnt at the time of execution in the environment in form of some global/ script/ etc... so ,
  To be able to use these modules in our app in ES6, i.e to use import 'dicomparser' from 'dicom-parser' we need to:
  1. see how can we bring it in environment , i.e. by including it in script tag as done here.
  2. now define in webpack config 'dicome-parser' as an external dependancy to be loaded as 'var' this way it is most wasily accessible...
  3. * externalType to be set to 'var' 
   