'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { closeModal } from 'actions/modals';
import ModalWrapper from 'components/modal-wrapper';
import ModalsShadow from 'components/modals-shadow';
import EditFileTypesModal from 'modals/edit-file-types';
import ProductsSelectModal from 'modals/products-select';
import styles from './modals.scss';

const CSS_DURATION = parseInt(styles.duration.replace('ms', '').replace('s', '000'), 10) || 200;
const Z_INDEX_BASE = parseInt(styles.zIndex, 10) || 2000000;
const Z_INDEX_GAIN = 10;

class Modals extends React.PureComponent {
  static propTypes = {
    modals: PropTypes.array.isRequired,
    closeModal: PropTypes.func.isRequired,
  }

  static modals = {
    EDIT_FILE_TYPES: {
      component: EditFileTypesModal,
      size: 'medium',
    },
    PRODUCTS_SELECT: {
      component: ProductsSelectModal,
      size: 'medium',
    },
  }

  constructor(props) {
    super(props);

    this.closeTopModal = this.closeTopModal.bind(this);
  }

  closeTopModal() {
    const len = this.props.modals.length;

    if (!len) {
      return;
    }

    this.props.closeModal(this.props.modals[len - 1].id);
  }

  makeModals() {
    const modals = this.constructor.modals;
    const ret = [];

    if (this.props.modals.length) {
      ret.push(this.makeCssTransition(
        'shadow',
        'modals_shadow',
        <ModalsShadow
          onClick={this.closeTopModal}
          zIndex={(Z_INDEX_BASE + ((this.props.modals.length - 1) * Z_INDEX_GAIN)) - (Z_INDEX_GAIN / 2)}
        />
      ));
    }

    this.props.modals.forEach((modal, index) => {
      if (modals[modal.type] === undefined) {
        return;
      }

      const Component = modals[modal.type].component;

      let content = (
        <Component
          modalId={modal.id}
          zIndex={Z_INDEX_BASE + (index * Z_INDEX_GAIN)}
          onClose={this.props.closeModal}
          {...modal.props}
        />
      );

      if (modal.wrapped !== false && modals[modal.type].wrapped !== false) {
        content = (
          <ModalWrapper
            modalId={modal.id}
            zIndex={Z_INDEX_BASE + (index * Z_INDEX_GAIN)}
            onClose={this.props.closeModal}
            size={modal.size || modals[modal.type].size || 'auto'}
          >
            {content}
          </ModalWrapper>
        );
      }

      ret.push(this.makeCssTransition('modal', modal.id, content));
    });

    return ret;
  }

  makeCssTransition(type, key, content) {
    return (
      <CSSTransition
        key={key}
        timeout={CSS_DURATION}
        classNames={{
          appear: `__modals-${type}-enter`,
          appearActive: `__modals-${type}-enter-active`,
          enter: `__modals-${type}-enter`,
          enterActive: `__modals-${type}-enter-active`,
          exit: `__modals-${type}-exit`,
          exitActive: `__modals-${type}-exit-active`,
        }}
      >
        {content}
      </CSSTransition>
    );
  }

  render() {
    return (
      <TransitionGroup>
        {this.makeModals()}
      </TransitionGroup>
    );
  }
}

export default connect(
  (state) => {
    return {
      modals: state.modals.list,
    };
  },
  (dispatch) => {
    return {
      closeModal: (id_or_type) => { dispatch(closeModal(id_or_type)); },
    };
  }
)(Modals);
