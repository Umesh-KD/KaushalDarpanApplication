import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { GuestRoomManagmentService } from '../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CreateGuestRoomSeatDataModel, GuestRoomSeatSearchModel, StatusChangeGuestModel } from '../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app- guestroom-seat-master',
  templateUrl: './guestroom-seat-master.component.html',
  styleUrls: ['./guestroom-seat-master.component.css'],
  standalone: false
})

export class GuestRoomSeatMasterComponent {
  groupForm!: FormGroup;
  GRSMasterID: number | null = null;
  isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  Table_SearchText: string = "";
  tbl_txtSearch: string = '';
  State: number = -1;
  Message: any = [];
  ErrorMessage: any = [];
  WarningMassage: any = [];
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  request = new CreateGuestRoomSeatDataModel()
  searchRequest = new GuestRoomSeatSearchModel();
  StautsChangeMdl = new StatusChangeGuestModel()
  GuestRoomList: any = [];
  GuestHouseNameList: any = [];
  RoomTypeList: any = [];
  d_type: string = '';
  displayedColumns: string[] = [
    'SNo', 'RoomNo', 'RoomType', 'StudyTableFacilities', 'FanFacilities',
    'CoolingFacilities', 'AttachedBathFacilities', 'Action'
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private _GuestRoomManagmentService: GuestRoomManagmentService, 
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.groupForm = this.fb.group({
      ddlGuestHouseID: [0, [DropdownValidators]],
      txtRoomType: [0, [DropdownValidators]],
      txtRoomFee: [null,
        [
          Validators.required,
          Validators.pattern(/^(?!0)\d+$/), 
          Validators.min(1),              
          this.zeroNotAllowed.bind(this)  
        ]],
      txtSeatCapacity: [{ value: '', disabled: true }, Validators.required],
      txtRoomQuantity: [
        null,
        [
          Validators.required, 
          Validators.pattern(/^(?!0)\d+$/),
          Validators.min(1),              
          this.zeroNotAllowed.bind(this) 
        ]
      ]
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllRoomSeatList();
    await this.GetGuestHouseNameList();
    await this.GetRoomTypeList();
  }
  get _groupForm() { return this.groupForm.controls; }

  async changeSeats() {
    if (this.request.RoomType == 172) {
      this.request.SeatCapacity = 1;
      this.groupForm.get('txtSeatCapacity')?.disable();
    }
    else if (this.request.RoomType == 173) {
      this.request.SeatCapacity = 2;
      this.groupForm.get('txtSeatCapacity')?.disable();
    }
    else if (this.request.RoomType == 174) {
      this.request.SeatCapacity = 3;
      this.groupForm.get('txtSeatCapacity')?.disable();
    }
    else if (this.request.RoomType == 175) {
      this.request.SeatCapacity = 4;
      this.groupForm.get('txtSeatCapacity')?.disable();
    }
    else if (this.request.RoomType == 176) {
      this.request.SeatCapacity = 0;
      this.groupForm.get('txtSeatCapacity')?.enable();
      this.groupForm.get('txtSeatCapacity')?.setValue(0);
    }
    //else {
    //  this.groupForm.get('txtSeatCapacity')?.disable();
    //}
  }

  async GetGuestHouseNameList() {
    try {
      this.loaderService.requestStarted();
      
      //this.searchRequest.InstituteID = 9;
      await this._GuestRoomManagmentService.GetGuestHouseNameList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.GuestHouseNameList = data['Data'];
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
 
  //async saveData() {
  //  this.isSubmitted = true;
  //  if (this.groupForm.invalid) {
  //    return console.log("error")
  //  }
  //  if (this.request.RoomFee == 0) {
  //    this.toastr.warning("Room Fee is required!")
  //    return console.log("error")
  //  }
  //  //Show Loading
  //  this.loaderService.requestStarted();
  //  this.isLoading = true;
  //  try {
  //    if (this.GRSMasterID) {
  //      this.request.GRSMasterID = this.GRSMasterID
  //      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
  //    }
  //    else {
  //      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
  //    }

  //    await this._GuestRoomManagmentService.GuestRoomSeatMasterSaveData(this.request)
  //        .then((data: any) => {
  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];
  //          if (this.State == EnumStatus.Success) {
  //            this.ResetControl();
  //            this.toastr.success(this.Message)

  //            this.GetAllRoomSeatList();

  //          } else if (this.State == EnumStatus.Warning) {
  //            this.toastr.warning(this.ErrorMessage)

  //          }
  //          else {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //        })
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //      this.isLoading = false;

  //    }, 200);
  //  }

  //}
  async saveData() {
    this.isSubmitted = true;

    if (this.groupForm.invalid) {
      console.log("error");
      return;
    }

    // Check if Room Fee is 0
    if (this.request.RoomFee == 0) {
      this.toastr.warning("Room Fee is required!");
      console.log("error");
      return;
    }

    // Check if Room Quantity is 0
    if (this.request.RoomQuantity == 0) {
      this.toastr.error("Room Quantity cannot be 0!");
      console.log("error");
      return;
    }

    // Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (this.GRSMasterID) {
        this.request.GRSMasterID = this.GRSMasterID;
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }

      await this._GuestRoomManagmentService.GuestRoomSeatMasterSaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.ResetControl();
            this.toastr.success(this.Message);
            this.GetAllRoomSeatList();
          } else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage);
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        });
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }


  async ResetControl() {
    this.isSubmitted = false;
    this.request = new CreateGuestRoomSeatDataModel();
    this.groupForm.reset();
    this.groupForm.patchValue({
      ddlGuestHouseID: ['0'],
      txtRoomType: ['0'],
      txtRoomFee: [''],
      txtSeatCapacity: [''],
      txtRoomQuantity: [''],
    });
    this.request.GuestHouseID = 0;
    this.GRSMasterID = 0;
    this.GetAllRoomSeatList();
    this.isUpdate = false;
  }

  async GetAllRoomSeatList() {
    try {
      this.loaderService.requestStarted();
      await this._GuestRoomManagmentService.GetAllRoomSeatList(this.searchRequest)
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

  async GetByGRSMasterID(id: number) {    
    try {
      this.loaderService.requestStarted();
      await this._GuestRoomManagmentService.GetByGRSMasterID(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data !== null) {
          this.request.GRSMasterID = data.Data.GRSMasterID;
          this.request.GuestHouseID = data.Data.GuestHouseID;
          this.request.RoomType = data.Data.RoomType;
          this.request.SeatCapacity = data.Data.SeatCapacity;
          this.request.RoomQuantity = data.Data.RoomQuantity;
          this.request.RoomFee = data.Data.RoomFee;
          this.GRSMasterID = data.Data.GRSMasterID;
          this.isUpdate = true;
        }
        console.log(this.request, "request")
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DeleteDataByGRSMasterID(GRSMasterID: number) {
    this.StautsChangeMdl.PK_ID = GRSMasterID;
    this.StautsChangeMdl.ModifyBy = this.sSOLoginDataModel.UserID;

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this._GuestRoomManagmentService.DeleteDataByGRSMasterID(this.StautsChangeMdl)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetAllRoomSeatList();
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

  async GetRoomTypeList() {
    try {
      this.loaderService.requestStarted();
     debugger
      this.d_type = "HostelRoomSeatType";
      //this.searchRequest.InstituteID = 9;
      await this.commonMasterService.GetCommonMasterDDLByType(this.d_type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoomTypeList = data['Data'];
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

  //validateNumber(event: KeyboardEvent) {
  //  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
  //  if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
  //    event.preventDefault();
  //  }
  //}
  validateNumber(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // block non-numeric and negative sign
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onRoomQuantityChange(event: any) {
    if (event.target.value < 0) {
      this.groupForm.patchValue({ txtRoomQuantity: 0 });
    }
  }

  zeroNotAllowed(control: AbstractControl): ValidationErrors | null {
    return control.value != null && Number(control.value) === 0
      ? { zeroNotAllowed: true }
      : null;
  }


}
