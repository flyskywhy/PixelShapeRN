import React from 'react';

export const PixelShapeContext = React.createContext({
  // below must be commented to match PixelShapeRN against app or sub-app, because if not, then for example:
  // when PixelShapeRN is an app, this.context.initialImageSource is {uri: '', fileName: ''} ,
  //     so that below is meaningful
  // when pixelshapern is a sub-app and PixelShapeContext.Provider value={some_object} and
  //     there is no initialImageSource in some_object, this.context.initialImageSource is undefined,
  //     so that below is meaningless
  // so the default value is set in src/components/app/App.js e.g. `this.context.fileExtension = `
  //
  //
  // initialImageSource: {
  //   uri: '', // e.g. '/storage/emulated/0/Pictures/gifs/animation7.gif'
  //   fileName: '', // e.g. 'animation7.gif' will auto be setAnimationName()
  // },
  // initialAnimationName: null, // if no initialImageSource, then also can initialAnimationName to auto be setAnimationName()
  // initialSize: null, // e.g. {width: 32, height: 32}
  // maxSize: null, // e.g. 80 means max size of width and height in Settings dialog is 80
  // initialColor: null, // e.g. '#ff0000'
  // defaultsPalette: require('./defaults/palette').default,
  // onGifGeneratePre: null,
  // onGifGeneratePost: null,
  // onClickGifImage: null,
  // refApptoolbox: null, // e.g. `(ref) => (this.apptoolbox = ref)` to this.apptoolbox.openDownloadProject()
  // refDownloadProject: null, // e.g. `(ref) => (this.downloadProject = ref)` to this.downloadProject.isModifiedAfterLastSave()
  // onGifFileSaved: null,
  // onGifFileSaveCanceled: null,
  // fpsController: { // if no fpsController, will use fps slider, otherwise use steps up down buttons
  //   steps: [1, 3, 6, 8],
  //   stepsDefaultIndex: 1,
  // },
  // fileExtension: 'bmp', // default is 'gif'
  // filterImageName: null, // .e.g `(imageName) => imageName.replace(/^foobar/, '_foobar')`
});
