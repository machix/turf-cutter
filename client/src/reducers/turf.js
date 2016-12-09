function turf(state = {
  isFetching: false,
  data: []
}, action) {
  switch (action.type) {
    case 'REQUEST_TURF':
      return { ...state,
        isFetching: true
      };
    case 'RECEIVE_TURF':
      return { ...state,
        isFetching: false,
        data: action.turf
      };
    case 'CREATE_TURF':
      return { ...state,
        data: [...state.data,
          { ...action.newTurf }
        ]
      };
    case 'SELECT_TURF':
      return { ...state,
        data: state.data.map((t) => {
          if (t._id === action.selectedTurf._id &&
            (t.editable === false || !t.editable)) {
            return { ...t, editable: true };
          }
          return { ...t, editable: false };
        })
      };
    case 'EDIT_TURF': {
      const i = action.index;
      return { ...state,
        data: [
          // get array from start up to one we want to delete
          ...state.data.slice(0, i),
          // // replace with edited turf
          { ...state.data[i], path: action.newPath, editable: true },
          // // get array from after one we want to delete
          ...state.data.slice(i + 1)
        ]
      };
    }
    default:
      return state;
  }
}

export default turf;
