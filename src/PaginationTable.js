import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Icon,
  Label,
  Menu,
  Table,
  Message,
  Segment,
  Input
} from "semantic-ui-react";
import _ from "lodash";
import styles from "./PaginationTable.css";
import { filterByMultiProperties } from "./utils";

const SortingIcon = ({ asc = false }) =>
  asc ? <Icon name={"caret down"} /> : <Icon name={"caret up"} />;

class PaginationTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      sorting: {
        currentSortingFields: this.props.initSortingFields,
        asc: this.props.initSortingOrderAsc
      },
      searchBarText: ""
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentPage &&
      nextProps.currentPage !== this.props.currentPage
    ) {
      this.setState({
        currentPage: nextProps.currentPage
      });
    }
  }
  // componentDidUpdate() {
  //   /**
  //    * scoll to table row by pid
  //    * projects/progress/:pid
  //    */
  //   this.props.items.some((item) => {
  //     if (item.isTargetItem) {
  //       const elem = document.getElementById(`project_${item._id}`);
  //       if (elem) {
  //         elem.scrollIntoView(true);
  //         window.scrollBy(0, -100);
  //       }
  //       return true;
  //     }
  //   });
  // }
  paginate = (items = []) => {
    const { itemsPerPage } = this.props;
    const { currentPage } = this.state;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  isSearchable = () => this.props.searchKeyProperties.length > 0;
  onSearchBarTextChange = (e, { value }) =>
    this.setState({ searchBarText: value });

  totalPageNum = () => {
    const { itemsPerPage, isImmutable } = this.props;
    let { items } = this.props;
    if (this.isSearchable) {
      items = filterByMultiProperties(
        items,
        this.state.searchBarText,
        this.props.searchKeyProperties
      );
    }
    return Math.ceil((isImmutable ? items.size : items.length) / itemsPerPage);
  };
  pageNumArray = () => {
    const pageNumArray = [];
    for (let i = 0; i < this.totalPageNum(); ++i) {
      pageNumArray.push(i + 1);
    }
    return pageNumArray;
  };

  nextPage = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage + 1
    }));
  };
  prevPage = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage - 1
    }));
  };
  selectPage = pageNum => {
    this.setState({
      currentPage: pageNum
    });
  };
  hasNextPage = () => this.state.currentPage + 1 <= this.totalPageNum();
  hasPrevPage = () => this.state.currentPage - 1 >= 1;

  render() {
    const {
      currentPage,
      columnOption,
      pagination,
      searchKeyProperties,
      itemsPerPage,
      isImmutable,
      initSortingFields,
      initSortingOrderAsc,
      items,
      ...props
    } = this.props;
    let showingItems = items;
    const { searchBarText } = this.state;
    const { currentSortingFields, asc } = this.state.sorting;

    if (currentSortingFields) {
      showingItems = _.orderBy(showingItems, currentSortingFields.join("."), [
        asc ? "asc" : "desc"
      ]);
    }
    showingItems = this.isSearchable()
      ? (showingItems = filterByMultiProperties(
          showingItems,
          searchBarText,
          searchKeyProperties
        ))
      : showingItems;
    showingItems = pagination ? this.paginate(showingItems) : showingItems;

    const SearchBar = this.isSearchable() && (
      <Input
        icon="search"
        iconPosition="left"
        // label={"Search"}
        fluid
        placeholder={`Search ${searchKeyProperties.join(", ")} ...`}
        value={this.state.searchBarText}
        onChange={this.onSearchBarTextChange}
      />
    );

    const TableEle = (
      <React.Fragment>
        <Table unstackable style={{ margin: "0.5px 0" }} {...props}>
          <Table.Header>
            <Table.Row>
              {columnOption.map((c, i) => (
                <Table.HeaderCell
                  style={{ cursor: c.sortingFields ? "pointer" : "init" }}
                  onClick={() => {
                    if (!isImmutable && c.sortingFields) {
                      this.setState(prevState => ({
                        sorting: {
                          ...prevState.sorting,
                          currentSortingFields: [...c.sortingFields],
                          asc: !prevState.sorting.asc
                        }
                      }));
                    }
                  }}
                  key={i}
                >
                  {c.header || ""}
                  {!isImmutable &&
                    c &&
                    c.sortingFields &&
                    _.isEqual(c.sortingFields, currentSortingFields) && (
                      <SortingIcon asc={this.state.sorting.asc} />
                    )}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          {showingItems.length > 0 && (
            <Table.Body>
              {showingItems.map((item, i) => (
                <Table.Row
                  // styleName={item.isTargetItem ? "background-fadeout" : ""}
                  // id={`project_${item._id}`}
                  // positive={!!item.isTargetItem}
                  key={i}
                >
                  {columnOption.map((c, ii) => (
                    <Table.Cell
                      key={ii}
                      style={{ cursor: c.onItemClick ? "pointer" : "auto" }}
                      onClick={() => {
                        if (c.onItemClick) {
                          c.onItemClick(item);
                        }
                      }}
                    >
                      {typeof c.cellValue === "string"
                        ? isImmutable
                          ? item.get(c.cellValue)
                          : item[c.cellValue]
                        : c.cellValue(item)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          )}
        </Table>

        {showingItems.length === 0 && (
          <Segment style={{ margin: 0 }}>
            {searchBarText ? (
              <Message warning>
                {`No result found for query "${searchBarText}"`}
              </Message>
            ) : (
              <Message>{`No items to display`}</Message>
            )}
          </Segment>
        )}
      </React.Fragment>
    );

    const PaginationBar =
      pagination &&
      (showingItems.length > 0 ? (
        <Menu pagination>
          <Menu.Item
            as="a"
            icon
            onClick={this.prevPage}
            disabled={!this.hasPrevPage()}
          >
            <Icon name="chevron left" />
          </Menu.Item>
          {this.pageNumArray().map((num, i) => (
            <Menu.Item
              as="a"
              key={i}
              onClick={() => {
                this.selectPage(num);
              }}
              active={num === this.state.currentPage}
            >
              {num}
            </Menu.Item>
          ))}
          <Menu.Item
            as="a"
            icon
            onClick={this.nextPage}
            disabled={!this.hasNextPage()}
          >
            <Icon name="chevron right" />
          </Menu.Item>
        </Menu>
      ) : null);
    return typeof this.props.children === "function" ? (
      this.props.children({ SearchBar, TableEle, PaginationBar })
    ) : (
      <React.Fragment>
        {SearchBar}
        {TableEle}
        {PaginationBar}
      </React.Fragment>
    );
  }
}
PaginationTable.propTypes = {
  columnOption: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string,
      cellValue: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      onItemClick: PropTypes.func,
      sortingFields: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  items: PropTypes.any,
  itemsPerPage: PropTypes.number,
  pagination: PropTypes.bool,
  isImmutable: PropTypes.bool,
  currentPage: PropTypes.number,
  initSortingFields: PropTypes.arrayOf(PropTypes.string),
  initSortingOrderAsc: PropTypes.bool,
  searchKeyProperties: PropTypes.arrayOf(PropTypes.string)
};
PaginationTable.defaultProps = {
  itemsPerPage: 10,
  pagination: false,
  isImmutable: false,
  initSortingFields: [],
  initSortingOrderAsc: true,
  searchKeyProperties: []
};
export default PaginationTable;

// Usage is an example on how to PaginationTable component.
export const Usage = () => (
  <PaginationTable
    items={[
      {
        id: 1,
        name: "test-item-1 ???",
        nestedSortingTestProps: {
          s: 5
        }
      },
      {
        id: 2,
        name: "test-item-2",
        nestedSortingTestProps: {
          s: 3
        }
      },
      {
        id: 3,
        name: "test-item-3",
        nestedSortingTestProps: {
          s: 2
        }
      }
    ]}
    columnOption={[
      {
        header: "idHeader",
        cellValue: "id",
        onItemClick: item => {
          alert(item.id);
        },
        sortingFields: ["id"]
      },
      {
        header: "Name~",
        cellValue: item =>
          `*custom text cannot be searched* property can item.name => ${
            item.name
          } `,
        onItemClick: item => {
          alert(item.name);
        },
        sortingFields: ["name"]
      },
      {
        header: "NestingSortTest~",
        cellValue: item => item.nestedSortingTestProps.s,
        sortingFields: ["nestedSortingTestProps", "s"]
      }
    ]}
    initSortingFields={["id"]}
    initSortingOrderAsc={false}
    pagination
    itemsPerPage={5}
    searchKeyProperties={["id", "name"]}
  />
);

export const Usage2 = () => (
  <PaginationTable
    items={[
      {
        id: 1,
        name: "test-item-1 ???"
      },
      {
        id: 2,
        name: "test-item-2"
      },
      {
        id: 3,
        name: "test-item-3"
      }
    ]}
    columnOption={[
      {
        header: "idHeader",
        cellValue: "id",
        onItemClick: item => {
          alert(item.id);
        },
        sortingFields: ["id"]
      },
      {
        header: "Name~",
        cellValue: item =>
          `*custom text cannot be searched* property can item.name => ${
            item.name
          } `,
        onItemClick: item => {
          alert(item.name);
        },
        sortingFields: "name"
      }
    ]}
    initSortingFields={["id"]}
    initSortingOrderAsc={false}
    pagination
    itemsPerPage={2}
    searchKeyProperties={["id", "name"]}
  >
    {({ SearchBar, TableEle, PaginationBar }) => (
      <div>
        {PaginationBar}
        {SearchBar}
        {TableEle}
      </div>
    )}
  </PaginationTable>
);
