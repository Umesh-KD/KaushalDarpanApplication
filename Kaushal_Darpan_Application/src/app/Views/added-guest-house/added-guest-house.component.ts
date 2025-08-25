import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../Common/common';
import { EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { CreateHostelDataModel, HostelSearchModel } from '../../Models/Hostel-Management/HostelManagmentDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { HostelManagmentService } from '../../Services/HostelManagment/HostelManagment.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { GuestHouseService } from '../../Services/GuestHouse/guest-house.service';
import { CreateGuestHouseDataModel, GuestHouseSearchModel } from '../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';

@Component({
  selector: 'app-added-guest-house',
  standalone: false,
  templateUrl: './added-guest-house.component.html',
  styleUrl: './added-guest-house.component.css'
})
export class AddedGuestHouseComponent {
  groupForm!: FormGroup;
  public GuestHouseID: number | null = null;
  public isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new CreateGuestHouseDataModel()
  public searchRequest = new GuestHouseSearchModel();
  public DistrictMasterList: any = [];

  public HostelTypeList: any = [];
  public StaffID: number | null = null;

  public HostelList: any = [];

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private _GuestHouseService: GuestHouseService,
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
      txtPhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      //txtPhoneNumber: [{ value: '' }, Validators.required],
      txtAddress: ['', Validators.required],
    });
    //this.searchRequest.DepartmentID = 2;



    /*await this.getHostelTypeList();*/
    await this.GetAllHostelList();


  }



  //async getHostelTypeList() {
  //  try {
  //    await this.commonMasterService.GetCommonMasterDDLByType('HostelType')
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.HostelTypeList = data['Data'];
  //        console.log("HostelTypeList", this.HostelTypeList)
  //      }, (error: any) => console.error(error)
  //      );

  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async saveData() {


    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.GuestHouseID) {
        this.request.GuestHouseID = this.GuestHouseID
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }


      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      await this._GuestHouseService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.ResetControl();
            this.toastr.success(this.Message)

            this.GetAllHostelList();

          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
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
      await this._GuestHouseService.GetByID(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        if (data.Data !== null) {
          console.log(data.Data, "edit");
          this.request.GuestHouseID = data.Data.GuestHouseID;
          this.request.GuestHouseName = data.Data.GuestHouseName;
          this.request.Address = data.Data.Address;
          this.request.PhoneNumber = data.Data.PhoneNumber;

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
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    try {
      this.loaderService.requestStarted();
      await this._GuestHouseService.DeleteDataByID(id, this.request.ModifyBy).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        if (data.Data !== null) {
          console.log(data.Data, "delete");
          this.GetAllHostelList();
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

  async ResetControl() {
    this.isSubmitted = false;

    this.request = new CreateGuestHouseDataModel();
    this.groupForm.reset();
    // Reset form values if necessary
    this.groupForm.patchValue({
      HostelName: ''
    });

    this.GetAllHostelList();
  }

  async GetAllHostelList() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this._GuestHouseService.GetAllHostelList(this.searchRequest)
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


}
