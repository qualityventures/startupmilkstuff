import React from 'react';
import PropTypes from 'prop-types';
import './extra-fintech-startup.scss';

class ExtraFintechStartup extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  makeIcons() {
    const ret = [];

    for (let i = 1; i <= 16; ++i) {
      ret.push(<span className={`efs__icon efs__icon--${i}`} key={i} />);
    }

    return ret;
  }

  makeFlags() {
    const ret = [];

    for (let i = 1; i <= 30; ++i) {
      ret.push(<span className={`efs__flag efs__flag--${i}`} key={i} />);
    }

    return ret;
  }

  render() {
    return (
      <div className="efs__container">
        <div className="efs__watch">
          <div className="efs__watch-icons">
            <div className="efs__watch-icon efs__watch-icon--sketch" />
            <div className="efs__watch-icon efs__watch-icon--apple" />
          </div>

          <div className="efs__watch-title">Crafted especially for fintech startups</div>

          <a className="efs__watch-button" href={this.props.data.youtube || ''} target="_blank" rel="noopener noreferrer">
            Watch Video
          </a>
        </div>

        <div className="efs__box efs__box--big">
          <div className="efs__box-normal-title">
            Use it like constructor
            <br />
            and build your fintech
            <br />
            app in a few clicks
          </div>

          <div className="efs__box-list">
            <div className="efs__box-desc">
              Onboarding
              <br />
              screens
            </div>
            <div className="efs__box-desc">
              Sign Up
              <br />
              &amp;Sign In
            </div>
            <div className="efs__box-desc">
              Bank
              <br />
              Cards
            </div>
            <div className="efs__box-seaparator" />
            <div className="efs__box-desc">
              Input
              <br />
              Fields
            </div>
            <div className="efs__box-desc">
              Charts &amp;
              <br />
              Graphs
            </div>
            <div className="efs__box-desc">
              Exchange
              <br />
              screens
            </div>
          </div>
        </div>

        <div className="efs__box efs__box--1">
          <div className="efs__box-big-title">36</div>
          <div className="efs__box-list">
            <div className="efs__box-desc">
              Symbol based
              <br />
              screens
            </div>
          </div>
        </div>

        <div className="efs__box efs__box--2">
          <div className="efs__box-normal-title">
            Easy customizable
            <br />
            and flexible
          </div>
          <div className="efs__box-list">
            <div className="efs__box-desc">
              Well
              <br />
              organized
            </div>
            <div className="efs__box-desc">
              Build for
              <br />
              iPhone X
            </div>
          </div>
        </div>

        <div className="efs__box efs__box--3">
          <div className="efs__box-big-title">3</div>
          <div className="efs__box-list">
            <div className="efs__box-desc">
              Color
              <br />
              Schemes
            </div>
          </div>
        </div>

        <div className="efs__box efs__box--4">
          <div className="efs__box-big-title">18</div>
          <div className="efs__box-list">
            <div className="efs__box-desc">
              Interface
              <br />
              icons
            </div>
          </div>
        </div>

        <div className="efs__box efs__box--5">
          <div className="efs__box-big-title">100%</div>
          <div className="efs__box-list">
            <div className="efs__box-desc">
              Vector
              <br />
              icons
            </div>
          </div>
        </div>

        <div className="efs__box efs__box--6">
          <div className="efs__box-big-title">1x</div>
          <div className="efs__box-list">
            <div className="efs__box-desc">
              Mocks
              <br />
              resolution
            </div>
          </div>
        </div>

        <div className="efs__box efs__box--7">
          <div className="efs__box-big-title">SF Pro</div>
          <div className="efs__box-list">
            <div className="efs__box-desc">
              Default
              <br />
              iOS font
            </div>
          </div>
        </div>

        <div className="efs__box efs__box--8">
          <div className="efs__box-big-title">
            400<span>MB</span>
          </div>
          <div className="efs__box-list">
            <div className="efs__box-desc">
              Total
              <br />
              size
            </div>
          </div>
        </div>

        <div className="efs__box efs__box--9">
          <div className="efs__box-normal-title">
            UI Interactions
            <br />
            Included in After Effects
          </div>
        </div>

        <div className="efs__big-phone" />
        <div className="efs__phone efs__phone--1" />
        <div className="efs__phone efs__phone--2" />
        <div className="efs__phone efs__phone--3" />
        <div className="efs__phone efs__phone--4" />
        <div className="efs__phone efs__phone--5" />
        <div className="efs__phone efs__phone--6" />
        <div className="efs__phone efs__phone--7" />
        <div className="efs__phone efs__phone--8" />
        <div className="efs__phone efs__phone--9" />
        <div className="efs__phone efs__phone--10" />

        <div className="efs__card efs__card--1">
          <div className="efs__card-title">
            16 category icons
            <br />
            included
          </div>

          <div className="efs__card-spring" />

          <div className="efs__card-icons">{this.makeIcons()}</div>
        </div>

        <div className="efs__card efs__card--2">
          <div className="efs__card-title">
            196 country flags
            <br />
            included
          </div>

          <div className="efs__card-spring" />

          <div className="efs__card-flags">{this.makeFlags()}</div>
        </div>

        <div className="efs__card efs__card--3">
          <div className="efs__card-title">Overview</div>

          <div className="efs__card-desc">Fintech Kit – the best way to build your own fintech app.</div>

          <div className="efs__card-spring" />
          <div className="efs__card-line" />

          <div className="efs__card-info">
            <div className="efs__card-info-1">
              Compatible
              <br />
              with Sketch
            </div>

            <div className="efs__card-info-2">
              400 MB
              <br />
              in 3 files
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ExtraFintechStartup;
