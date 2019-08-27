export const CLOSE_MODAL = 'MODAL_CLOSE';
export const OPEN_MODAL = 'MODAL_OPEN';

export function openModal(modal) {
  return {
    type: OPEN_MODAL,
    props: modal.props || {},
    modal_type: modal.type,
    replace: modal.replace === undefined ? true : !!modal.replace,
    wrapped: modal.wrapped === undefined ? true : !!modal.wrapped,
  };
}

export function closeModal(id_or_type) {
  return { type: CLOSE_MODAL, id_or_type };
}
