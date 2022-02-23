import {StyleSheet} from 'react-native';
import {colors} from '../../styles/variables.js';

export default StyleSheet.create({
  app: {
    flex: 1,
    // width: '100%',
    // height: '100%',
    backgroundColor: colors.paleblue,
  },
  appContent: {
    flexGrow: 1,
    flexDirection: 'row',
    // width: '100%',
    // height: '100%',
    position: 'relative',
  },
});
