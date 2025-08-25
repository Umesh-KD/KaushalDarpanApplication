import { Component, ElementRef, ViewChild } from '@angular/core';
//import { FormBuilder } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
//import { ActivatedRoute } from '@angular/router';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CreateHostelRoomSeatDataModel, HostelRoomSeatSearchModel, StatusChangeModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';

@Component({
  selector: 'app-room-seat-master',
  templateUrl: './room-seat-master.component.html',
  styleUrls: ['./room-seat-master.component.css'],
  standalone: false
})

export class RoomSeatMasterComponent {
  groupForm!: FormGroup;
  public HRSMasterID: number | null = null;
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public WarningMassage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new CreateHostelRoomSeatDataModel()
  StautsChangeMdl = new StatusChangeModel()
  public searchRequest = new HostelRoomSeatSearchModel();
 // public DistrictMasterList: any = [];
  //public StaffID: number | null = null;
  public HostelList: any = [];
  public HostelNameList: any = [];
  public RoomTypeList: any = [];
  public d_type: string = '';
  public isFormVisible: boolean = false;
  public isUpdate: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  paginatedHostelList: any[] = [];
  @ViewChild('hostelNameRef') hostelNameElement!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private _HostelManagmentService: HostelManagmentService,
    private route: ActivatedRoute,
    private router: Router,
    private routers: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private modalService: NgbModal
  ) { }


  async ngOnInit() {




    this.groupForm = this.fb.group({
      ddlHostelID: ['', [DropdownValidators]],
      txtRoomType: ['', [DropdownValidators]],
      txtRoomFee: ['', Validators.required],
      txtSeatCapacity: [{ value: '', disabled: true }, Validators.required],
      txtRoomQuantity: ['', Validators.required]
    });
    //this.searchRequest.DepartmentID = 2;
    //await this.getHostelTypeList();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllRoomSeatList();
    await this.GetHostelNameList();
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


  async GetHostelNameList() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      //this.searchRequest.InstituteID = 9;
      await this._HostelManagmentService.GetHostelNameList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HostelNameList = data['Data'];
          console.log('Hostel List ==>',this.HostelNameList)
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

  //async SaveRoomSeatData() {
  //  
  //  this.isSubmitted = true;
  //  if (this.groupForm.invalid) {
  //    return console.log("error")
  //  }
  //  //Show Loading
  //  this.loaderService.requestStarted();
  //  this.isLoading = true;

  //  try {

  //    if (this.HRSMasterID) {
  //      this.request.HRSMasterID = this.HRSMasterID
  //      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
  //    } else {
  //      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
  //    }

  //    //this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    //this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
  //    console.log("this.request", this.request)
  //    await this._HostelManagmentService.SaveRoomSeatData(this.request)
  //      .then((data: any) => {
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (this.State === EnumStatus.Success) {
  //          this.toastr.success(this.Message)
  //          this.ResetControl();
  //          this.GetAllRoomSeatList();

  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage)
  //        }
  //      })
  //  }
  //  catch (ex) { console.log(ex) }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //      this.isLoading = false;

  //    }, 200);
  //  }
  //}


  async SaveRoomSeatData() {
    debugger
    try {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
   
    this.isLoading = true;
      this.loaderService.requestStarted();
    
      if (this.HRSMasterID) {
        this.request.HRSMasterID = this.HRSMasterID
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      }
      else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      
      await this._HostelManagmentService.SaveRoomSeatData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (data.State == EnumStatus.Success)
          {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetAllRoomSeatList();
          }
          else if (data.State == EnumStatus.Warning)
          {
            this.toastr.error(this.ErrorMessage);

          }
        
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }



  async ResetControl() {
    this.isSubmitted = false;
    this.isUpdate = false; // Reset isUpdate
    this.request = new CreateHostelRoomSeatDataModel();
    this.groupForm.reset();
    this.groupForm.patchValue({
      ddlHostelID: ['0'],
      txtRoomType: ['0'],
      txtRoomFee: [''],
      
      txtRoomQuantity: ['']
    });
    this.request.HostelID = 0;
    this.GetAllRoomSeatList();
    this.currentPage = 1; // Reset to first page
  }


  //async ResetControl() {
  //  this.isSubmitted = false;

  //  this.request = new CreateHostelRoomSeatDataModel();
  //  this.groupForm.reset();
  //  // Reset form values if necessary
  //  //this.groupForm.patchValue({
  //  //});
  //  this.request.HostelID = 0;

  //  this.GetAllRoomSeatList();
  //}

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedHostelList = this.HostelList.slice(startIndex, endIndex);
  }

  async GetAllRoomSeatList() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      //this.searchRequest.InstituteID = 9;
      await this._HostelManagmentService.GetAllRoomSeatList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HostelList = data['Data'];
          this.updatePagination(); //  apply pagination
          //console.log(this.HostelList, "HostelList")
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

  async GetByHRSMasterID(id: number) {
    
    try {
      this.loaderService.requestStarted();
      await this._HostelManagmentService.GetByHRSMasterID(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        if (data.Data !== null) {
          console.log(data.Data, "edit");
          this.request.HRSMasterID = data.Data.HRSMasterID;
          this.request.HostelID = data.Data.HostelID;
          this.request.RoomType = data.Data.RoomType;
          this.request.SeatCapacity = data.Data.SeatCapacity;
          this.request.RoomQuantity = data.Data.RoomQuantity;
          this.request.RoomFee = data.Data.RoomFee;

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

  async DeleteDataByHRSMasterID(HRSMasterID: number) {
    this.StautsChangeMdl.PK_ID = HRSMasterID;
    this.StautsChangeMdl.ModifyBy = this.sSOLoginDataModel.UserID;
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            // 
            this.loaderService.requestStarted();
            await this._HostelManagmentService.DeleteDataByHRSMasterID(this.StautsChangeMdl)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State === EnumStatus.Success) {
                  this.toastr.success(this.Message || 'Deleted successfully');
                  this.GetAllRoomSeatList();
                } else {
                  this.toastr.error(this.ErrorMessage || 'Something went wrong');
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
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.d_type = "HostelRoomSeatType";
      //this.searchRequest.InstituteID = 9;
      await this.commonMasterService.GetCommonMasterDDLByType(this.d_type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoomTypeList = data['Data'];
          console.log('Room Type List ==>',this.RoomTypeList)
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


  onAddClick() {   
    this.isUpdate = false;
    this.isFormVisible = true;
    this.ResetControl();

    setTimeout(() => {
      this.hostelNameElement?.nativeElement?.focus();
    }, 0);
  }
 


  onEditClick(HRSMasterID: number) {
    this.GetByHRSMasterID(HRSMasterID); 
    this.isUpdate = true;
    this.isFormVisible = true;

    setTimeout(() => {
      this.hostelNameElement?.nativeElement?.focus();
    }, 0);
  }

  cancelForm() {
    this.isFormVisible = false;
    this.isUpdate = false;
    this.groupForm.reset();
  }

}
