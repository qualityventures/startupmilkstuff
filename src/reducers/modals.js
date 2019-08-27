import { CLOSE_MODAL, OPEN_MODAL } from 'actions/modals';

const initialState = {
  next_id: 1,
  list: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL: {
      const newState = { ...state };
      newState.list = [...newState.list];

      if (action.replace) {
        let index = 0;

        for (; index < newState.list.length; ++index) {
          if (newState.list[index].type !== action.modal_type) {
            ++index;
            continue;
          }

          newState.list.splice(index, 1);
        }
      }

      newState.next_id++;

      newState.list.push({
        id: `modal_${newState.next_id}`,
        type: action.modal_type,
        props: action.props,
        wrapped: action.wrapped,
      });

      return newState;
    }

    case CLOSE_MODAL: {
      const newState = { ...state };
      newState.list = [...newState.list];

      let index = 0;

      for (; index < newState.list.length; ++index) {
        if (newState.list[index].type !== action.id_or_type && newState.list[index].id !== action.id_or_type) {
          index++;
          continue;
        }

        newState.list.splice(index, 1);
      }

      return newState;
    }

    default: {
      return state;
    }
  }
}
