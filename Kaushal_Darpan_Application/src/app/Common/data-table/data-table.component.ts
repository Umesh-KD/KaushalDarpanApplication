import { Component, EventEmitter, Input, Output ,OnChanges, AfterViewInit, ViewChild, SimpleChanges} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { TableAction } from './DatatableModels/table-action.model';
import { TableConfig } from './DatatableModels/table-config.model';
import { TableColumn } from './DatatableModels/table-column.model';
import { TableConstants } from './DatatableModels/table.constant';
import { DEFAULT_COLUMN, DEFAULT_IMAGE_CONFIG, DEFAULT_TABLE_CONFIG } from './DatatableModels/table.default';


@Component({
  selector: 'app-data-table',
  standalone: false,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent implements OnChanges, AfterViewInit {


  public TABLE_CONSTANTS = TableConstants;

  //#region Inputs
  @Input() config!: TableConfig;
  normalizedConfig!: TableConfig;
  @Input() data: any[] = [];
  @Input() loading = false;
  //#endregion



  //#region Outputs
  @Output() actionClick = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() searchChange = new EventEmitter<string>();
  //#endregion



 //#region ViewChild
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  //#endregion


   //#region Variables
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  filterText = '';
  normalizedColumns: TableColumn[] = [];
  //#endregion

   constructor() { }

  async ngOnInit()  {

    this.dataSource.filterPredicate = (data: any, filter: string) => {

      const value = JSON.stringify(data).toLowerCase();

      return value.includes(filter);

    };

  }
  //#region Life Cycle
ngOnChanges(changes: SimpleChanges): void {

  if (changes['config'] && this.config) {

    this.normalizeConfig();

    this.normalizeColumns();

    this.loadColumns();

  }

  if (changes['data']) {

    this.dataSource.data = this.data ?? [];

  }

}

 ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

    if (this.sort) {

      this.sort.sortChange.subscribe(sort => {

        this.sortChange.emit(sort);

      });

    }

    if (this.paginator) {

      this.paginator.page.subscribe(page => {

        this.pageChange.emit(page);

      });

    }

  }

private normalizeColumns(): void {

    if (!this.normalizedConfig?.columns?.length) {

        this.normalizedColumns = [];

        return;

    }

    this.normalizedColumns = this.normalizedConfig.columns.map(column => {

        // -------------------------
        // String Column
        // -------------------------
        if (typeof column === 'string') {

            return {

                ...DEFAULT_COLUMN,

                dataField: column,

                displayField: this.splitCamelCase(column),

                imageConfig: {
                    ...DEFAULT_IMAGE_CONFIG
                }

            } as TableColumn;

        }

        // -------------------------
        // Object Column
        // -------------------------

        return {

            ...DEFAULT_COLUMN,

            ...column,

            displayField:
                column.displayField ??
                this.splitCamelCase(column.dataField),

            imageConfig: {

                ...DEFAULT_IMAGE_CONFIG,

                ...column.imageConfig

            }

        } as TableColumn;

    });

}
private normalizeConfig(): void {

    this.normalizedConfig = {

        ...DEFAULT_TABLE_CONFIG,

        ...this.config

    } as TableConfig;

}
  //#region Initialization
private loadColumns(): void {

    this.displayedColumns = [];

    if (this.normalizedConfig.showSerialNo) {

        this.displayedColumns.push(TableConstants.SERIAL_COLUMN);

    }

   this.normalizedColumns
        .filter(x => !x.hidden)
        .forEach(x => {

            this.displayedColumns.push(x.dataField);

        });

    if (this.normalizedConfig.actions?.length) {

        this.displayedColumns.push(TableConstants.ACTION_COLUMN);

    }

}


//#region Search
applyFilter(event: Event): void {

  const filterValue = (event.target as HTMLInputElement).value;

  this.filterText = filterValue;

  this.dataSource.filter = filterValue.trim().toLowerCase();

  this.searchChange.emit(filterValue);

}


  //#region Serial Number
getSerialNumber(index: number): number {
  if (!this.paginator) {
    return index + 1;
  }
  return (
    this.paginator.pageIndex *
    this.paginator.pageSize +
    index +
    1
  );

}



//#region Row
rowClicked(row: any): void {
  this.rowClick.emit(row);
}



//#region Visibility
isVisible(action: TableAction, row: any): boolean {
  if (!action.visible) {
    return true;
  }
  return action.visible(row);
}


//#region Query Params
getQueryParams(action: TableAction, row: any): any {

  if (!action.queryParams) {
    return {};
  }

  // If queryParams is a function
  if (typeof action.queryParams === 'function') {
    return action.queryParams(row);
  }

  // From here TypeScript knows it's an object
  const queryParams = action.queryParams as Record<string, any>;

  const params: any = {};

  Object.keys(queryParams).forEach(key => {

    const value = queryParams[key];

    params[key] = row[value] ?? value;

  });

  return params;
}

getRouterLink(action: TableAction, row: any): string | any[] | null {

  if (!action.routerLink) {

    return null;

  }

  if (typeof action.routerLink === 'function') {

    return action.routerLink(row);

  }

  return action.routerLink;

}


//#region Action
buttonClick(action: TableAction, row: any): void {

  this.actionClick.emit({

    action: action.action,

    row: row

  });

}


//#region Status
getStatusClass(value: any): string {

  if (!this.normalizedConfig.badgeConfig) {
    return '';
  }

  const status = this.normalizedConfig.badgeConfig.find(
    x => x.value == value
  );

  return status?.cssClass ?? '';

}

getStatusText(value: any): string {

  if (!this.normalizedConfig.badgeConfig) {
    return value;
  }

  const status = this.normalizedConfig.badgeConfig.find(
    x => x.value == value
  );

  return status?.text ?? value;

}

//#region Column
getColumnWidth(column: TableColumn): string {
  return column.width ?? 'auto';
}


isActionColumn(column: TableColumn): boolean {
  return column.type === 'action';
}


isBadgeColumn(column: TableColumn): boolean {
  return column.type === 'badge';
}


isDateColumn(column: TableColumn): boolean {
  return column.type === 'date';
}


isLinkColumn(column: TableColumn): boolean {
  return column.type === 'link';
}


isBooleanColumn(column: TableColumn): boolean {
  return column.type === 'boolean';
}

//#region Alignment
getTextAlign(column: TableColumn): string {
  return column.align ?? 'left';
}

//#region Ellipsis
getDisplayValue(column: TableColumn, row: any): string {
  let value = row[column.dataField];
  if (value == null)
    return '';

  value = value.toString();
  if (column.ellipsis && column.maxLength && value.length > column.maxLength) {
    return value.substring(0, column.maxLength) + '...';
  }

  return value;

}

//#region Image
getImage(column: TableColumn, row: any): string {

    if (column.imageConfig?.resolver) {

        return column.imageConfig.resolver(row);

    }

    const image = row[column.dataField];

    if (!image) {

        return column.imageConfig?.defaultImage
            ?? DEFAULT_IMAGE_CONFIG.defaultImage!;

    }

    if (image.startsWith('http://') || image.startsWith('https://')) {

        return image;

    }

    if (column.imageConfig?.basePath) {

        return column.imageConfig.basePath + image;

    }

    return image;

}

setDefaultImage(event: any, column: TableColumn): void {

    event.target.src =

        column.imageConfig?.defaultImage

        ?? 'assets/images/no-image.png';

}

//#region Boolean
getBooleanIcon(value: boolean): string {
  return value ? 'check_circle' : 'cancel';
}

isDisabled(action:TableAction,row:any):boolean{

    if(!action.disabled)
        return false;

    return action.disabled(row);

}

getCssClass(action:TableAction,row:any){

    if(!action.cssClass)
        return '';

    if(typeof action.cssClass==='function')

        return action.cssClass(row);

    return action.cssClass;

}

getTooltip(action:TableAction,row:any){

    if(!action.tooltip)
        return action.label;

    if(typeof action.tooltip==='function')

        return action.tooltip(row);

    return action.tooltip;

}

getStatus(value:any){

    return this.normalizedConfig.badgeConfig
    ?.find(x=>x.value==value);

}

getCellValue(column:TableColumn,row:any){

    const value=row[column.dataField];

    if(column.formatter){
        return column.formatter(value,row);
    }

    return value;

}

getColumnType(column:TableColumn){

    return column.type ?? 'text';

}
isSortable(column:TableColumn){

    return column.sortable ?? true;

}

private splitCamelCase(text: string): string {

    if (!text) {
        return '';
    }
    
   return text
    .replace(/[_-]+/g, ' ')              // Student_Name → Student Name
    .replace(/([a-z])([A-Z])/g, '$1 $2') // InstituteName → Institute Name
    .replace(/\s+/g, ' ')                // Remove extra spaces
    .trim();

}

getDisplayField(column: TableColumn): string {

    if (column.displayField) {

        return column.displayField;

    }

    return this.splitCamelCase(column.dataField);

}



}
