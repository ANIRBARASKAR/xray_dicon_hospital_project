## tested on:

1. my windows 11 PC : 
   
PS D:\ai-kalpa\dive-electronJS> node --version
v18.12.1
PS D:\ai-kalpa\dive-electronJS> npm --version
8.19.2
PS D:\ai-kalpa\dive-electronJS> git --version
git version 2.35.0.windows.1

## repo setup developement:
* install NodeJS and Git, (also set up path variable for both in windos)
1. git clone 'https://bitbucket.org/Kalpah_Source_Repositories/dive-2022/src/dicom-styled/'
2. git checkout dicom-styled
3. npm ci
4. npm run watch
5. npm run dev
## repo setup building installer:
* install NodeJS and Git, (also set up path variable for both in windos)
1. git clone 'https://bitbucket.org/Kalpah_Source_Repositories/dive-2022/src/dicom-styled/'
2. git checkout dicom-styled
3. npm ci
   * change isPackaged to true in constants.js
4. npm run watch
5. npm run make
   
## command descriptions:
descriptions:
1. `npm run dev` OR `npm start` to start the application from code repository and watch Live for changes in CJS files.
2. `npm run watch` for continuous build of src folder having react ES6 into build folder with CJS for live developement. need to run for creating frontend modules before packaging as well

now, changes in src will also live reflect on running application due to webpack compiling it in live. 
all console.log output directed to application's console (open by inspecting it)

for changes to webpack config we need to restart the watcher , i.e. npm run watch again.

3. `npm run make` to get application installer distributable created in out/make directory 



### installnig new dependancies/modules :
build time is affected by number of dependancies we have, think b4 adding dependancies
* mostly whenever possible, whichever module is a dev dependancy add it as a dev dependancy
* All frontend modules, those are used under ./src for react app are dev dependancied, as hey are compiled by webpack into build/app.js
* no force installing, if there is dependancy clash, find compatable alternative!
