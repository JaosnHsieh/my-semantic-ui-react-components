import React from "react";
import PaginationTable from "./PaginationTable";
import { Usage } from "./PaginationTable";

let tt;
export default () => (
  <div style={{ border: "2px solid red", padding: "10px" }}>
    Container Area
    <div style={{ border: "2px solid blue", marginTop: "10px" }}>
      Tool bar Area
      <div>
        <h1> move Search Input overe here!! </h1>{" "}
      </div>
      <button> save</button>
    </div>
    <div style={{ border: "2px solid black", marginTop: "10px" }}>
      {`PaginationTable Aread`}
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
        initSortingField={"id"}
        initSortingOrderAsc={false}
        pagination
        itemsPerPage={2}
        searchKeyProperties={["id", "name"]}
      >
        {({ SearchBar, TableEle, PaginationBar }) => {
          return (
            <div>
              {PaginationBar}
              {SearchBar}
              {TableEle}
            </div>
          );
        }}
      </PaginationTable>
    </div>
  </div>
);
