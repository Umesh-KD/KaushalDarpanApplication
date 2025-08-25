import { Component, OnInit, ViewChild } from '@angular/core';
import { GuestApplyForGuestRoomDataModel, GuestApplyForGuestRoomSearchModel, GuestRoomSeatSearchModel, GuestStaffProfileSearchModel } from '../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { GuestRoomManagmentService} from '../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { Router } from '@angular/router';
import { AppsettingService } from '../../../Common/appsetting.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-AddGuestApplyForGuestRoom',
  standalone: false,
  templateUrl: './AddGuestApplyForGuestRoom.component.html',
  styleUrl: './AddGuestApplyForGuestRoom.component.css'
})
export class AddGuestApplyForGuestRoomComponent {
  public ID: number = 0;
  public request = new GuestApplyForGuestRoomDataModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isSubmit: boolean = false;
  public SSOIDExists!: boolean;
  public State: number = 0;
  public key: number = 0;
  public totalRecord: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public IIPMasterFormGroup!: FormGroup;
  public SSOIDFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public mincampusDate: string = '';
  public GuestRoomApplyList : any[]=[]
  public searchRequest = new GuestApplyForGuestRoomSearchModel();
  public searchRequest1 = new GuestRoomSeatSearchModel();
  public searchRequestGuestStaffProfileSearchModel = new GuestStaffProfileSearchModel()
  public todayDate: string = this.formatDate(new Date());
  public d_type: string = '';
  public GuestRoomList: any = [];
  public GuestRoomNameList: any = [];
  public RoomTypeList: any = [];
  public RoomAvailablity: number = 0;
  displayedColumns: string[] = [
    'SNo', 'RequestName', 'InstituteName', 'DepartmentName',
    'FromDateTime', 'ToDateTime', 'Reason', 'StatusName',
    'Remark', 'GuestHouseName', 'RoomQuantity', 'RoomType',
    'RoomFee', 'CheckinCheckout', 'Action'
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private appsettingConfig: AppsettingService,private commonMasterService: CommonFunctionService, private guestRoomManagmentService: GuestRoomManagmentService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private Swal2: SweetAlert2, private routers: Router) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequestGuestStaffProfileSearchModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequestGuestStaffProfileSearchModel.SSOID = this.sSOLoginDataModel.SSOID;
    this.searchRequestGuestStaffProfileSearchModel.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequestGuestStaffProfileSearchModel.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.SSOIDFormGroup = this.formBuilder.group({
      SSOID: ['', Validators.required]
    });
    this.IIPMasterFormGroup = this.formBuilder.group(
      {
        DisplayName: ['', Validators.required],
        PostalCode: ['', Validators.required],
        MailPersonal: ['', Validators.required],
        MobileNo: ['', Validators.required],
        PostalAddress: ['', Validators.required],
        EmpID: ['', []],
        txtFromDate: ['', Validators.required],
        txtFromTime: [''],
        txtToDate: ['', Validators.required],
        txtToTime: [''],
        Reason: [''],
        txtRoomFee: [{ value: '', disabled: true }, Validators.required],
        ddlGuestHouseID: ['', Validators.required],
        txtRoomType: ['', Validators.required],
        txtSeatCapacity: ['', Validators.required],
        txtRoomQuantity: ['', Validators.required]
      });
    
    await this.loadData();
    await this.GetGuestRoomApplyList();
    await this.GetAllRoomSeatList();
    await this.GetGuestRoomNameList();
  }

  async loadData() {    
    const today = new Date();
    this.todayDate = this.formatDate(today);
    this.request.FromDate = this.formatDate(today);

    // Add 1 day to today for ToDate
    const toDate = new Date(today); // clone the date
    toDate.setDate(toDate.getDate() + 1);
    this.request.ToDate = this.formatDate(toDate);

    const hours = today.getHours();
    const minutes = today.getMinutes();
    this.request.FromTime = this.formatTime(hours, minutes);
    this.request.ToTime = this.formatTime(hours, minutes);
  }


  get _IIPMasterFormGroup() { return this.IIPMasterFormGroup.controls; }
  get _SSOIDFormGroup() { return this.SSOIDFormGroup.controls; }

  async CheckUserExists(SSOID: any) {
    if (SSOID.target.value != null) {
      debugger
      this.isSubmit = true;
      await this.commonMasterService.CheckSSOIDExists(SSOID.target.value, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data.body));
          this.searchRequestGuestStaffProfileSearchModel.SSOID = SSOID.target.value;
          if (data['State'] === 1) {
            this.toastr.success(data.Message);
            this.SSOIDExists = true;
          } else {
            this.toastr.warning(data.Message);
            this.SSOIDExists = false;
          }
        }, error => console.error(error));
    }
  }

  async PostUserExists() {
    if (this.SSOIDExists) {    
      await this.loadData();
      await this.guestRoomManagmentService.GuestStaffProfile(this.searchRequestGuestStaffProfileSearchModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.request.CollegeID = data['Data'];
          this.request.DepartmentName = this.sSOLoginDataModel.DepartmentName;
          this.request.InstituteName = data['Data'][0]['InstituteName'];
          this.request.CollegeID = data['Data'][0]['InstituteID'];
          this.request.DisplayName = data['Data'][0]['DisplayName'];
          this.request.FirstName = data['Data'][0]['DisplayName'];
          this.request.State = data['Data'][0]['StateName'];
          this.request.PostalCode = data['Data'][0]['Pincode'];
          this.request.TelephoneNumber = data['Data'][0]['MobileNumber'];
          this.request.MailPersonal = data['Data'][0]['Email'];
          this.request.MobileNo = data['Data'][0]['MobileNumber'];
          this.request.PostalAddress = data['Data'][0]['Address'];
        }, error => console.error(error));
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    } else {
      this.toastr.warning("Not Exists SSOID");
    }
  
}

  onFromDateChange() {
    const fromDate = new Date(this.request.FromDate);
    this.minToDate = this.formatDate(new Date(fromDate));
    // Add 1 day to today for ToDate
    const toDate = new Date(this.request.FromDate); // clone the date
    toDate.setDate(toDate.getDate() + 1);
    this.request.ToDate = this.formatDate(toDate);

    this.IIPMasterFormGroup.patchValue({ ddlGuestHouseID: 0 });
    this.RoomTypeList = [];
    this.request.SeatCapacity = 0;
    this.RoomAvailablity = 0;
  }

  // Helper function to format date as YYYY-MM-DD
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  minToDate: string = this.todayDate; 

  // Helper function to format time as HH:mm
  formatTime(hours: number, minutes: number): string {
    return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`;
  }


  ToDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero to month
    const day = ('0' + date.getDate()).slice(-2); // Add leading zero to day
    return `${year}-${month}-${day}`;
  }

  // Helper function to format time as HH:mm
  ToTime(hours: number, minutes: number): string {
    return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}`;
  }
 
  async GetGuestRoomApplyList() {
    try {
      this.loaderService.requestStarted();
      this.GuestRoomApplyList = [];

      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.CollegeID = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
     
      await this.guestRoomManagmentService.GetAllGuestApplyForGuestRoomList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GuestRoomApplyList = data['Data'];
          this.totalRecord = data['Data'].length;
          this.initTable();
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async btnDeleteOnClick(item: any) {
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            item.DeleteStatus = true;
            item.ActiveStatus = false;
            item.ModifyBy = this.sSOLoginDataModel.UserID;
            await this.guestRoomManagmentService.GuestApplyForGuestRoomSaveData(item)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == 1) {
                  this.toastr.success(this.Message)
                  this.ResetControls();
                  this.loadData();
                  this.GetGuestRoomApplyList();
                  this.RoomAvailablity = 0;
                }

                else {
                  this.toastr.error(this.ErrorMessage)
                }

              }, (error: any) => console.error(error)
              );
          }
          catch (ex) {
            console.log(ex);
          }
          finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
    
  }

  // get detail by id
  async SaveData() {
    debugger
    try {
      this.isSubmitted = true;
      if (this.IIPMasterFormGroup.invalid) {
        return
      }
      if (this.request.GuestHouseID == 0 ) {
        this.toastr.warning("Guest House Name is requird !");
        return
      } else if (this.request.RoomType == 0 ) {
        this.toastr.warning("Guest House Room Type is requird !");
        return
      } else if (this.request.RoomQuantity == 0) {
        this.toastr.warning("Guest House Room Quantity is requird !");
        return
      }
      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.RoleID = this.sSOLoginDataModel.RoleID;
      this.request.Status = 215;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.RequestSSOID = this.SSOIDFormGroup.value.SSOID;

      //save
      await this.guestRoomManagmentService.GuestApplyForGuestRoomSaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          
          if (this.State == 1) {             
            this.toastr.success(this.Message)
            this.ResetControls();
            this.loadData();
            this.GetGuestRoomApplyList();
            this.RoomAvailablity = 0;
            this.isSubmitted = false;
          }
          
          else {
            this.toastr.error(this.ErrorMessage)
          }

        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png') {
        
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          
        }
        else {
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.Dis_EmpIDCardPhoto = data['Data'][0]["Dis_FileName"];
                this.request.EmpIDCardPhoto = data['Data'][0]["FileName"];

              }
              if (Type == "Photo1") {
                this.request.Dis_IDProofPhoto = data['Data'][0]["Dis_FileName"];
                this.request.IDProofPhoto = data['Data'][0]["FileName"];
              }

            
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
     
      this.loaderService.requestEnded();
     
    }
  }

  // reset
  ResetControls() {
    this.request = new GuestApplyForGuestRoomDataModel();
    this.SSOIDFormGroup.patchValue({
      SSOID: ''
    });
    this.isSubmit = false;
  }

  async changeSeats() {
    debugger
    this.request.RoomQuantity = 0;
    // 1. Parse request start and end using correct parser
    const requestedStart = this.parseCustomDate1(this.request.FromDate, this.request.FromTime + ":00");
    const requestedEnd = this.parseCustomDate1(this.request.ToDate, this.request.ToTime + ":00");

    // 2. Filter overlapping bookings for the same RoomType and GuestHouseID
    const overlappingBookings = this.GuestRoomApplyList.filter(
      (x: { ToDate: string; ToTime: string; FromTime: string; FromDate: string; RoomType: number; GuestHouseID: number; RoomQuantity: number }) => {
        const existingStart = this.parseCustomDate(x.FromDate, x.FromTime);
        const existingEnd = this.parseCustomDate(x.ToDate, x.ToTime);

        const isOverlapping = requestedStart < existingEnd && requestedEnd > existingStart;

        return isOverlapping &&
          x.RoomType === Number(this.request.RoomType) &&
          x.GuestHouseID === Number(this.request.GuestHouseID);
      }
    );

    // 3. Sum RoomQuantity of overlapping bookings
    const totalBookedQuantity = overlappingBookings.reduce((sum, item) => sum + item.RoomQuantity, 0);

    // 4. Get total rooms for the selected GuestHouseID
    const totalRoomQuantity = this.GuestRoomList
      .filter((x: { GuestHouseID: number; RoomType: number; }) => x.RoomType === Number(this.request.RoomType) &&
        x.GuestHouseID === Number(this.request.GuestHouseID))
      .reduce((sum: number, item: any) => sum + item.RoomQuantity, 0);

    // 5. Calculate availability
    this.RoomAvailablity = totalRoomQuantity - totalBookedQuantity;

    // 6. Show warning if no availability
    if (this.RoomAvailablity <= 0) {
      this.toastr.warning("Room Type Not Available!");
    }



    if (this.request.RoomType == 172) {
      this.request.SeatCapacity = 1;
      this.IIPMasterFormGroup.get('txtSeatCapacity')?.disable();
    }
    else if (this.request.RoomType == 173) {
      this.request.SeatCapacity = 2;
      this.IIPMasterFormGroup.get('txtSeatCapacity')?.disable();
    }
    else if (this.request.RoomType == 174) {
      this.request.SeatCapacity = 3;
      this.IIPMasterFormGroup.get('txtSeatCapacity')?.disable();
    }
    else if (this.request.RoomType == 175) {
      this.request.SeatCapacity = 4;
      this.IIPMasterFormGroup.get('txtSeatCapacity')?.disable();
    }
    else if (this.request.RoomType == 176) {
      this.request.SeatCapacity = 0;
      this.IIPMasterFormGroup.get('txtSeatCapacity')?.enable();
      this.IIPMasterFormGroup.get('txtSeatCapacity')?.setValue(0);
    }
    //else {
    //  this.groupForm.get('txtSeatCapacity')?.disable();
    //}
  }

  // Helper: safe parser for 'DD-MM-YYYY' and 'HH:mm:ss'
  parseCustomDate(date: string, time: string): Date {
    const [day, month, year] = date.split('-').map(Number);
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  parseCustomDate1(dateStr: string, timeStr: string) {
    return new Date(`${dateStr}T${timeStr}`);
  }

  async GetRoomTypeList() {
    try {
      this.RoomAvailablity = 0;
      this.RoomTypeList = [];
      this.request.SeatCapacity = 0;
      this.request.RoomQuantity = 0;
      let RoomTypeList = this.GuestRoomList.filter(
        (x: { GuestHouseID: number}) =>
          x.GuestHouseID === Number(this.request.GuestHouseID));
      if (RoomTypeList.length > 0) {
        this.RoomTypeList = RoomTypeList;
      } else {
        this.toastr.warning("Room Type Not Available !")
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetAllRoomSeatList() {
    try {
      this.loaderService.requestStarted();
      await this.guestRoomManagmentService.GetAllRoomSeatList(this.searchRequest1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GuestRoomList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetGuestRoomNameList() {
    try {
      this.loaderService.requestStarted();
      await this.guestRoomManagmentService.GetGuestHouseNameList(this.searchRequest1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GuestRoomNameList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getRoomPrice() {
    try {
      this.loaderService.requestStarted();
      debugger
      let GuestRoomListDetails = this.GuestRoomList.filter(
        (x: { GuestHouseID: number; RoomType: number }) =>
          x.GuestHouseID === Number(this.request.GuestHouseID) &&
          x.RoomType === Number(this.request.RoomType)
      );
      if (GuestRoomListDetails.length > 0) {
        this.request.RoomFee = GuestRoomListDetails[0].FeePerBad * Number(this.request.RoomQuantity);
        if (this.RoomAvailablity < Number(this.request.RoomQuantity)) {
          this.request.RoomQuantity = 0;
          this.toastr.warning("Room Type Not Available!");
        }

        // 6. Show result
        if (this.RoomAvailablity == 0) {
          this.toastr.warning("Room Type Not Available!");
        }
      } else {
        this.toastr.warning("Room Type Not Available !")
      }
      
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  initTable() {
    this.dataSource = new MatTableDataSource(this.GuestRoomApplyList);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (d: any, filter: string) => {
      const dataStr = Object.values(d).join(' ').toLowerCase();
      return dataStr.includes(filter);
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getRoomTypeName(type: number): string {
    switch (type) {
      case 172: return '1 Bed';
      case 173: return '2 Bed';
      case 174: return '3 Bed';
      case 175: return '4 Bed';
      default: return 'Dormitory/Hall';
    }
  }

}
