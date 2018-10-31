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

class RightItems extends Component {
  state = {
    searchKeyword: "",
    activeSelectedItemIndex: null
  };
  onInputChange = value => {
    this.setState({ searchKeyword: value });
  };

  // moveActiveSelectedTo = position => () => {
  //   const { activeSelectedItemIndex: i } = this.state;

  //   switch (position) {
  //     case "top":
  //       if (i === 0) return;
  //       this.setState(({ selectedCategories: s }) => ({
  //         selectedCategoryActiveIndex: 0,
  //         selectedCategories: [s[i], ...s.slice(0, i), ...s.slice(i + 1)]
  //       }));
  //       break;
  //     case "up":
  //       if (i === 0) return;
  //       this.setState(({ selectedCategories: s }) => ({
  //         selectedCategoryActiveIndex: i - 1,
  //         selectedCategories: [
  //           ...s.slice(0, i - 1),
  //           s[i],
  //           s[i - 1],
  //           ...s.slice(i + 1)
  //         ]
  //       }));
  //       break;
  //     case "down":
  //       if (i === selectedCategories.length - 1) return;
  //       this.setState(({ selectedCategories: s }) => ({
  //         selectedCategoryActiveIndex: i + 1 > s.length - 1 ? i : i + 1,
  //         selectedCategories: [
  //           ...s.slice(0, i),
  //           s[i + 1],
  //           s[i],
  //           ...s.slice(i + 2)
  //         ]
  //       }));
  //       break;
  //     case "bottom":
  //       if (i === selectedCategories.length - 1) return;
  //       this.setState(({ selectedCategories: s }) => ({
  //         selectedCategoryActiveIndex: s.length - 1,
  //         selectedCategories: [...s.slice(0, i), ...s.slice(i + 1), s[i]]
  //       }));
  //       break;
  //     default:
  //       return;
  //   }
  // };

  render() {
    const {
      items = [],
      title,
      renderTitle,
      inputValue = "",
      searchInputPlaceHolder = "",
      itemValuePropertyName,
      renderItem,
      onItemsMoved
    } = this.props;

    return (
      <React.Fragment>
        <Segment attached textAlign="right" style={{ borderLeft: 0 }}>
          {title && title}
          {renderTitle && renderTitle()}
        </Segment>

        <LazyInput
          as={Input}
          onChange={this.onInputChange}
          value={this.state.searchKeyword}
          fluid
          icon="search"
          iconPosition="left"
          placeholder={searchInputPlaceHolder}
        />
        <Segment
          style={{
            marginTop: 0,
            height: `${orderableListTotalHeight}px`,
            maxHeight: `${orderableListTotalHeight}px`,
            overflow: "auto"
          }}
        >
          <List selection divided celled animated relaxed>
            {items.length === 0 && (
              <Message style={{ margin: "20px" }}>
                {"No Matched Category to display"}
              </Message>
            )}
            {items.map((item, i) => (
              <List.Item key={i} style={{ cursor: "default" }}>
                <List.Content
                  floated="right"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    onItemAdd(item);
                  }}
                >
                  <List.Header>
                    <Icon name="plus" circular />
                  </List.Header>
                </List.Content>
                <Icon name="list" />
                <List.Content>
                  <List.Header>
                    {itemValuePropertyName && item[itemValuePropertyName]}
                    {renderItem && renderItem(item)}
                  </List.Header>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Segment>
      </React.Fragment>
    );
  }
}

LeftItems.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string,
  renderTitle: PropTypes.func,
  inputValue: PropTypes.string,
  searchInputPlaceHolder: PropTypes.string,
  onInputChange: PropTypes.func,
  itemValuePropertyName: PropTypes.string,
  renderItemValue: PropTypes.func
};
LeftItems.defaultProps = {
  items: [],
  searchInputPlaceHolder: "Search...",
  onInputChange: PropTypes.func,
  itemValuePropertyName: PropTypes.string,
  renderItemValue: PropTypes.func
};

class OrderSelectableList extends Component {
  render() {
    return (
      <LeftItems
        items={[{ id: 1, name: "name1" }, { id: 2, name: "name2" }]}
        title={"title"}
        renderTitle={() => <div>render title</div>}
        inputValue={"inputvalue test"}
        searchInputPlaceHolder={"placholder...."}
        onInputChange={() => alert("on input change")}
        itemValuePropertyName={"name"}
        // renderItem,
        onItemAdd={() => alert("on item added")}
      />
    );
  }
}

export default OrderSelectableList;
export const Usage = () => <OrderSelectableList />;
