export interface TableAction {

  /**
   * Action Name
   */
  action: string;

  /**
   * Tooltip
   */
  label: string;

  /**
   * Icon Class
   * Example:
   * ti ti-pencil
   * ti ti-trash
   * ti ti-eye
   */
  icon: string;

  /**
   * button
   * router
   */
  type: ActionType;

  /**
   * Route
   */
//  routerLink?: string | any[] | ((row: any) => string | any[]);
routerLink?: RouterResolver;

  /**
   * Dynamic Query Params
   *
   * Example:
   * {
   *   CompanyID:'ID',
   *   key:2
   * }
   */
// queryParams?: Record<string, any> | ((row: any) => any);
queryParams?: QueryParamResolver;

  /**
   * Tooltip
   */
 tooltip?:string | ((row:any)=>string);

  /**
   * CSS Class
   */
  
  cssClass?:string | ((row:any)=>string);

  /**
   * Visible Function
   */
  visible?: (row: any) => boolean;

  /**
   * Disabled Function
   */
  disabled?: (row: any) => boolean;

}


export type QueryParamResolver =
    Record<string, any>
    | ((row: any) => Record<string, any>);


export type RouterResolver =
    string
    | any[]
    | ((row:any)=>string|any[]);    

export enum ActionType {
  Button = 'button',
  Router = 'router'
}    