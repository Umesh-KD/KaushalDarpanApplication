import { TableAction } from './table-action.model';
import { TableColumn } from './table-column.model';
import { TableStatus } from './table-status.model';

export interface TableConfig {

    showSerialNo?: boolean;

    serverSide?:boolean;
      /**
     * Search Box
     */
    showSearch?: boolean;

    /**
     * Pagination
     */
    showPagination?: boolean;

    /**
     * Export Button
     */
    showExport?: boolean;

    /**
     * Sticky Header
     */
    stickyHeader?: boolean;

    /**
     * Default Page Size
     */
    pageSize?: number;

    /**
     * Page Size Options
     */
    pageSizeOptions?: number[];

    /**
     * Empty Message
     */
    noDataMessage?: string;

    /**
     * Columns
     */
    // columns: TableColumn[];
    columns: Array<string | TableColumn>;

    /**
     * Action Buttons
     */
    actions?: TableAction[];

    /**
     * Status Configuration
     */
    badgeConfig?: TableStatus[];

  
}