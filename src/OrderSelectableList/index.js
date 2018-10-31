import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Header,
  Progress,
  Icon,
  Segment,
  Input,
  Dropdown,
  List,
  Message,
  Form,
  Label,
  Button,
  Popup
} from "semantic-ui-react";
import _ from "lodash";
import LazyInput from "../LazyInput";
import { orderableListTotalHeight, rightFunctionBarHeight } from "./constants";
import LeftItems from "./LeftItems";
import { filterByMultiProperties, moveArrayElement } from "../utils";
import { CLIENT_RENEG_WINDOW } from "tls";

class RightItems extends Component {
  state = {
    searchKeyword: "",
    activeSelectedItemIndex: null
  };
  onInputChange = value => {
    console.log("oninput change");
    this.setState({ searchKeyword: value });
  };

  onItemSelect = (item, index) => {
    this.setState({ activeSelectedItemIndex: index });
  };
  onItemRemove = (item, index) => {
    const { items, onItemsChanged, onItemRemoved } = this.props;
    const updatedItems = items.slice(0, index).concat(items.slice(index + 1));
    console.log("onItemRemove");
    this.setState(
      {
        activeSelectedItemIndex: null
      },
      () => {
        console.log("onItemRemove updated", this.state.activeSelectedItemIndex);
        onItemsChanged(updatedItems);
        onItemRemoved(item);
      }
    );
  };
  moveActiveSelectedTo = position => () => {
    const { onItemsChanged } = this.props;
    const { activeSelectedItemIndex: i } = this.state;
    switch (position) {
      case "top":
        const { items: asa, dsadas } = moveArrayElement.top(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      case "up":
        const { items: newItems, itemIndex } = moveArrayElement.up(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      case "down":
        const { items: newItems, itemIndex } = moveArrayElement.down(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      case "bottom":
        const { items: newItems, itemIndex } = moveArrayElement.bottom(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      default:
        return;
    }
  };

  render() {
    const {
      items = [],
      title,
      renderTitle,
      inputValue = "",
      searchInputPlaceHolder = "",
      itemValuePropertyName,
      renderItem,
      onItemsChanged,
      renderSelectedToolBar,
      searchProperties,
      renderSelectdToolBar
    } = this.props;
    const { searchKeyword } = this.state;
    const searchedItems = filterByMultiProperties(
      items,
      searchKeyword,
      searchProperties
    );
    console.log(
      "this.state.activeSelectedItemIndex",
      this.state.activeSelectedItemIndex
    );
    const isSelected = !_.isNil(this.state.activeSelectedItemIndex);
    const moveButtonGroup = (
      <Button.Group fluid>
        <Popup
          trigger={
            <Button
              onClick={this.moveActiveSelectedTo("top")}
              icon="angle double up"
              circular
            />
          }
          content="Move to top"
        />
        <Popup
          trigger={
            <Button
              onClick={this.moveActiveSelectedTo("up")}
              icon="angle up"
              circular
            />
          }
          content="Move up"
        />
        <Popup
          trigger={
            <Button
              onClick={this.moveActiveSelectedTo("down")}
              icon="angle down"
              circular
            />
          }
          content="Move down"
        />
        <Popup
          trigger={
            <Button
              onClick={this.moveActiveSelectedTo("bottom")}
              icon="angle double down"
              circular
            />
          }
          content="Move to bottom"
        />
      </Button.Group>
    );
    return (
      <div style={{ flex: 1 }}>
        <Segment attached textAlign="right" style={{ borderLeft: 0 }}>
          {title && title}
          {renderTitle && renderTitle()}
        </Segment>

        <LazyInput
          as={Input}
          time={200}
          onChange={this.onInputChange}
          value={this.state.searchKeyword}
          fluid
          icon="search"
          iconPosition="left"
          placeholder={searchInputPlaceHolder}
        />

        {isSelected && (
          <div
            style={{
              height: `${rightFunctionBarHeight}px`,
              borderBottom: 0
            }}
          >
            {renderSelectdToolBar
              ? renderSelectdToolBar({
                  moveButtonGroup,
                  activeItem: this.props.items[
                    this.state.activeSelectedItemIndex
                  ]
                })
              : moveButtonGroup}
          </div>
        )}

        <Segment
          style={{
            marginTop: 0,
            height: `${orderableListTotalHeight}px`,
            maxHeight: `${orderableListTotalHeight}px`,
            overflow: "auto"
          }}
        >
          <List selection divided animated>
            {searchedItems.length === 0 && (
              <Message style={{ margin: "20px" }}>
                {"No Matched Item to display"}
              </Message>
            )}
            {searchedItems.map((item, i) => (
              <List.Item
                key={i}
                active={this.state.activeSelectedItemIndex === i}
                onClick={() => {
                  this.onItemSelect(item, i);
                }}
              >
                <List.Content
                  floated="right"
                  style={{ cursor: "pointer" }}
                  onClick={e => {
                    e.stopPropagation(); // for prevent event bubbling
                    this.onItemRemove(item, i);
                  }}
                >
                  <List.Header>
                    <Icon name="minus" circular />
                  </List.Header>
                </List.Content>
                <Icon name="list" />
                <List.Content>
                  <List.Header>
                    {itemValuePropertyName && item[itemValuePropertyName]}
                    {renderItem && renderItem(item, i)}
                  </List.Header>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Segment>
      </div>
    );
  }
}

LeftItems.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string,
  renderTitle: PropTypes.func,
  inputValue: PropTypes.string,
  searchInputPlaceHolder: PropTypes.string,
  itemValuePropertyName: PropTypes.string,
  renderItemValue: PropTypes.func,
  searchProperties: PropTypes.arrayOf(PropTypes.string),
  onItemsChanged: PropTypes.func.isRequired,
  onItemRemoved: PropTypes.func,
  renderSelectdToolBar: PropTypes.func
};
LeftItems.defaultProps = {
  items: [],
  searchInputPlaceHolder: "Search...",
  itemValuePropertyName: PropTypes.string,
  renderItemValue: PropTypes.func,
  searchProperties: []
};

class OrderSelectableList extends Component {
  state = {
    leftItems: [
      { id: 1, name: "name1" },
      { id: 2, name: "name2" },
      { id: 3, name: "name3" },
      { id: 4, name: "name4" }
    ],
    rightItems: [
      { id: 4, name: "name4" },
      { id: 4, name: "name5" },
      { id: 4, name: "name6" }
    ]
  };
  onLeftItemsChanged = items => {
    console.log("onLeftItemsChanged", items);
    this.setState({ leftItems: items });
  };
  onLeftItemMoved = item => {
    console.log("onLeftItemMoved", item);
    this.setState({ rightItems: this.state.rightItems.concat(item) });
  };
  onRightItemsChanged = items => {
    console.log("onRightItemsChanged", items);
    this.setState({ rightItems: items });
  };
  onRightItemRemoved = item => {
    this.setState({ leftItems: this.state.leftItems.concat(item) });
  };

  render() {
    return (
      <div style={{ display: "flex" }}>
        <LeftItems
          items={this.state.leftItems}
          searchProperties={["id", "name"]}
          title={"title"}
          // renderTitle={() => <div>render title</div>}
          inputValue={"inputvalue test"}
          searchInputPlaceHolder={"placholder...."}
          // onInputChange={() => alert("on input change")}
          itemValuePropertyName={"name"}
          // renderItem,
          onItemsChanged={this.onLeftItemsChanged}
          onItemMoved={this.onLeftItemMoved}
        />
        <RightItems
          items={this.state.rightItems}
          title={"title"}
          // renderTitle={() => <div>render title</div>}
          searchInputPlaceHolder={"placholder...."}
          // onInputChange={() => alert("on input change")}
          itemValuePropertyName={"name"}
          onItemsChanged={this.onRightItemsChanged}
          onItemRemoved={this.onRightItemRemoved}
          // renderItem,
          // renderItemValue={}

          onItemAdd={() => alert("on item added")}
        />
      </div>
    );
  }
}

export default OrderSelectableList;
export const Usage = () => <OrderSelectableList />;
