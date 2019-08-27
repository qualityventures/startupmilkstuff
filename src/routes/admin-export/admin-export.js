import React from 'react';
import {
  FormTitle,
  FormButton,
  Content,
} from 'components/ui';
import './admin-export.scss';

class RouteAdminExport extends React.PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.handleDownloadCSVEmails = this.handleDownloadCSVEmails.bind(this);

    this.getUserEmails = this.getUserEmails.bind(this);
  }
  state = {
    emails: [],
    emailCount: 0,
    page: 0,
    filter: 'all',
  }

  componentDidMount() {
    this.getUserEmails('all', 0);
  }
  getUserEmailCount(filter) {
    fetch(`/api/user/users-count?filter=${filter}`).then((response) => {
      response.json().then((json) => {
        this.setState({ emailCount: json });
      });
    }).catch((e) => {
      this.setState({ emailCount: 0 });
    });
  }
  getUserEmails(filter, page) {
    this.getUserEmailCount(filter);
    fetch(`/api/user/users?page=${page || 0}&filter=${filter}`)
      .then((response) => {
        response.json().then((json) => {
          this.setState({ emails: json });
        });
      })
      .catch((e) => {
        this.setState({ emails: [] });
      });
  }

  handleDownloadCSVEmails() {
    window.open('/api/export/csv-emails', '_blank');
  }

  renderPagination() {
    const { emailCount, page, filter } = this.state;
    const children = [];
    for (let i = 0; i <= emailCount / 20; i++) {
      children.push(
        <div
          className={`${page === i ? 'active' : ''} `}           
          onClick={() => {
            this.setState({
              page: i,
            });
            this.getUserEmails(filter, i); 
          }}
        >
          {i + 1}
        </div>
      );
    }
    return <div className="pagination flex justify-center mt2">{children}</div>;
  }
  
  render() {
    const { emails, filter } = this.state;
    return (
      <Content className="admin-exports">
        <div className="top-bar flex items-center">
          <FormTitle>Export CSV</FormTitle>
          <div className="filters mx-auto flex items-center">
            <div
              className={`${filter === 'all' ? 'active' : ''}`}
              onClick={() => {
                this.getUserEmails('all', 0);
                this.setState({ filter: 'all', page: 0 });
              }}
            >All
            </div>
            <div
              className={`${filter === 'paid' ? 'active' : ''}`}
              onClick={() => {
                this.getUserEmails('paid', 0);
                this.setState({ filter: 'paid', page: 0 });
              }}
            >Paid</div>
            <div
              className={`${filter === 'free' ? 'active' : ''}`}
              onClick={() => {
                this.getUserEmails('free', 0);
                this.setState({ filter: 'free', page: 0 });
              }}
            >Free</div>
            <div
              className={`${filter === 'newsletter' ? 'active' : ''}`}
              onClick={() => {
                this.getUserEmails('newsletter', 0);
                this.setState({ filter: 'newsletter', page: 0 });
              }}
            >Newsletter Subscriber</div>
          </div>
          <FormButton onClick={this.handleDownloadCSVEmails}>
            Export
          </FormButton>
        </div>
        <div className="mt2">
          {emails.map((e) => {
            return (
              <div className="customer flex items-center">
                <div className="email col-6 col-lg-3">{e.email}</div>
                <div className="flex labels col-6 col-lg-9">
                  { e.have_paid
                    ? <div className="user-label paid">Paid User</div>
                    : <div className="user-label free">Free User</div>}
                  { e.subscribe ?
                    <div className="user-label sub">Newsletter Subscriber</div> : null}
                </div>
              </div>
            );
          })}
        </div>
        { this.renderPagination()}
      </Content>
    );
  }
}

export default RouteAdminExport;
