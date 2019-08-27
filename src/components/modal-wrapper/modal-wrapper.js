import React from 'react';
import PropTypes from 'prop-types';
import './modal-wrapper.scss';

class ModalWrapper extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    size: PropTypes.oneOf(['big', 'medium', 'small', 'auto']),
    onClose: PropTypes.func,
    modalId: PropTypes.string,
    zIndex: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.bool,
    ]),
  }

  static defaultProps = {
    children: null,
    size: 'auto',
    zIndex: false,
    onClose: null,
    modalId: '',
  }

  constructor(props) {
    super(props);

    this.handleWrapperClick = this.handleWrapperClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleWrapperClick(e) {
    if (e.target.className !== 'modal-wrapper') {
      return;
    }

    this.closeModal();
  }

  closeModal() {
    if (!this.props.onClose || !this.props.modalId) {
      return;
    }

    this.props.onClose(this.props.modalId);
  }

  render() {
    const props = {
      style: {},
      className: 'modal-wrapper',
      onClick: this.handleWrapperClick,
    };

    if (this.props.zIndex) {
      props.style.zIndex = this.props.zIndex;
    }

    return (
      <div {...props}>
        <div className={`modal-wrapper-container modal-wrapper-container--${this.props.size}`}>
          {this.props.children}
        </div>
        <div className="modal-wrapper-close" onClick={this.closeModal}>
          x
        </div>
      </div>
    );
  }
}

export default ModalWrapper;
