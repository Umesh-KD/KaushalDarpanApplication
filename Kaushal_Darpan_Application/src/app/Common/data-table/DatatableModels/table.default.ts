import { TableConfig } from "./table-config.model";

export const DEFAULT_TABLE_CONFIG: Partial<TableConfig> = {

   showSearch: true,

    showPagination: true,

    showSerialNo: true,

    serverSide: false,

    pageSize: 10,

    pageSizeOptions: [10, 20, 50, 100],

    stickyHeader: false,

    showExport: false,

    noDataMessage: "No Records Found",

    actions: []

};