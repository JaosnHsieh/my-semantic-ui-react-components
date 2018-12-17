import React from "react";
import ReactDOM from "react-dom";
import "canvas-datagrid";

class CanvasDatagrid extends React.Component {
  constructor(props) {
    super(props);
  }
  updateAttributes(nextProps) {
    Object.keys(this.props).forEach(key => {
      if (!nextProps || this.props[key] !== nextProps[key]) {
        if (this.grid.attributes[key] !== undefined) {
          this.grid.attributes[key] = nextProps
            ? nextProps[key]
            : this.props[key];
        } else {
          this.grid[key] = nextProps ? nextProps[key] : this.props[key];
        }
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    this.updateAttributes(nextProps);
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    this.grid.dispose();
  }
  componentDidMount() {
    var args = {};
    this.grid = ReactDOM.findDOMNode(this);
    this.updateAttributes();
  }
  render() {
    return React.createElement("canvas-datagrid", {});
  }
}

export default CanvasDatagrid;

function getRandomData() {
  return [
    {
      foo: Math.random(),
      bar: Math.random(),
      baz: Math.random()
    }
  ];
}

export const Usage = class GenerateRandomDataButton extends React.Component {
  state = { data: getRandomData() };
  setData = data => {
    this.setState({ data });
  };
  render() {
    return (
      <div style={{ height: "300px" }}>
        <CanvasDatagrid data={this.state.data} />
        <button
          onClick={() => {
            this.setData(getRandomData());
          }}
        >
          {" "}
          Generate random data{" "}
        </button>
      </div>
    );
  }
};
