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
) => {
  if (searchProperties.length === 0 && items.length > 0 && !!items[0]) {
    searchProperties = Object.keys(items[0]);
  }
  return keyword.length > 0
    ? _.filter(items, item =>
        searchProperties.some(key => {
          return new RegExp(_.escapeRegExp(keyword), "ig").test(item[key]);
        })
      )
    : items;
};

export const moveArrayElement = {
  top: (items, index) => {
    if (items.length <= 1 || index === 0)
      return {
        items,
        itemIndex: index
      };
    return {
      items: [
        items[index],
        ...items.slice(0, index),
        ...items.slice(index + 1)
      ],
      itemIndex: 0
    };
    return;
  },
  up: (items, index) => {
    if (items.length <= 1 || index === 0) {
      return {
        items,
        itemIndex: index
      };
    }
    return {
      items: [
        ...items.slice(0, index - 1),
        items[index],
        items[index - 1],
        ...items.slice(index + 1)
      ],
      itemIndex: index - 1
    };
  },
  down: (items, index) => {
    if (index === items.length - 1)
      return {
        items,
        itemIndex: index
      };
    return {
      items: [
        ...items.slice(0, index),
        items[index + 1],
        items[index],
        ...items.slice(index + 2)
      ],
      itemIndex: index + 1
    };
  },
  bottom: (items, index) => {
    if (index === items.length - 1)
      return {
        items,
        itemIndex: index
      };
    return {
      items: [
        ...items.slice(0, index),
        ...items.slice(index + 1),
        items[index]
      ],
      itemIndex: items.length - 1
    };
  }
};
