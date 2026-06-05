export class OrderCategoryMasterModel {
  OrderCategoryID: number = 0;
  CategoryName: string = '';
  CreatedBy: number = 0;
  CreatedDate?: Date;
  ModifyBy: number = 0;
  ModifyDate?: Date;
  IsActive: boolean = true;
}
