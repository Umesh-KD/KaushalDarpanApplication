export class ReservationRosterDataModel {



  public Reservation_Id: number = 0;
  public CategoryId: number = 0;
  public ReservationPr: string = '';
  public IsHorizontalCateogory: boolean = false;
  public DepartmentId: number = 0;
  public AcademicYearID: number = 0;
  public Remarks: string = '';
  public ActiveStatus: boolean = true;
  public DeleteStatus: boolean = false;
  public ModifyBy: number = 0;
  public CreatedBy: number = 0;
  public IPAddress: string = '';

}

export class ReservationRosterSearchModel {
  public Reservation_Id: number = 0;
  public CategoryId: number = 0;
  public DepartmentId: number = 0;
  public AcademicYearID: number = 0;
}
