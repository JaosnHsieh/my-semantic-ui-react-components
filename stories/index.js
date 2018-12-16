import React from "react";
import { storiesOf } from "@storybook/react";
import { Button } from "@storybook/react/demo";
import {
  Usage as AclVerticalMenu,
  Usage2 as AclVerticalMenu2
} from "../src/AclVerticalMenu";
import {
  Usage as OrderableList,
  Usage2 as OrderableList2
} from "../src/OrderableList";
import { Usage as BlurOverlay } from "../src/BlurOverlay";

storiesOf("Button", module)
  .add("with text", () => <Button>Hello Button</Button>)
  .add("with some emoji", () => (
    <Button>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));

storiesOf("VerticalMenu", module)
  .add("Collapsed", () => <AclVerticalMenu />)
  .add("SubMenu", () => <AclVerticalMenu2 />);

storiesOf("OrderableList", module)
  .add("DragAndDrop", () => <OrderableList />)
  .add("No DragAndDrop", () => <OrderableList2 />);

storiesOf("BlurOverlay", module).add("BlurOverlay", () => <BlurOverlay />);
