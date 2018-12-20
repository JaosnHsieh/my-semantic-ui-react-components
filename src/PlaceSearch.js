import React, { Component } from "react";
import _ from "lodash";
import faker from "faker";
import request from "axios";
import { Search, Label, Grid, Header, Segment } from "semantic-ui-react";

const constants = {
  contrycode: "tw",
  needApiDataFieldsObj: {
    place_id: "place_id",
    display_name: "display_name",
    lat: "lat",
    lon: "lon"
  },
  searchMoreId: "search_more"
};
const source = _.times(5, () => ({
  title: faker.company.companyName()
  //   description: faker.company.catchPhrase(),
  //   image: faker.internet.avatar(),
  //   price: faker.finance.amount(0, 100, 2, "$")
}));

export default class SearchExampleStandard extends Component {
  state = {
    keyword: "",
    isResultOpen: false,
    isNoMoreSearch: false,
    isLoading: false,
    results: []
  };
  componentWillMount() {
    this.resetComponent();
  }
  getSearchResults = async (keyword = "", exclude_place_ids = "") => {
    const url = `https://nominatim.openstreetmap.org/search.php?format=json&polygon=1&countrycodes=${
      constants.contrycode
    }&q=${keyword}&exclude_place_ids=${exclude_place_ids}`;
    const res = await request.get(url);
    const results = _.get(res, "data", []);
    if (results.length === 0) {
      return this.setState({ isLoading: false, isNoMore: true });
    }
    console.log("searched results", results);
    const pickedResults = _.map(results, r =>
      _.pick(r, [...Object.values(constants.needApiDataFieldsObj)])
    );
    console.log("pickedResults", pickedResults);
    return pickedResults;
  };
  resetComponent = () =>
    this.setState({
      isLoading: false,
      results: [],
      keyword: "",
      isResultOpen: false
    });
  searchMore = () => {};

  handleResultSelect = (e, { result }) => {
    return;
    const placeId = _.get(result, `${constants.needApiDataFieldsObj.place_id}`);
    if (placeId === constants.searchMoreId) {
    }
  };
  //   this.setState({ value: result.title });

  handleSearchChange = async (e, { value }) => {
    this.setState({ isLoading: true, value });
    const exclude_place_ids = "";
    const results = await this.getSearchResults(value);

    // if remove this one, will lead to bug
    if (value.length < 1) return this.resetComponent();
    //
    this.setState({
      isResultOpen: true,
      isLoading: false,
      results
    });
  };
  fixResults = (results = []) => {
    // semantic needs title field in results
    return _.map(results, r => ({
      ...r,
      title: `${Math.random()}`
    }));
  };

  addSearchMore = (results = []) => {
    const { isNoMore = false, value = "" } = this.state;
    if (value && results.length > 0)
      return [
        ...results,
        {
          [constants.needApiDataFieldsObj.place_id]: constants.searchMoreId,
          [constants.needApiDataFieldsObj.display_name]: "Search More"
        }
      ];
  };
  addResultRenderer = (results = []) => {
    return results.map(r => ({
      ...r,
      renderer: ({ id, display_name }) => (
        <div
          onClick={() => {
            if (id === constants.searchMoreId) {
              this.getSearchResults(this.state.value);
            } else {
              this.setState({ isSearchOpen: false });
            }
          }}
        >
          {display_name}
        </div>
      ),
      onClick: () => {}
    }));
  };
  render() {
    const {
      isLoading = false,
      value = "",
      results = [],
      isResultOpen = false
    } = this.state;
    console.log("render results", results);
    return (
      <Search
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 2000, {
          leading: true
        })}
        results={_.flow([
          this.addSearchMore,
          this.fixResults,
          this.addResultRenderer
        ])(results)}
        value={value}
        open={isResultOpen}
        // resultRenderer={({ display_name }) => <div>{display_name}</div>}
        // {...this.props}
      />
    );
  }
}

// import {} from 'semantic-ui-react';

// class PlaceSearch extedns React.Component{
//     render(){

//     }
// }

// export default PlaceSearch;

export const Usage = () => <SearchExampleStandard />;
