import React, { Component } from "react";
import PropTypes from "prop-types";
import LeftItems from "./LeftItems";
import RightItems from "./RightItems";
import { defaultTotalHeight, defaultRightToolBarHeight } from "./constants";

class OrderableList extends Component {
  onLeftItemsChanged = items => {
    this.props.onLeftItemsChanged(items);
  };
  onLeftItemMoved = item => {
    this.props.onRightItemsChanged(this.props.rightItems.concat(item));
  };
  onRightItemsChanged = items => {
    this.props.onRightItemsChanged(items);
  };
  onRightItemRemoved = item => {
    this.props.onLeftItemsChanged(this.props.leftItems.concat(item));
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <LeftItems
          items={this.props.leftItems}
          // searchProperties={["id", "name"]}
          // title={"title"}
          // renderTitle={() => <div>render title</div>}
          // searchInputPlaceHolder={"placholder...."}
          // renderItem,
          // itemValuePropertyName={"name"}
          {...this.props.leftItemsProps}
          totalHeight={this.props.totalHeight || defaultTotalHeight}
          onItemsChanged={this.onLeftItemsChanged}
          onItemMoved={this.onLeftItemMoved}
        />
        <RightItems
          items={this.props.rightItems}
          // title={"right title"}
          // renderTitle={()=>{}}
          // searchProperties={["id", "name"]}
          // renderTitle={() => <div>render title</div>}
          // searchInputPlaceHolder={"placholder...."}
          // onInputChange={() => alert("on input change")}
          // renderItem,
          // itemValuePropertyName={"name"}
          {...this.props.rightItemsProps}
          renderSelectedToolBar={this.props.renderSelectedToolBar}
          rightToolBarHeight={
            this.props.rightToolBarHeight || defaultRightToolBarHeight
          }
          totalHeight={this.props.totalHeight || defaultTotalHeight}
          onItemsChanged={this.onRightItemsChanged}
          onItemRemoved={this.onRightItemRemoved}
        />
      </div>
    );
  }
}

OrderableList.propTypes = {
  leftItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  onLeftItemsChanged: PropTypes.func.isRequired,
  leftItemsProps: PropTypes.object, // refer to LeftItems props def
  rightItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRightItemsChanged: PropTypes.func.isRequired,
  rightItemsProps: PropTypes.object, // refer to RightItems props defs,
  totalHeight: PropTypes.number,
  rightToolBarHeight: PropTypes.number,
  renderSelectedToolBar: PropTypes.func // renderSelectedToolBar={({moveButtonGroup, activeItem, activeItemIndex})=>(<div></div>)}
};

OrderableList.defaultPropTypes = {
  leftItemsProps: {},
  rightItemsProps: {}
};

export default OrderableList;

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
      <OrderableList
        totalHeight={500}
        rightToolBarHeight={200}
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
        renderSelectedToolBar={({
          moveButtonGroup,
          activeItem,
          activeItemIndex
        }) => (
          <div style={{ padding: "10px" }}>
            <h2>{activeItem.name}</h2>
            <button
              onClick={() => {
                this.setState(prevState => ({
                  rightItems: [
                    ...prevState.rightItems.slice(0, activeItemIndex),
                    { ...activeItem, name: Math.random() },
                    ...prevState.rightItems.slice(activeItemIndex + 1)
                  ]
                }));
              }}
            >
              Change name
            </button>
            {moveButtonGroup}
          </div>
        )}
        rightItemsProps={{
          renderTitle: () => (
            <span>Total got {`${this.state.rightItems.length}`}</span>
          ),
          renderItem: (item, index) => (
            <span>
              <span>{`No. ${index + 1}`}</span>
              {`@_@ ${item.id} ${item.name} @_@`}
            </span>
          )
        }}
      />
    );
  }
};
