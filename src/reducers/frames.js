import {
  ADD_FRAME,
  MOVE_FRAME_RIGHT,
  MOVE_FRAME_LEFT,
  DUPLICATE_FRAME,
  UPDATE_FRAME_IMAGE_DATA,
  UPDATE_FRAME_NAME,
  SET_CURRENT_FRAME,
  REMOVE_FRAME,
  UPDATE_FRAME_GIF_DATA,
  RESET_FRAMES_STATE,
  SET_FPS,
  UPDATE_FRAMES_SIZE
} from 'actions/frames';

import { uniqueId } from 'utils/uuid';
import { expandImageData } from 'utils/canvasUtils';

const framePrefix = 'frame_',
      frameName = 'default_';

// TODO: to be moved to defaults or configs
const frameSize = {width: 700, height: 700, naturalWidth: 32, naturalHeight: 32};

// need to provide initial image size here, since this is also called on project reset
const generateInitialState = () => {
  const id = uniqueId(framePrefix);

  const initialState = {
    activeFrame: null,
    fps: 2,
    // gather all data generated by gif encoder for all frames according to frames order
    framesGifData: {},
    // store order of frames presented in gif; stored by unique id
    framesOrderArray: [],
    // keep track of all changed frames on each iteration, to generate just a part of new gif data array
    // NOTE: this will contain at most TWO elements on one draw iteration; this should be cleared eventually after iteration
    // all elements are sorted by position in framesOrderArray; stored as {el: <index in framesOrderArray>}
    modifiedFramesArray: [],
    framesCollectionObject: {
      // uuid: {
      //   name: '',
      //   naturalImageData: []
      // }
    }
  };

  // create an empty first frame
  initialState.activeFrame = id;
  initialState.framesOrderArray.push(id);
  initialState.framesCollectionObject[id] = {
    name: `${frameName}0`,
    naturalImageData: new ImageData(frameSize.naturalWidth, frameSize.naturalHeight)
  };
  initialState.modifiedFramesArray.push({
    [id]: 0
  });

  return initialState;
};

const initialState = generateInitialState();

function frames (state = initialState, action) {
  let frame,
      framesOrderArray = [],
      framesCollectionObject = {},
      modifiedFramesArray = [],
      modifiedFrame = {},
      newState,
      activeFrame,
      index,
      id;

  switch (action.type) {
    case ADD_FRAME:
      id = uniqueId(framePrefix);
      framesOrderArray = [...state.framesOrderArray, id];
      framesCollectionObject[id] = {
        name: `${frameName}${state.framesOrderArray.length}`,
        naturalImageData: new ImageData(action.width, action.height)
      };

      // take last two from framesOrderArray stored as {el: key}
      modifiedFramesArray = framesOrderArray.map(
        (el, key) => ({ [el]: key })
      ).slice(-2);

      return Object.assign({}, state, {
        modifiedFramesArray,
        framesOrderArray,
        framesCollectionObject: Object.assign({}, state.framesCollectionObject, framesCollectionObject)
      });

    case UPDATE_FRAME_IMAGE_DATA:
      activeFrame = state.framesCollectionObject[action.frameUUID];
      frame = {};
      frame[action.frameUUID] = Object.assign({}, activeFrame, { naturalImageData: action.naturalImageData });
      framesCollectionObject = Object.assign({}, state.framesCollectionObject, frame);
      modifiedFramesArray = [{ [action.frameUUID]: state.framesOrderArray.indexOf(action.frameUUID) }];
      return Object.assign({}, state, { framesCollectionObject, modifiedFramesArray });

    case MOVE_FRAME_RIGHT:
      index = state.framesOrderArray.findIndex(el => el === action.uuid);
      if (index === state.framesOrderArray.length - 1) return state;

      framesOrderArray = [
        ...state.framesOrderArray.slice(0, index),
        state.framesOrderArray[index + 1],
        state.framesOrderArray[index]
      ];

      if (state.framesOrderArray.length > index + 2)
        framesOrderArray = [...framesOrderArray, ...state.framesOrderArray.slice(index + 2)];

      modifiedFramesArray = [
        { [state.framesOrderArray[index + 1]]: index },
        { [state.framesOrderArray[index]]: index + 1}
      ];

      return Object.assign({}, state, { framesOrderArray, modifiedFramesArray });

    case MOVE_FRAME_LEFT:
      index = state.framesOrderArray.findIndex(el => el === action.uuid);
      if (index === 0) return state;

      framesOrderArray = [
        ...state.framesOrderArray.slice(0, index - 1),
        state.framesOrderArray[index],
        state.framesOrderArray[index - 1]
      ];

      if (state.framesOrderArray.length > index + 1)
        framesOrderArray = [...framesOrderArray, ...state.framesOrderArray.slice(index + 1)];

      modifiedFramesArray = [
        { [state.framesOrderArray[index]]: index - 1 },
        { [state.framesOrderArray[index - 1]]: index}
      ];

      return Object.assign({}, state, { framesOrderArray, modifiedFramesArray });

    case DUPLICATE_FRAME:
      index = state.framesOrderArray.findIndex(el => el === action.uuid);
      id = uniqueId(framePrefix);

      const currentNaturalImgData = state.framesCollectionObject[action.uuid].naturalImageData,
            naturalImageData = new ImageData(currentNaturalImgData.width, currentNaturalImgData.height),
            naturalDataCopy = new Uint8ClampedArray(currentNaturalImgData.data);

      naturalImageData.data.set(naturalDataCopy);

      framesCollectionObject[id] = {
        name: `${state.framesCollectionObject[action.uuid].name}_copy`,
        naturalImageData
      };

      framesOrderArray = [...state.framesOrderArray.slice(0, index + 1), id];

      if (state.framesOrderArray[index + 1])
        framesOrderArray = [...framesOrderArray, ...state.framesOrderArray.splice(index + 1)];

      modifiedFramesArray = [
        { [action.uuid]: index },
        { [id]: index + 1 }
      ];

      return Object.assign({}, state, {
        framesOrderArray,
        modifiedFramesArray,
        framesCollectionObject: Object.assign({}, state.framesCollectionObject, framesCollectionObject)
      });

    case UPDATE_FRAME_NAME:
      activeFrame = state.framesCollectionObject[action.frameUUID];
      frame = {};
      frame[action.frameUUID] = Object.assign({}, activeFrame, { name: action.name });
      framesCollectionObject = Object.assign({}, state.framesCollectionObject, frame);
      return Object.assign({}, state, { framesCollectionObject });

    case SET_CURRENT_FRAME:
      return Object.assign({}, state, { activeFrame: action.uuid });

    case REMOVE_FRAME:
      index = state.framesOrderArray.findIndex(el => el === action.uuid);
      if (state.framesOrderArray.length === 1) return state;

      framesOrderArray = [...state.framesOrderArray.slice(0, index)];

      if (state.framesOrderArray[index + 1]) {
        framesOrderArray = [...framesOrderArray, ...state.framesOrderArray.slice(index + 1)];
        activeFrame = state.framesOrderArray[index + 1];
        modifiedFrame = { [activeFrame]: index + 1 };
      } else {
        activeFrame = state.framesOrderArray[index - 1];
        modifiedFrame = { [activeFrame]: index - 1 };
      }

      newState = Object.assign({}, state, { activeFrame, framesOrderArray });
      delete newState.framesCollectionObject[action.uuid];
      delete newState.framesGifData[action.uuid];

      modifiedFramesArray = [modifiedFrame];

      return Object.assign({}, newState, { modifiedFramesArray });

    case UPDATE_FRAME_GIF_DATA:
      return Object.assign({}, state, {
        framesGifData: Object.assign({}, state.framesGifData, { [action.frameUUID]: action.frameData })
      });

    case SET_FPS:
      // fps is stored in all frames so need to update all of them
      modifiedFramesArray = state.framesOrderArray.map(
        (el, key) => ({ [el]: key })
      );

      return Object.assign({}, state, {
        modifiedFramesArray,
        fps: action.fps
      });

    case RESET_FRAMES_STATE:
      return Object.assign({}, generateInitialState());

    case UPDATE_FRAMES_SIZE:
      Object.keys(state.framesCollectionObject).forEach(id => {
        framesCollectionObject[id] = {
          name: state.framesCollectionObject[id].name,
          naturalImageData: expandImageData(
            state.framesCollectionObject[id].naturalImageData,
            action.width,
            action.height,
            action.anchor,
            action.stretch
          )
        };
      });

      // update all frames since imageSize changed
      modifiedFramesArray = state.framesOrderArray.map(
        (el, key) => ({ [el]: key })
      );

      return Object.assign({}, state, {
        modifiedFramesArray,
        framesCollectionObject: Object.assign({}, state.framesCollectionObject, framesCollectionObject)
      });

    default:
      return state;
  }
}

export default frames;