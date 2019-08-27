import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Alert, Catalog, CatalogItem } from 'components/ui';
import FORMATS_LIST from 'data/files';
import { openModal } from 'actions/modals';
import { connect } from 'react-redux';
import axios from 'axios';
import './files-manager.scss';

class FilesManager extends React.PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    files: PropTypes.array,
    openModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    files: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      files: props.files,
      progress: 0,
    };

    this.ref_input = false;

    this.setRefInput = this.setRefInput.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.editTypes = this.editTypes.bind(this);
    this.updateFiles = this.updateFiles.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.files !== this.props.files) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({ files: this.props.files });
    }
  }

  componentWillUnmount() {
    this.ref_input = false;
  }

  onUpload(e) {
    e.preventDefault();

    const files = e.target.files || false;

    if (this.state.loading) return;
    if (!files || !files.length) return;

    this.addUpload(files[0]);
  }

  setRefInput(c) {
    this.ref_input = c;
  }

  addUpload(file) {
    const formData = new FormData();

    formData.append('upload', file);
    formData.append('productId', this.props.productId);

    this.setState({ loading: true, error: false, progress: 0 });

    axios
      .request(`/api/products/${this.props.productId}/files/`, {
        credentials: 'include',
        mode: 'cors',
        method: 'POST',
        data: formData,
        responseType: 'json',
        onUploadProgress: (p) => {
          console.log(p.loaded / p.total);
          this.setState({ progress: Math.round((p.loaded / p.total) * 100) });
        },
      })
      .then((response) => {
        const files = response.data;
        this.setState({ loading: false, files: [...files] });
      })
      .catch((err) => {
        console.log(err);
        const error = err && err.toString ? err.toString() : 'Bad response from server';
        this.setState({ error, loading: false });
      });
  }

  toggleUpload() {
    if (this.state.loading) {
      return;
    }

    if (this.ref_input) {
      this.ref_input.click();
    }
  }

  updateFiles(files) {
    this.setState({ files: [...files] });
  }

  editTypes(e) {
    const file_id = e.target.getAttribute('file_id');
    let data = null;

    this.state.files.forEach((file) => {
      if (file.file_id !== file_id) {
        return;
      }

      data = file;
    });

    if (!data) {
      return;
    }

    this.props.openModal({
      type: 'EDIT_FILE_TYPES',
      props: {
        productId: this.props.productId,
        file: data,
        onUpdate: this.updateFiles,
      },
    });
  }

  deleteFile(e) {
    if (this.state.loading) {
      return;
    }

    const file_id = e.target.getAttribute('file_id');

    this.setState({ loading: true, error: false });

    fetch(`/api/products/${this.props.productId}/files/delete`, {
      credentials: 'include',
      mode: 'cors',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file_id }),
    })
      .then((response) => {
        return response.json().then(json => ({ json, response }));
      })
      .then(({ json, response }) => {
        if (json.error) return Promise.reject(json.error);
        if (response.status !== 200) return Promise.reject('invalid server response');
        return json;
      })
      .then((files) => {
        this.setState({ loading: false, files: [...files] });
      })
      .catch((err) => {
        const error = err && err.toString ? err.toString() : 'Bad response from server';
        this.setState({ error, loading: false });
      });
  }

  makeFiles() {
    const { productId } = this.props;

    return this.state.files.map((file, index) => {
      const style = {};

      if (FORMATS_LIST[file.type]) {
        style.color = FORMATS_LIST[file.type].color;
      }

      const buttons = [
        <span key="types" file_id={file.file_id} onClick={this.editTypes} className="files-manager__small-button">
          Formats
        </span>,
        <span key="delete" file_id={file.file_id} onClick={this.deleteFile} className="files-manager__small-button">
          x
        </span>,
      ];

      return (
        <CatalogItem
          key={file.file_id}
          smallButtons={buttons}
          files={file.types}
          bigButton={
            <a href={`/api/download/${productId}/${file.file_id}`} style={style} target="_blank" rel="noopener noreferrer">
              <img src={'/static/images/download.svg'} />
              <div className="black">{file.name}</div>
            </a>
          }
        />
      );
    });
  }

  makeError() {
    const { error } = this.state;

    if (!error) {
      return null;
    }

    return (
      <div>
        <Alert type="danger">{error}</Alert>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.makeError()}
        <input type="file" className="files-manager__input" encType="multipart/form-data" ref={this.setRefInput} onChange={this.onUpload} />
        <Catalog>
          {this.makeFiles()}

          <CatalogItem
            bigButton={
              this.state.loading ? (
                <div>
                  {' '}
                  <Loader /> <div>{this.state.progress} %</div>
                </div>
              ) : (
                <span>+</span>
              )
            }
            onBigButtonClick={this.toggleUpload}
          />
        </Catalog>
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    return {};
  },
  (dispatch) => {
    return {
      openModal: (data) => {
        return dispatch(openModal(data));
      },
    };
  }
)(FilesManager);
