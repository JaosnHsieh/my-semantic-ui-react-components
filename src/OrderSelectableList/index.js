import React, { Component } from "react";
import PropTypes from "prop-types";
import LeftItems from "./LeftItems";
import RightItems from "./RightItems";

class OrderSelectableList extends Component {
  state = {
    leftItems: this.props.leftItems || [],
    rightItems: this.props.rightItems || []
  };
  onLeftItemsChanged = items => {
    this.setState({ leftItems: items });
  };
  onLeftItemMoved = item => {
    this.setState({ rightItems: this.state.rightItems.concat(item) });
  };
  onRightItemsChanged = items => {
    this.setState({ rightItems: items });
  };
  onRightItemRemoved = item => {
    this.setState({ leftItems: this.state.leftItems.concat(item) });
  };
  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.leftItems !== prevState.leftItems) {
      this.props.onLeftItemsChanged(this.state.leftItems);
    }
    if (this.state.rightItems !== prevState.rightItems) {
      this.props.onRightItemsChanged(this.state.rightItems);
    }
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <LeftItems
          items={this.state.leftItems}
          // searchProperties={["id", "name"]}
          // title={"title"}
          // renderTitle={() => <div>render title</div>}
          // searchInputPlaceHolder={"placholder...."}
          // renderItem,
          // itemValuePropertyName={"name"}
          {...this.props.leftItemsProps}
          onItemsChanged={this.onLeftItemsChanged}
          onItemMoved={this.onLeftItemMoved}
        />
        <RightItems
          items={this.state.rightItems}
          // title={"right title"}
          // renderTitle={()=>{}}
          // searchProperties={["id", "name"]}
          // renderTitle={() => <div>render title</div>}
          // searchInputPlaceHolder={"placholder...."}
          // onInputChange={() => alert("on input change")}
          // renderItem,
          // renderSelectdToolBar={({moveButtonGroup, activeItem, activeItemIndex})=>(<div></div>)}
          {...this.props.rightItemsProps}
          // itemValuePropertyName={"name"}
          onItemsChanged={this.onRightItemsChanged}
          onItemRemoved={this.onRightItemRemoved}
        />
      </div>
    );
  }
}

OrderSelectableList.propTypes = {
  leftItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  onLeftItemsChanged: PropTypes.func.isRequired,
  leftItemsProps: PropTypes.object, // refer to LeftItems props def
  rightItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRightItemsChanged: PropTypes.func.isRequired,
  rightItemsProps: PropTypes.object // refer to RightItems props defs
};

OrderSelectableList.defaultPropTypes = {
  leftItemsProps: {},
  rightItemsProps: {}
};

export default OrderSelectableList;

export const Usage = class Usage extends Component {
  state = {
    leftItems: [
      { id: 1, name: "name1" },
      { id: 2, name: "name2" },
      { id: 3, name: "name3" }
    ],
    rightItems: [{ id: 5, name: "name5" }, { id: 6, name: "name6" }]
  };
  render() {
    return (
      <OrderSelectableList
        leftItems={this.state.leftItems}
        onLeftItemsChanged={items => {
          this.setState({ leftItems: items }, () => {
            console.log("on left items changed items", items);
          });
        }}
        leftItemsProps={{ title: "left title", itemValuePropertyName: "name" }}
        rightItems={this.state.rightItems}
        onRightItemsChanged={items => {
          this.setState({ rightItems: items }, () => {
            console.log("on right items changed items", items);
          });
        }}
        rightItemsProps={{
          renderTitle: () => (
            <span>Total got {`${this.state.rightItems.length}`}</span>
          ),
          renderItem: (item, index) => (
            <div>
              <span>{`No. ${index + 1}`}</span>
              {`@_@ ${item.id} ${item.name} @_@`}
            </div>
          )
        }}
      />
    );
  }
};
