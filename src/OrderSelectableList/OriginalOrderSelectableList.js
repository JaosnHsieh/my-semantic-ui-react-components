import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
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
import moment from "moment";
import _ from "lodash";
import { Route, Switch } from "react-router-dom";
import ResultTemplateEditManageBar from "./ResultTemplateEditManageBar";
import { actions, CLEAR_ERRORS } from "../actions";
import { projects } from "../selectors";
import {
  PaginationTable,
  Grid1141,
  ActionIcon,
  Loading
} from "../../components";
import { categoriesIndexMap } from "../../People/selectors";
import { chartTypeEnum, chartTypeOptions } from "../selectors";
import { CLEAR_ISUPDATEING } from "../actions";
import ChartTypeImage from "./ChartTypeImage";
import { debug } from "utils";

const mapStateToProps = state => ({
  resultTemplate: state.resultTemplate.resultTemplate,
  isLoading: state.resultTemplate.isLoading,
  serverErrors: state.resultTemplate.errors,
  isUpdateing: state.resultTemplate.isUpdateing
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

const orderableListTotalHeight = 500;
const rightFunctionBarHeight = 200;

class ResultTemplateEdit extends React.Component {
  state = {
    templateName: "",
    allCategories: _.sortBy(
      _.map(
        categoriesIndexMap,
        (name, index) => ({
          chartType: chartTypeEnum[1], // horizontalBar
          name: typeof name === "string" && name.replace(/_/g, " "),
          index
        }),
        "name"
      ),
      "name"
    ),
    allCategoriesSeachKeyword: "",
    selectedCategories: [],
    selectedCategoryActiveIndex: null,
    selectedCategoriesSearchKeyword: "",
    inputErrors: {},
    isShowErrors: false,
    errorMessages: []
  };
  componentWillReceiveProps = nextProps => {
    if (
      nextProps.resultTemplate !== this.props.resultTemplate &&
      !!nextProps.resultTemplate
    ) {
      const { resultTemplate } = nextProps;
      const { allCategories } = this.state;
      const selectedCategoryIndexs = resultTemplate.blocks.map(
        b => b.categoryIndex
      );

      this.setState({
        templateName: _.get(resultTemplate, "name"),
        allCategories: allCategories.filter(
          c => !selectedCategoryIndexs.includes(c.index)
        ),
        selectedCategories: resultTemplate.blocks.map(
          ({ chartType, categoryIndex }) => ({
            chartType,
            index: categoryIndex,
            name:
              typeof categoriesIndexMap[categoryIndex] === "string" &&
              categoriesIndexMap[categoryIndex].replace(/_/g, " ")
          })
        )
      });
    }
  };

  onInputChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    });
  };
  searchedCategories = (categories, keyword) => {
    if (!keyword) {
      return categories;
    }
    return categories.filter((c = {}) =>
      c.name.toLowerCase().includes(keyword.toLowerCase())
    );
  };
  getSelectedCategoryOrderNumber = category => {
    const { selectedCategories } = this.state;
    for (const c in selectedCategories) {
      if (selectedCategories[c].index === category.index) {
        return parseInt(c, 10) + 1;
      }
    }
    return 0;
  };
  moveActiveSelectedTo = position => () => {
    const { selectedCategoryActiveIndex: i, selectedCategories } = this.state;

    switch (position) {
      case "top":
        if (i === 0) return;
        this.setState(({ selectedCategories: s }) => ({
          selectedCategoryActiveIndex: 0,
          selectedCategories: [s[i], ...s.slice(0, i), ...s.slice(i + 1)]
        }));
        break;
      case "up":
        if (i === 0) return;
        this.setState(({ selectedCategories: s }) => ({
          selectedCategoryActiveIndex: i - 1,
          selectedCategories: [
            ...s.slice(0, i - 1),
            s[i],
            s[i - 1],
            ...s.slice(i + 1)
          ]
        }));
        break;
      case "down":
        if (i === selectedCategories.length - 1) return;
        this.setState(({ selectedCategories: s }) => ({
          selectedCategoryActiveIndex: i + 1 > s.length - 1 ? i : i + 1,
          selectedCategories: [
            ...s.slice(0, i),
            s[i + 1],
            s[i],
            ...s.slice(i + 2)
          ]
        }));
        break;
      case "bottom":
        if (i === selectedCategories.length - 1) return;
        this.setState(({ selectedCategories: s }) => ({
          selectedCategoryActiveIndex: s.length - 1,
          selectedCategories: [...s.slice(0, i), ...s.slice(i + 1), s[i]]
        }));
        break;
      default:
        return;
    }
  };

  onSave = () => {
    const inputErrors = this.validateInputs();
    const isAnyErrors = Object.keys(inputErrors).some(
      n => inputErrors[n].isError
    );
    if (isAnyErrors) {
      this.setState({ inputErrors }, () => {
        this.showErrors();
      });
    } else {
      const { _id } = this.props.resultTemplate;
      const { templateName: name, selectedCategories: s } = this.state;
      const blocks = s.map(c => ({
        blockType: "categoryChart",
        categoryIndex: c.index,
        chartType: c.chartType
      }));
      const createResultTemplateSuccessCallback = dispatch => {
        this.props.history.goBack();
        dispatch({ type: CLEAR_ISUPDATEING });
      };
      const createResultTemplateFailureCallback = dispatch => {
        setTimeout(() => {
          dispatch({ type: CLEAR_ERRORS });
        }, 5000);
      };
      this.props.actions.updateResultTemplate(
        { _id, name, blocks },
        createResultTemplateSuccessCallback,
        createResultTemplateFailureCallback
      );
    }
  };

  showErrors = (errorShowingInterval = 5000) => {
    const { inputErrors } = this.state;
    this.setState(
      {
        isShowErrors: true,
        errorMessages: Object.keys(inputErrors)
          .filter(n => inputErrors[n].isError)
          .map(n => inputErrors[n].message)
      },
      () => {
        setTimeout(() => {
          this.setState({
            isShowErrors: false
          });
        }, errorShowingInterval);
      }
    );
  };

  validateInputs = () => {
    const { templateName, selectedCategories } = this.state;
    const updatedInputErrors = {
      templateName: {
        isError: templateName.length <= 0,
        message: "Template name is needed"
      },
      selectedCategories: {
        isError: selectedCategories.length <= 0,
        message: "At least select one category"
      }
    };
    return updatedInputErrors;
  };
  isShowInputError = inputName => {
    const { inputErrors, isShowErrors } = this.state;
    return (
      isShowErrors && inputErrors[inputName] && inputErrors[inputName].isError
    );
  };
  chartTypeDropdownOnChange = (e, { value }) => {
    const {
      selectedCategoryActiveIndex: i,
      selectedCategories: s
    } = this.state;
    this.setState({
      selectedCategories: [
        ...s.slice(0, i),
        { ...s[i], chartType: value },
        ...s.slice(i + 1)
      ]
    });
  };
  componentDidMount = () => {
    const { match } = this.props;
    const _id = _.get(match, "params.id");
    if (_id) {
      this.props.actions.fetchResultTemplate({ _id });
    }
  };

  render() {
    const { isLoading, isUpdateing, serverErrors = [], history } = this.props;

    if (isLoading) {
      return <Loading />;
    }
    const {
      templateName,
      allCategories,
      allCategoriesSeachKeyword,
      selectedCategories,
      selectedCategoriesSearchKeyword,
      selectedCategoryActiveIndex,
      errorMessages,
      isShowErrors
    } = this.state;
    const searchedAllCategories = this.searchedCategories(
      allCategories,
      allCategoriesSeachKeyword
    );
    const searchedSelectedCategories = this.searchedCategories(
      selectedCategories,
      selectedCategoriesSearchKeyword
    );
    const isSelected = selectedCategoryActiveIndex !== null;
    const selectedCategory = selectedCategories[selectedCategoryActiveIndex];

    return (
      <div>
        <ResultTemplateEditManageBar
          onSave={this.onSave}
          isLoading={isUpdateing}
        />
        <Grid1141 isTextAlignLeft>
          <Segment>
            <Form size="big" error>
              {serverErrors.length > 0 && (
                <Message
                  error
                  header="There was some errors with your submission"
                  list={serverErrors.map(error => error.message)}
                />
              )}
              {isShowErrors && (
                <Message
                  error
                  header="There was some errors with your submission"
                  list={errorMessages}
                />
              )}
              <Form.Field required>
                <label>Name</label>
                <Input
                  name={"templateName"}
                  placeholder="template name"
                  value={templateName}
                  onChange={this.onInputChange}
                  fluid
                  maxLength={50}
                />
              </Form.Field>

              <Form.Field required>
                <label>Categories</label>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    <Segment
                      attached
                      textAlign="left"
                      style={{ borderRight: 0 }}
                    >
                      Total <strong>{searchedAllCategories.length}</strong>{" "}
                      Categories Available
                    </Segment>
                    <Input
                      name={"allCategoriesSeachKeyword"}
                      value={allCategoriesSeachKeyword}
                      onChange={this.onInputChange}
                      fluid
                      icon="search"
                      iconPosition="left"
                      placeholder="Search label categories..."
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
                        {searchedAllCategories.length === 0 && (
                          <Message style={{ margin: "20px" }}>
                            {"No Matched Category to display"}
                          </Message>
                        )}
                        {searchedAllCategories.map((c, i) => (
                          <List.Item key={i} style={{ cursor: "default" }}>
                            <List.Content
                              floated="right"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                this.setState(prevState => ({
                                  allCategories: prevState.allCategories.filter(
                                    cc => cc.index !== c.index
                                  ),
                                  selectedCategories: prevState.selectedCategories.concat(
                                    c
                                  )
                                }));
                              }}
                            >
                              <List.Header>
                                <Icon name="plus" circular />
                              </List.Header>
                            </List.Content>
                            <Icon name="list" />
                            <List.Content>
                              <List.Header>{c.name}</List.Header>
                            </List.Content>
                          </List.Item>
                        ))}
                      </List>
                    </Segment>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Segment
                      attached
                      textAlign="left"
                      style={{ borderLeft: 0 }}
                    >
                      Total <strong>{selectedCategories.length}</strong>{" "}
                      Selected
                    </Segment>
                    <Input
                      name={"selectedCategoriesSearchKeyword"}
                      value={selectedCategoriesSearchKeyword}
                      onChange={this.onInputChange}
                      fluid
                      icon="search"
                      iconPosition="left"
                      placeholder="Search selected label categories..."
                    />

                    {isSelected && (
                      <div
                        style={{
                          height: `${rightFunctionBarHeight}px`,
                          borderBottom: 0,
                          padding: "0 15px"
                        }}
                      >
                        <Header style={{ padding: "10px 0 0 0" }}>
                          <Label>
                            {"No."}
                            {this.getSelectedCategoryOrderNumber(
                              selectedCategory
                            )}
                          </Label>
                          <span style={{ padding: "10px" }}>
                            {selectedCategory.name}
                          </span>
                        </Header>
                        <Form.Field required>
                          <label>Chart Type</label>
                          <Dropdown
                            placeholder="select chart type..."
                            fluid
                            search
                            selection
                            options={chartTypeOptions}
                            value={selectedCategory.chartType}
                            onChange={this.chartTypeDropdownOnChange}
                          />
                        </Form.Field>

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
                      </div>
                    )}
                    <Segment
                      style={{
                        borderTop: 0,
                        marginTop: 0,
                        height: isSelected
                          ? `${orderableListTotalHeight -
                              rightFunctionBarHeight}px`
                          : `${orderableListTotalHeight}px`,
                        maxHeight: "500px",
                        overflow: "auto"
                      }}
                    >
                      <List selection divided animated>
                        {selectedCategories.length === 0 && (
                          <Message
                            style={{ margin: "20px" }}
                            negative={this.isShowInputError(
                              "selectedCategories"
                            )}
                          >
                            {"No Selected Items to display"}
                          </Message>
                        )}
                        {searchedSelectedCategories.map((c, i) => (
                          <List.Item
                            key={i}
                            active={selectedCategoryActiveIndex === i}
                            onClick={() => {
                              this.setState({ selectedCategoryActiveIndex: i });
                            }}
                          >
                            <List.Content
                              floated="right"
                              style={{ cursor: "pointer" }}
                              onClick={e => {
                                e.stopPropagation(); // for prevent event bubbling
                                this.setState(prevState => ({
                                  selectedCategories: prevState.selectedCategories.filter(
                                    cc => cc.index !== c.index
                                  ),
                                  allCategories: _.sortBy(
                                    prevState.allCategories.concat(c),
                                    "name"
                                  ),
                                  selectedCategoryActiveIndex: null
                                }));
                              }}
                            >
                              <List.Header>
                                <Icon name="minus" circular />
                              </List.Header>
                            </List.Content>
                            <Icon name="list" />
                            <List.Content>
                              <List.Header>
                                <Label
                                >{`No. ${this.getSelectedCategoryOrderNumber(
                                  c
                                )}`}</Label>
                                <span>
                                  <ChartTypeImage chartType={c.chartType} />
                                  {c.name}
                                </span>
                              </List.Header>
                            </List.Content>
                          </List.Item>
                        ))}
                      </List>
                    </Segment>
                  </div>
                </div>
              </Form.Field>
            </Form>
          </Segment>
        </Grid1141>
      </div>
    );
  }
}

ResultTemplateEdit.propTypes = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultTemplateEdit);
