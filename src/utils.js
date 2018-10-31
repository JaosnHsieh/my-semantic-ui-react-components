import _ from "lodash";
/**
 *
 * @param {array of Object} items
 * @param {string} keword
 * @param {array of string} searchProperties
 */
export const filterByMultiProperties = (
  items = [],
  keyword = "",
  searchProperties = []
) =>
  keyword.length > 0
    ? _.filter(items, item =>
        searchProperties.some(key => {
          return new RegExp(_.escapeRegExp(keyword), "ig").test(item[key]);
        })
      )
    : items;
