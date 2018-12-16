import React from "react";
import PropTypes from "prop-types";

class Overlay extends React.Component {
  render() {
    const {
      children,
      isOn = false,
      isBlurOn = true,
      backgroundColor = "rgba(200,200,200,.2)"
    } = this.props;
    return (
      <div
        style={{ position: "relative" }}
        className={isBlurOn ? "svg-blur" : ""}
      >
        <style>
          {`
            .svg-blur { filter: url(#wherearemyglasses); }
          `}
        </style>
        <svg height="0">
          <defs>
            <filter id="wherearemyglasses" x="0" y="0">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            </filter>
          </defs>
        </svg>
        {this.props.isOn && (
          <div
            style={{
              position: "absolute",
              backgroundColor: backgroundColor,
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              color: "black",
              textAlign: "center",
              zIndex: 1000000
            }}
          />
        )}

        {children}
      </div>
    );
  }
}

Overlay.propTypes = {
  isOn: PropTypes.bool.isRequired,
  isBlurOn: PropTypes.bool,
  backgroundColor: PropTypes.string
};
Overlay.defaultProps = {
  isOn: false,
  isBlurOn: true,
  backgroundColor: "rgba(200,200,200,.2)"
};
export default Overlay;

export const Usage = class Usage extends React.Component {
  state = {
    isOn: true
  };
  componentDidMount() {
    console.log("Overlay Usage didMount");
    // setInterval(() => {
    //   this.setState({ isOn: !this.state.isOn });
    // }, 2000);
  }
  render() {
    return (
      <Overlay isOn={this.state.isOn}>something going to be overlayed.</Overlay>
    );
  }
};
