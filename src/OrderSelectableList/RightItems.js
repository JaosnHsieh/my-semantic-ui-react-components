import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Icon,
  Segment,
  Input,
  Message,
  List,
  Button,
  Popup
} from "semantic-ui-react";
import _ from "lodash";
import LazyInput from "../LazyInput";
import { defaultTotalHeight, defaultRightToolBarHeight } from "./constants";

import { filterByMultiProperties, moveArrayElement } from "../utils";

class RightItems extends Component {
  state = {
    searchKeyword: "",
    activeSelectedItemIndex: null
  };
  onInputChange = value => {
    this.setState({ searchKeyword: value });
  };

  onItemSelect = (item, index) => {
    this.setState({ activeSelectedItemIndex: index });
  };
  onItemRemove = (item, index) => {
    const { items, onItemsChanged, onItemRemoved } = this.props;
    const updatedItems = items.slice(0, index).concat(items.slice(index + 1));
    this.setState(
      {
        activeSelectedItemIndex: null
      },
      () => {
        onItemsChanged(updatedItems);
        onItemRemoved(item);
      }
    );
  };
  moveActiveSelectedTo = position => () => {
    const { onItemsChanged } = this.props;
    const { activeSelectedItemIndex: i } = this.state;
    switch (position) {
      case "top": {
        const { items: newItems, itemIndex } = moveArrayElement.top(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      }

      case "up": {
        const { items: newItems, itemIndex } = moveArrayElement.up(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      }

      case "down": {
        const { items: newItems, itemIndex } = moveArrayElement.down(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      }

      case "bottom": {
        const { items: newItems, itemIndex } = moveArrayElement.bottom(
          this.props.items,
          i
        );
        this.setState({ activeSelectedItemIndex: itemIndex });
        onItemsChanged(newItems);
        break;
      }

      default:
        return;
    }
  };

  render() {
    const {
      items = [],
      title,
      renderTitle,
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
    const totalHeight = this.props.totalHeight || defaultTotalHeight;
    const rightToolBarHeight =
      this.props.rightToolBarHeight || defaultRightToolBarHeight;

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
              height: `${rightToolBarHeight}px`,
              borderBottom: 0
            }}
          >
            {renderSelectdToolBar
              ? renderSelectdToolBar({
                  moveButtonGroup,
                  activeItem: this.props.items[
                    this.state.activeSelectedItemIndex
                  ],
                  renderTitle: this.state.activeSelectedItemIndex
                })
              : moveButtonGroup}
          </div>
        )}

        <Segment
          style={{
            marginTop: 0,
            height: `${totalHeight}px`,
            maxHeight: `${totalHeight}px`,
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

RightItems.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
  renderTitle: PropTypes.func,
  searchProperties: PropTypes.arrayOf(PropTypes.string),
  searchInputPlaceHolder: PropTypes.string,
  itemValuePropertyName: PropTypes.string,
  onItemsChanged: PropTypes.func.isRequired,
  onItemRemoved: PropTypes.func,
  renderSelectdToolBar: PropTypes.func
};
RightItems.defaultProps = {
  items: [],
  searchInputPlaceHolder: "Search...",
  // itemValuePropertyName: '',
  searchProperties: []
};

export default RightItems;
