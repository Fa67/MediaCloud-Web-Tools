import { SELECT_MEDIAPICKER_QUERY_ARGS, RESET_MEDIAPICKER_QUERY_ARGS } from '../../../actions/systemActions';
// import { PICK_COLLECTION, PICK_SOURCE, ADVANCED  } from '../../../../lib/explorerUtil';

const INITIAL_STATE = null;

function selectMediaQuery(state = INITIAL_STATE, action) {
  const updatedState = null;
  switch (action.type) {
    case SELECT_MEDIAPICKER_QUERY_ARGS:
      if (action.payload) { // searchId will not be present as this was a keyword search... index should be set on front end when parsing JSON keywords
        const args = action.payload;
        return { args };
      }
      return updatedState;
    case RESET_MEDIAPICKER_QUERY_ARGS:
      return { type: 0, mediaKeyword: null };
    default:
      return state;
  }
}

export default selectMediaQuery;
