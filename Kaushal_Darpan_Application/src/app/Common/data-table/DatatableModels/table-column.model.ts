
import { TableImageConfig } from "./table-image.model";

export type ColumnType =
  | 'serial'
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'time'
  | 'badge'
  | 'boolean'
  | 'image'
  | 'link'
  | 'action';

export interface TableColumn {

  /**
   * Property name from datasource
   * Example : Name, Website, Status
   */
  // field: string;
    dataField:string;

  /**
   * Column Header
   */
  // header: string;
  displayField?:string;

  /**
   * Column Type
   */
  type?: ColumnType;

  /**
   * Enable Sorting
   */
  sortable?: boolean;

  /**
   * Hide Column
   */
  hidden?: boolean;

  /**
   * Width
   * Example : 100px / 15%
   */
  width?: string;

  /**
   * Sticky Column
   */
  sticky?: boolean;

  /**
   * Alignment
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Date Format
   */
  format?: string;

  ellipsis?: boolean;

  maxLength?: number;

  formatter?: (value:any,row:any)=>any;

  imageConfig?: TableImageConfig;


  // -------------------------------
    // Runtime Properties
    // -------------------------------

    visible?: boolean;

    order?: number;

    fixed?: boolean;

    lockVisibility?: boolean;

}