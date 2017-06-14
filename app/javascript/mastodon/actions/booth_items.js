import api from '../api';

export const BOOTH_ITEM_FETCH_REQUEST = 'BOOTH_ITEM_FETCH_REQUEST';
export const BOOTH_ITEM_FETCH_SUCCESS = 'BOOTH_ITEM_FETCH_SUCCESS';
export const BOOTH_ITEM_FETCH_FAIL    = 'BOOTH_ITEM_FETCH_FAIL';

export function fetchBoothItem(id) {
  return (dispatch, getState) => {
    if (getState().getIn(['booth_items', id], null) !== null) {
      return;
    }

    dispatch(fetchBoothItemRequest(id));

    api(getState).get(`/api/v1/booth_items/${id}`).then(response => {
      if (!response.data.body.url) {
        return;
      }

      dispatch(fetchBoothItemSuccess(id, response.data.body));
    }).catch(error => {
      dispatch(fetchBoothItemFail(id, error));
    });
  };
};

export function fetchBoothItemRequest(id) {
  return {
    type: BOOTH_ITEM_FETCH_REQUEST,
    id,
    skipLoading: true,
  };
};

export function fetchBoothItemSuccess(id, booth_item) {
  return {
    type: BOOTH_ITEM_FETCH_SUCCESS,
    id,
    booth_item,
    skipLoading: true,
  };
};

export function fetchBoothItemFail(id, error) {
  return {
    type: BOOTH_ITEM_FETCH_FAIL,
    id,
    error,
    skipAlert: true,
  };
};
