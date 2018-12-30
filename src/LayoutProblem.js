/** this layout problem has been solved by ReactDOM.portal and render props pattern on 2018.12.30
 *            <SimplePortal mountNodeId="searchInputEleId">
                {SearchBar}
              </SimplePortal>
 */
import React from "react";
import PaginationTable from "./PaginationTable";
import SimplePortal from "./SimplePortal";

let tt;
export default () => (
  <div style={{ border: "2px solid red", padding: "10px" }}>
    Container Area
    <div style={{ border: "2px solid blue", marginTop: "10px" }}>
      Tool bar Area
      <div id="searchInputEleId" />
      <h1>
        {`YA!! moved <PaginationTable> Search Input over here even it's outside of <PaginationTable> component by ReactDOM.portal`}
      </h1>
    </div>
    <div style={{ border: "2px solid black", marginTop: "10px" }}>
      {`<PaginationTable> Area`}
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
            sortingField: "id"
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
            sortingField: "name"
          }
        ]}
        initSortingFields={["id"]}
        initSortingOrderAsc={false}
        pagination
        itemsPerPage={2}
        searchKeyProperties={["id", "name"]}
      >
        {({ SearchBar, TableEle, PaginationBar }) => {
          return (
            <div>
              <SimplePortal mountNodeId="searchInputEleId">
                {SearchBar}
              </SimplePortal>
              {PaginationBar}
              {TableEle}
            </div>
          );
        }}
      </PaginationTable>
    </div>
  </div>
);
