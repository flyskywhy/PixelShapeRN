export default [
  {
    name: 'Brush',
    tool: 'Brush',
    icon: 'brush',
    iconSrc: require('../images/brush.png'),
    iconSelectedSrc: require('../images/brush_selected.png'),
  },
  {
    name: 'Horizontal mirror brush',
    tool: 'HorzMirrorBrush',
    icon: 'horizontal-mirror-brush',
    iconSrc: require('../images/horizontal-mirror-brush.png'),
    iconSelectedSrc: require('../images/horizontal-mirror-brush_selected.png'),
  },
  {
    name: 'Vertical mirror brush',
    tool: 'VertMirrorBrush',
    icon: 'vertical-mirror-brush',
    iconSrc: require('../images/vertical-mirror-brush.png'),
    iconSelectedSrc: require('../images/vertical-mirror-brush_selected.png'),
  },
  {
    name: 'Bucket fill',
    tool: 'Bucket',
    icon: 'colorfill',
    iconSrc: require('../images/colorfill.png'),
    iconSelectedSrc: require('../images/colorfill_selected.png'),
  },
  {
    name: 'Color replacer',
    tool: 'ColorReplace',
    icon: 'globalcolorfill',
    iconSrc: require('../images/globalcolorfill.png'),
    iconSelectedSrc: require('../images/globalcolorfill_selected.png'),
  },
  {
    name: 'Eraser',
    tool: 'Eraser',
    icon: 'eraser',
    iconSrc: require('../images/eraser.png'),
    iconSelectedSrc: require('../images/eraser_selected.png'),
  },
  {
    name: 'Color picker',
    tool: 'Dropper',
    icon: 'dropper',
    iconSrc: require('../images/dropper.png'),
    iconSelectedSrc: require('../images/dropper_selected.png'),
  },
  {
    name: 'Rectangle',
    tool: 'Rectangle',
    icon: 'rect',
    iconSrc: require('../images/rect.png'),
    iconSelectedSrc: require('../images/rect_selected.png'),
  },
  {
    name: 'Ellipse',
    tool: 'Ellipse',
    icon: 'circle',
    iconSrc: require('../images/circle.png'),
    iconSelectedSrc: require('../images/circle_selected.png'),
  },
  {
    name: 'Lightener',
    tool: 'Lightener',
    icon: 'lightener',
    iconSrc: require('../images/lightener.png'),
    iconSelectedSrc: require('../images/lightener_selected.png'),
  },
  {
    name: 'Darkener',
    tool: 'Darkener',
    icon: 'darkener',
    iconSrc: require('../images/darkener.png'),
    iconSelectedSrc: require('../images/darkener_selected.png'),
  },
  // ,
  // {
  //   name: '',
  //   tool: 'Cropper',
  //   icon: 'selectcrop'
  //  iconSrc: require('../images/selectcrop.png'),
  //  iconSelectedSrc: require('../images/selectcrop_selected.png'),
  // }
];

export const toolHotkeys = {
  Brush: 'b',
  HorzMirrorBrush: 'h',
  VertMirrorBrush: 'v',
  Bucket: 'f',
  ColorReplace: 'a',
  Eraser: 'e',
  Dropper: 'g',
  Rectangle: 'r',
  Ellipse: 'c',
  Lightener: 'l',
  Darkener: 'd',
};
