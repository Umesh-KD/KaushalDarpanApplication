import {  Component, ElementRef, ViewChild } from '@angular/core';
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
import { CreateHostelDataModel, HostelSearchModel, StatusChangeHostelModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';

@Component({
  selector: 'app-create-hostel',
  templateUrl: './create-hostel.component.html',
  styleUrls: ['./create-hostel.component.css'],
  standalone: false
})
export class CreateHostelComponent   {
  groupForm!: FormGroup;
  public HostelID: number | null = null;
  public isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new CreateHostelDataModel()
  StautsChangeMdl = new StatusChangeHostelModel()
  public searchRequest = new HostelSearchModel();
  public DistrictMasterList: any = [];
  public HostelTypeList: any = [];
  public StaffID: number | null = null;
  public HostelList: any = [];
  public isFormVisible: boolean = false;
  @ViewChild('txtHostelName') hostelNameElement!: ElementRef;
  shouldFocusHostelName: boolean = false;

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
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));



    this.groupForm = this.fb.group({
      txtHostelName: ['', Validators.required],
      ddlHostelType: ['0', [DropdownValidators]],
      txtPhoneNumber: ['', [Validators.required,
      Validators.pattern(/^(?!([0-9])\1{9})[0-9]{10}$/)]],
      //txtPhoneNumber: [{ value: '' }, Validators.required],
      txtAddress: ['', Validators.required],
    });
    //this.searchRequest.DepartmentID = 2;
   
   

    await this.getHostelTypeList(); 
    await this.GetAllHostelList(); 


  }
  


  async getHostelTypeList() {
    try {
      await this.commonMasterService.GetCommonMasterDDLByType('HostelType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.HostelTypeList = data['Data'];
          console.log("HostelTypeList", this.HostelTypeList)
        }, (error: any) => console.error(error)
        );

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
  //  debugger

  //  this.isSubmitted = true;
  //  if (this.groupForm.invalid) {
  //    return console.log("error")
  //  }
  //  //Show Loading
  //  this.loaderService.requestStarted();
  //  this.isLoading = true;

  //  try {

  //    if (this.HostelID) {
  //      this.request.HostelID = this.HostelID
  //      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
  //    }
  //    else {
  //      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
  //    }


  //    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
  //    console.log(this.request,'hostel')
  //    await this._HostelManagmentService.SaveData(this.request)
  //      .then((data: any) => {
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (this.State == EnumStatus.Success) {
  //          this.ResetControl();
  //          this.toastr.success(this.Message)

  //          this.GetAllHostelList();

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


  //async saveData() {
  //  debugger;

  //  this.isSubmitted = true;

  //  if (this.groupForm.invalid) {
  //    console.log("Form is invalid");
  //    return;
  //  }

  //  // Show loader
  //  this.loaderService.requestStarted();
  //  this.isLoading = true;

  //  try {
  //    // Set CreatedBy or ModifyBy
  //    if (this.HostelID) {
  //      this.request.HostelID = this.HostelID;
  //      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
  //    } else {
  //      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
  //    }

  //    // Set required IDs
  //    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;

  //    console.log(this.request, 'hostel');

  //    await this._HostelManagmentService.SaveData(this.request)
  //      .then((data: any) => {
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];

  //        if (this.State === EnumStatus.Success) {
  //          this.ResetControl();
  //          this.toastr.success(this.Message);
  //          this.GetAllHostelList();
  //        }
  //        else if (this.State === EnumStatus.Warning) {
  //          this.toastr.warning(this.Message || "Duplicate entry detected.");
  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage || "Something went wrong.");
  //        }
  //      });
  //  }
  //  catch (ex) {
  //    console.error("Exception in saveData():", ex);
  //    this.toastr.error("Unexpected error occurred.");
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //      this.isLoading = false;
  //    }, 200);
  //  }
  //}

  async saveData() {
    debugger;

    this.isSubmitted = true;

    // Form validation
    if (this.groupForm.invalid) {
      console.log("Form is invalid");
      return;
    }

    // Show loader
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      // Prepare request data
      if (this.HostelID) {
        this.request.HostelID = this.HostelID;
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }

      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID;

      // Save data via API (IMPORTANT: only use `await`, not `.then()`)
      const data: any = await this._HostelManagmentService.SaveData(this.request);

      this.State = data['State'];
      this.Message = data['Message'];
      this.ErrorMessage = data['ErrorMessage'];
      debugger
      // Handle success
      if (this.State === EnumStatus.Success) {

        this.ResetControl();
        this.toastr.success(this.Message);
        this.GetAllHostelList();
      }
      // Handle warning (e.g., duplicate)
      else if (this.State === EnumStatus.Warning) {
        this.toastr.warning(this.Message || "Duplicate entry detected.");
      }
      // Handle other errors
      else {
        this.toastr.error(this.ErrorMessage || "Something went wrong.");
      }
    }
    catch (ex) {
      console.error("Exception in saveData():", ex);
      this.toastr.error("Unexpected error occurred.");
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }





  validatePhoneNumber(event: any): void {
    // Only allow numeric characters
    const phoneNumber = event.target.value;

    // Remove all non-digit characters
    const sanitizedValue = phoneNumber.replace(/\D/g, '');

    // Set the value back to the input but limit it to 10 digits
    this.request.PhoneNumber = sanitizedValue.substring(0, 10);

    // Update the form control value to reflect the changes
    this.groupForm.controls['txtPhoneNumber'].setValue(this.request.PhoneNumber);
  }

  async GetByID(id: number) {
    //alert(id);
    try {
      this.loaderService.requestStarted();
      await this._HostelManagmentService.GetByID(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        if (data.Data !== null) {
          console.log(data.Data,"edit");
          this.request.HostelID = data.Data.HostelID;
          this.request.HostelName = data.Data.HostelName;
          this.request.Address = data.Data.Address;
          this.request.HostelType = data.Data.HostelType;
          this.request.PhoneNumber = data.Data.PhoneNumber;
          this.HostelID = data.Data.HostelID;
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
  async btnDeleteOnClick(id: number) {
    //alert(id);
    this.StautsChangeMdl.PK_ID = id;
    this.StautsChangeMdl.ModifyBy = this.sSOLoginDataModel.UserID;
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed)
          try {
            this.loaderService.requestStarted();
            await this._HostelManagmentService.DeleteDataByID(this.StautsChangeMdl).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (data.Data !== null) {
                // console.log(data.Data, "delete");
                this.toastr.success(this.Message)

                this.GetAllHostelList();
              }
              //console.log(this.request, "request")
            });
          } catch (error) {
            console.error(error);
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
      })
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.isUpdate = false;
    this.request = new CreateHostelDataModel();
    this.groupForm.reset();
    this.groupForm.patchValue({
      HostelName: '',
      txtHostelName: '',
      ddlHostelType: 0,
      txtPhoneNumber: '',
      txtAddress: ''
    });

    this.GetAllHostelList();
  }

  async GetAllHostelList() {
      try {
        this.loaderService.requestStarted();
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
        this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        await this._HostelManagmentService.GetAllHostelList(this.searchRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            this.HostelList = data['Data'];
            console.log(this.HostelList, "HostelList")
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



  filterNumber(input: string): string {
    return input.replace(/[^0-9]/g, '');
  }



  onAddClick() {
    this.isUpdate = false;
    this.isFormVisible = true;

    setTimeout(() => {
      this.ResetControl();
      this.shouldFocusHostelName = true;
    });
  }




  onEditClick(HRSMasterID: number) {
    this.isUpdate = true;
    this.isFormVisible = true;

    setTimeout(async () => {
      await this.GetByID(HRSMasterID);
      this.shouldFocusHostelName = true;
    });
  }

  

}
