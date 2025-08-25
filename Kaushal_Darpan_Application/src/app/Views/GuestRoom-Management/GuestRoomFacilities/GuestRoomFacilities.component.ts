import { Component } from '@angular/core';
//import { FormBuilder } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { GuestRoomManagmentService } from '../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
//import { ActivatedRoute } from '@angular/router';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FacilitiesDataModel, FacilitiesSearchModel, StatusChangeGuestModel } from '../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';

@Component({
  selector: 'app-GuestRoomFacilities',
  templateUrl: './GuestRoomFacilities.component.html',
  styleUrls: ['./GuestRoomFacilities.component.css'],
  standalone: false
})
export class GuestRoomFacilitiesComponent {
  groupForm!: FormGroup;
  public GFID: number | null = null;
  public isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new FacilitiesDataModel()
  StautsChangeMdl = new StatusChangeGuestModel()
  public searchRequest = new FacilitiesSearchModel();
  public FacilityList: any = [];

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private _GuestRoomManagmentService: GuestRoomManagmentService, 
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

      txtFacilitiesName: ['', Validators.required]
    });

    await this.GuestRoomFacilityList();

  }


  async SaveFacilities() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      
      if (this.GFID) {
        this.request.GFID = this.GFID

        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
        this.request.IsFacilities = true;
      }
     

      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
     
      this.request.GuestHouseID = 1;

      await this._GuestRoomManagmentService.SaveFacilities(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.ResetControl();
            this.toastr.success(this.Message)

            this.GuestRoomFacilityList();

          } else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)

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

  async ResetControl() {
    this.isSubmitted = false;

    this.request = new FacilitiesDataModel();
    this.groupForm.reset();
    // Reset form values if necessary
    //this.groupForm.patchValue({
    //});
    this.request.GuestHouseID = 0;

    this.GuestRoomFacilityList();
  }

  async GuestRoomFacilityList() {
    
    try {
      this.loaderService.requestStarted();
     

      this.searchRequest.GuestHouseID = this.sSOLoginDataModel.GuestRoomID;
      this.searchRequest.DepartmentID = EnumDepartment.BTER
      await this._GuestRoomManagmentService.GuestRoomFacilityList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.FacilityList = data['Data'];
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

  async GetByGFID(id: number) {
    try {
      this.loaderService.requestStarted();
      await this._GuestRoomManagmentService.GetByGFID(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data !== null) {
          this.request = data.Data[0]
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async DeleteDataByGFID(GFID: number) {
    this.StautsChangeMdl.PK_ID = GFID;
    this.StautsChangeMdl.ModifyBy = this.sSOLoginDataModel.UserID;
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {          
            this.loaderService.requestStarted();
            await this._GuestRoomManagmentService.DeleteDataByGFID(this.StautsChangeMdl)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
               
                  this.GuestRoomFacilityList();
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

  onToggleChange(GFID: number) {
    
    // Confirm the status change
    this.Swal2.Confirmation("Are you sure you want to change status?", async (result: any) => {
      if (result.isConfirmed) {
        try {
          // Show loading indicator
          this.loaderService.requestStarted();

          // Dynamically assign ModifyBy from logged-in user
          const ModifyBy = this.sSOLoginDataModel.UserID;

          // Toggle IsFacilities (1 for active, 0 for inactive)


          // Call the service to update the status
          await this._GuestRoomManagmentService.IsFacilitiesStatusByID(GFID, ModifyBy)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));

              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              // Check if status update was successful
              if (this.State === EnumStatus.Success) {
                this.toastr.success(this.Message);
                // Reload data after successful update
                this.GuestRoomFacilityList();
              } else {
                this.toastr.error(this.ErrorMessage);
              }
            }, (error: any) => console.error(error));
        } catch (ex) {
          console.log(ex);
        } finally {
          // End loading indicator
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
      else {
        await this.GuestRoomFacilityList();
      }
    });
  }





}
