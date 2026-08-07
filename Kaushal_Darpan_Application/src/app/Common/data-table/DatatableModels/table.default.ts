import { TableColumn } from "./table-column.model";
import { TableConfig } from "./table-config.model";
import { TableImageConfig } from "./table-image.model";

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



export const DEFAULT_IMAGE_CONFIG: TableImageConfig = {

    width: 40,

    height: 40,

    fit: 'cover',

    borderRadius: 'circle',

    hoverZoom: true,

    lazyLoad: true,

    defaultImage: 'assets/images/no-image.png',

    basePath: ''

};

export const DEFAULT_COLUMN: Partial<TableColumn> = {

    type: 'text',

    sortable: true,

    align: 'left',

    width: 'auto',

    hidden: false,

    sticky: false,

    ellipsis: false,

    maxLength: undefined,

    formatter: undefined,

    format: undefined,

    imageConfig: DEFAULT_IMAGE_CONFIG

};