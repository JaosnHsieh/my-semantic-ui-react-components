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

class LeftItems extends Component {
  state = {
    searchKeyword: ""
  };
  onInputChange = value => {
    this.setState({ searchKeyword: value });
  };

  search = (items = [], keword = "", searchProperties = []) =>
    keyword.length > 0
      ? _.filter(items, item =>
          searchProperties.some(key => {
            return new RegExp(_.escapeRegExp(keyword), "ig").test(item[key]);
          })
        )
      : items;

  render() {
    const {
      items = [],
      title,
      renderTitle,
      inputValue = "",
      searchInputPlaceHolder = "",
      itemValuePropertyName,
      renderItem,
      onItemAdd,
      searchItemPropertyName
    } = this.props;

    const searchedItems = this.search(items, keyword, searchProperties);

    return (
      <React.Fragment>
        <Segment attached textAlign="left" style={{ borderRight: 0 }}>
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

export default LeftItems;
