import React, { Component } from "react";
import _ from "lodash";
import { Icon, Menu } from "semantic-ui-react";
import styles from "./VerticalMenu.css";
import { headerHeight, leftSidebarWidth } from "./SidebarLayout";

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
        otherActiveRegexArr: [/\/project\/edit/i] // don't put g flag because of regex lastIndex
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
class VerticalMenu extends Component {
  constructor() {
    super();
    this.state = {
      activeItemName: "myprojects"
    };
  }
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

  render() {
    // const { activeItemName } = this.state;
    const { activeItemName } = this.props;
    const pathname = window.location.pathname;
    return (
      <div className="menu-sidebar">
        <Menu
          style={{
            marginTop: headerHeight,
            width: "100%",
            maxWidth: leftSidebarWidth
          }}
          size={"massive"}
          borderless
          fixed={"left"}
          vertical
        >
          {/* <Menu.Item>
            <Input placeholder="Search..." />
          </Menu.Item> */}
          {menuItems.map(
            (item, index) =>
              me.can(item.acl) && (
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
                  <Icon styleName="my-icon" size={"big"} name={item.icon} />
                  {item.displayName}
                  {item.subMenuItems &&
                    item.subMenuItems.map((subItem, subIndex) => (
                      <Menu.Menu styleName="my-menu" key={subIndex}>
                        <Menu.Item
                          name={subItem.name}
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
          )}
        </Menu>
      </div>
    );
  }
}

export default VerticalMenu;
