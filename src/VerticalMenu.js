import React, { Component } from "react";
import _ from "lodash";
import { Icon, Menu, Dropdown, Button } from "semantic-ui-react";

const headerHeight = "20px";

// permission string is according to the AclRole data in mongodb
const menuItems = [
  {
    name: "project",
    icon: "object group outline",
    displayName: "Project",
    subMenuItems: [
      {
        name: "myprojects",
        displayName: "My projects",
        routePath: "/projects",
        otherActiveRegexArr: [/\/project\/edit/i, /\/project\/\w+$/i] // don't put g flag because of regex lastIndex
      }
    ],
    acl: "project"
  },
  {
    name: "report",
    icon: "chart line",
    displayName: "Report",
    subMenuItems: [
      {
        name: "progress",
        displayName: "Overview",
        routePath: "/projects/progress"
      },
      {
        name: "template",
        displayName: "Template",
        routePath: "/templates",
        otherActiveRegexArr: [/^\/templates\/add$/i] // don't put g flag because of regex lastIndex
      }
    ],
    acl: "project"
  },
  {
    name: "audience",
    icon: "users",
    displayName: "Audience",
    routePath: "/people",
    acl: "audience"
  },
  {
    name: "location",
    icon: "location arrow",
    displayName: "Location",
    routePath: "/location",
    otherActiveRegexArr: [/\/location/i],
    acl: "location"
  },
  {
    name: "userManagement",
    icon: "user",
    displayName: "User Management",
    routePath: "/user-management",
    otherActiveRegexArr: [/\/permission/i, /\/marketings/i],
    acl: "permission"
  }
];

//from  https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API

function storageAvailable(type) {
  try {
    var storage = window[type],
      x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0
    );
  }
}

class VerticalMenu extends Component {
  constructor() {
    super();
    this.state = {
      activeItemName: "myprojects",
      isCollapsed: this.getIsCollapsedFromLocalStorage(),
      isDropdownMenusOn: {}
    };
  }
  // localStroage accept string value only
  getIsCollapsedFromLocalStorage = () => {
    const defaultIsCollapsed = true;
    if (storageAvailable("localStorage")) {
      return localStorage.getItem("isCollapsed") === "false"
        ? false
        : defaultIsCollapsed;
    } else {
      return defaultIsCollapsed;
    }
  };
  // localStroage accept string value only
  saveIsCollapsedToLocalStorage = (bool = true) => {
    if (storageAvailable("localStorage")) {
      localStorage.setItem("isCollapsed", bool.toString());
    }
  };

  handleItemClick = item => {
    this.switchRoute(item.routePath);
  };

  switchRoute = routePath => {
    window.browserHistory.push(routePath);
  };

  isItemActive = (currentPath = "", itemObj) => {
    const otherActiveRegexArr = _.get(itemObj, "otherActiveRegexArr", []);
    const subMenuItems = _.get(itemObj, "subMenuItems", []);

    if (_.get(itemObj, "routePath") === currentPath) {
      return true;
    }

    if (
      otherActiveRegexArr.length > 0 &&
      otherActiveRegexArr.some(reg => reg.test(currentPath))
    ) {
      return true;
    }

    if (
      subMenuItems.length > 0 &&
      subMenuItems.some(i => this.isItemActive(currentPath, i))
    ) {
      return true;
    }

    return false;
  };
  setMenusOpen = (index = 0, bool = false) => {
    this.setState(currentState => {
      return {
        isDropdownMenusOn: {
          ...currentState.isDropdownMenusOn,
          [index]: bool
        }
      };
    });
  };

  render() {
    const { isCollapsed, isDropdownMenusOn } = this.state;
    const leftSidebarWidth = isCollapsed ? "5.5rem" : "20rem";
    const { activeItemName } = this.props;
    const pathname = window.location.pathname;
    const renderMenuItems = [];

    if (isCollapsed) {
      menuItems.forEach((item, index) =>
        //   me.can(item.acl) &&
        renderMenuItems.push(
          <div key={index} style={{ position: "relative", height: "60.41px" }}>
            <Icon
              size={"large"}
              name={item.icon}
              style={{
                position: "absolute",
                left: "20.5px",
                top: "16.5px"
              }}
            />
            <Dropdown
              style={{ height: "60.41px" }}
              className={this.isItemActive(pathname, item) ? "active" : ""}
              item
              icon={""} //for remove down arrow icon
              direction="right"
              open={_.get(isDropdownMenusOn, index, false)}
              onMouseEnter={() => {
                this.setMenusOpen(index, true);
              }}
              onMouseLeave={() => {
                this.setMenusOpen(index, false);
              }}
              onClick={
                item.routePath
                  ? e => {
                      this.handleItemClick(item);
                    }
                  : undefined
              }
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  style={{
                    cursor: "unset",
                    borderLeft: "2px solid rgb(54, 138, 253)"
                  }}
                  // active={this.isItemActive(pathname, item)}
                  // onClick={
                  //   item.routePath
                  //     ? e => {
                  //         this.handleItemClick(item);
                  //       }
                  //     : undefined
                  // }
                >
                  <Dropdown.Header content={`${item.displayName}`} />
                  <Dropdown.Divider />
                </Dropdown.Item>
                {item.subMenuItems &&
                  item.subMenuItems.map((subItem, subIndex) => (
                    <Dropdown.Item
                      key={subIndex}
                      active={this.isItemActive(pathname, subItem)}
                      onClick={e => {
                        this.handleItemClick(subItem);
                      }}
                    >
                      {subItem.displayName}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )
      );
    } else {
      //expanded menus
      menuItems.forEach((item, index) =>
        //   me.can(item.acl) &&
        renderMenuItems.push(
          <Menu.Item
            key={index}
            onClick={
              item.routePath
                ? e => {
                    this.handleItemClick(item);
                  }
                : undefined
            }
            active={this.isItemActive(pathname, item)}
          >
            <Icon
              // styleName="my-icon"
              style={{
                float: "none",
                margin: "0 .5em 0 0"
              }}
              size={"large"}
              name={item.icon}
            />
            {item.displayName}

            {item.subMenuItems &&
              item.subMenuItems.map((subItem, subIndex) => (
                <Menu.Menu
                  // styleName="my-menu"
                  style={{ textAlign: "center" }}
                  key={subIndex}
                >
                  <Menu.Item
                    // name={subItem.name}
                    active={this.isItemActive(pathname, subItem)}
                    onClick={e => {
                      this.handleItemClick(subItem);
                    }}
                  >
                    {subItem.displayName}
                  </Menu.Item>
                </Menu.Menu>
              ))}
          </Menu.Item>
        )
      );
    }

    const collapseSwitchItem = (
      <div
        style={{
          position: "fixed",
          width: leftSidebarWidth,
          bottom: 0,
          borderTop: "2px solid rgb(227, 230, 234)",
          textAlign: "right",
          cursor: "pointer"
        }}
        onClick={() => {
          this.setState({ isCollapsed: !isCollapsed });
          this.saveIsCollapsedToLocalStorage(!isCollapsed);
        }}
      >
        <Icon
          name={isCollapsed ? "angle double right" : "angle double left"}
          size={"big"}
          color={"grey"}
        />
      </div>
    );
    return (
      <div style={{ width: leftSidebarWidth }}>
        <Menu
          style={{
            // paddingTop: isCollapsed ? '52px' : '0',
            marginTop: headerHeight,
            width: "100%",
            maxWidth: leftSidebarWidth
          }}
          size={"massive"}
          borderless
          fixed={"left"}
          vertical
        >
          {renderMenuItems}
          {collapseSwitchItem}
        </Menu>
      </div>
    );
  }
}

export default VerticalMenu;

export const Usage = VerticalMenu;
