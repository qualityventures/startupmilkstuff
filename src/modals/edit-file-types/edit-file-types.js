import React from 'react';
import PropTypes from 'prop-types';
import FORMATS_LIST from 'data/files';
import { FormTitle, Alert, Loader, Form, FormLabel, FormCheckbox, FormButton } from 'components/ui';
import apiFetch from 'helpers/api-fetch';

class EditFileTypesModal extends React.PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    file: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      success: false,
      error: false,
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.setRef = this.setRef.bind(this);
    this.checkboxRefs = {};
  }

  componentWillUnmount() {
    this.checkboxRefs = {};
  }

  setRef(e, name) {
    this.checkboxRefs[name] = e;
  }

  handleUpdate() {
    const formats = [];
    const { productId } = this.props;
    const { file_id } = this.props.file;

    Object.keys(FORMATS_LIST).forEach((format) => {
      const input = this.checkboxRefs[format];

      if (!input || !input.checked) {
        return;
      }

      formats.push(format);
    });

    if (!formats.length) {
      this.setState({ error: 'Select at least one file format' });
      return;
    }

    this.setState({ loading: true, error: false });

    apiFetch(`api/products/${productId}/files/${file_id}/formats`, {
      method: 'PATCH',
      payload: { formats },
    }).then((files) => {
      this.setState({ loading: false, success: true });
      this.props.onUpdate(files);
    }).catch((e) => {
      this.setState({ loading: false, error: e || 'Something went wrong' });
    });
  }

  makeError() {
    if (!this.state.error) {
      return null;
    }

    return (
      <FormLabel>
        <Alert type="danger">{this.state.error}</Alert>
      </FormLabel>
    );
  }

  makeTypes() {
    const types = {};
    const ret = [];

    if (this.props.file.types) {
      this.props.file.types.forEach((type) => {
        types[type] = true;
      });
    }

    Object.keys(FORMATS_LIST).forEach((format) => {
      ret.push(
        <FormCheckbox
          key={format}
          name={format}
          checked={!!types[format]}
          title={format}
          setRef={this.setRef}
        />
      );
    });

    return (
      <FormLabel>
        {ret}
      </FormLabel>
    );
  }

  makeSuccess() {
    if (!this.state.success) {
      return null;
    }

    return (
      <FormLabel>
        <Alert>File formats was successfully updated</Alert>
      </FormLabel>
    );
  }

  makeLoader() {
    if (!this.state.loading) {
      return null;
    }

    return (
      <FormLabel>
        <Loader />
      </FormLabel>
    );
  }

  makeButton() {
    if (this.state.loading) {
      return null;
    }

    return (
      <FormLabel>
        <FormButton onClick={this.handleUpdate}>Update types</FormButton>
      </FormLabel>
    );
  }

  render() {
    return (
      <Form>
        <FormLabel>
          <FormTitle>{this.props.file.name}</FormTitle>
        </FormLabel>
        {this.makeSuccess()}
        {this.makeLoader()}
        {this.makeError()}
        {this.makeTypes()}
        {this.makeButton()}
      </Form>
    );
  }
}

export default EditFileTypesModal;
