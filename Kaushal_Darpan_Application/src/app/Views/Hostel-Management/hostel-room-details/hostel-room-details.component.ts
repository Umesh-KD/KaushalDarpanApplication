import { Component } from '@angular/core';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HostelRoomDetailsService } from '../../../Services/HostelRoomDetails/hostel-room-details.service';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { RoomDetailsDataModel } from '../../../Models/Hostel-Management/RoomDetailsDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { BTERSeatsDistributionsService } from '../../../Services/BTER/Seats-Distributions/seats-distributions.service';
import { map, of } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { StatusChangeModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';

@Component({
  selector: 'app-hostel-room-details',
  standalone: false,
  templateUrl: './hostel-room-details.component.html',
  styleUrl: './hostel-room-details.component.css'
})
export class HostelRoomDetailsComponent {
  public request = new RoomDetailsDataModel()
  StautsChangeMdl = new StatusChangeModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public HostelID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public HSRoomID: number = 0;
  public Table_SearchText: string = "";
  public RoomDetailsList: any = [];
  public RoomExcelDetailsList: any = [];
  public RoomTypeDDLList: any = [];
  public transactionData$: any;
  public DataExcel: any = [];
  public IsNull: boolean = false;
  public previousSelection: any = [];
  public selectedFile: File | null = null;
  public importFile: any;
  totalRecord: any = 0;
  fileUrl: any = 0;

  constructor(
    private toastr: ToastrService,
    private hostelRoomDetailsService: HostelRoomDetailsService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private appsettingConfig: AppsettingService,
    private SeatsDistributionsService: BTERSeatsDistributionsService,
    private modalService: NgbModal) { }


  async ngOnInit() {
    this.fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + "Sample_Formate_HostelRoomFacility.xlsx?2";
    this.RequestFormGroup = this.formBuilder.group({
      roomTypeID: ['', [DropdownValidators]],
      roomNo: ['', Validators.required],
      studyTableFacilities: ['', [DropdownValidators]],
      attachedBathFacilities: ['', [DropdownValidators]],
      fanFacilities: ['', [DropdownValidators]],
      coolingFacilities: ['', [DropdownValidators]],
    });


    this.HSRoomID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
    await this.GetRoomTypeDDL();
    if (this.HSRoomID > 0) {
      await this.GetByID(this.HSRoomID);
    }
  }
  get _RequestFormGroup() { return this.RequestFormGroup.controls; }



  async saveData() {
    this.isSubmitted = true;
    if (this.RequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.HSRoomID) {
        this.request.HSRoomID = this.HSRoomID
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      await this.hostelRoomDetailsService.SaveData(this.request)
        .then((data: any) => {
          console.log("data",data);

          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.GetAllData();
            this.ResetControl();
            this.routers.navigate(['/HostelRoomDetails'])
          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning(data.Message);
          }
          else {
            this.toastr.error(data.ErrorMessage);
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



  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.request.HostelID = this.sSOLoginDataModel.HostelID;
      this.request.RoomTypeID = 0;


      await this.hostelRoomDetailsService.GetAllData(this.request.HostelID, this.request.RoomTypeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoomDetailsList = data['Data'];
          console.log(this.RoomDetailsList)
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


  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.hostelRoomDetailsService.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.RoomTypeID = data['Data']["RoomTypeID"];
          this.request.RoomNo = data['Data']["RoomNo"];
          this.request.AttachedBathFacilities = data['Data']["AttachedBathFacilities"];
          this.request.FanFacilities = data['Data']["FanFacilities"];
          this.request.CoolingFacilities = data['Data']["CoolingFacilities"];
          this.request.StudyTableFacilities = data['Data']["StudyTableFacilities"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
          console.log(data)
          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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


  async btnDelete_OnClick(HRoomId: number) {
    this.StautsChangeMdl.ModifyBy = this.sSOLoginDataModel.UserID;
    this.StautsChangeMdl.PK_ID = HRoomId;

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.hostelRoomDetailsService.DeleteDataByID(this.StautsChangeMdl)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetAllData()
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


  async GetRoomTypeDDL() {
    
    this.HostelID = this.sSOLoginDataModel.HostelID;
    //alert(this.HostelID);
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetRoomTypeDDLByHostel('HostelRoomSeatType', this.HostelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RoomTypeDDLList = data['Data'];
          console.log("HostelRoomSeatType", this.RoomTypeDDLList);
          //this.GetRoomNoDDL();
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

  async ResetControl() {
    this.isSubmitted = false;
    this.request = new RoomDetailsDataModel();
    this.RequestFormGroup.reset();
    this.GetAllData();
  }


  onFileChange(event: any): void {
    // Get the file from the input element
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.ImportExcelFile(file);
      this.importFile = null;
    }
  }


  ImportExcelFile(file: File): void {
    ;
    let mesg = '';
    this.SeatsDistributionsService.SampleImportExcelFile(file)
      .then((data: any) => {
        ;
        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (data.State === EnumStatus.Success) {
          
          this.DataExcel = data.Data;
          this.transactionData$ = [];
          this.transactionData$ = of(this.DataExcel);
          this.transactionData$.pipe(
            map((data: any[]) => {
              // Assuming each item in the array is an object and you want to get key-value pairs
              return data.map((item: any) => {
                const keys = Object.keys(item);      //Extract keys
                const values = Object.values(item);  //Extract values

                keys.forEach((key) => {
                  if (item[key] === null || item[key] === undefined) {
                    this.ErrorMessage=(`${key} value is null`);
                  }
                  console.log(this.ErrorMessage, "error")
                });

                //Check for null or undefined values in values
                values.forEach((value, index) => {

                  if (value === "null" || value === "") {
                    

                    mesg += `${keys[index]} value is null</br>`;

                    this.IsNull = true;
                  }

                });

                values.forEach((value, index) => {
                  if (Number(value) < 0) {
                    

                    mesg += `${keys[index]} value is invalid (negative) </br>`;

                    this.IsNull = true;
                  }

                });
                if (mesg != '') {
                  this.Swal2.Info(mesg);
                  //this.CloseModalPopup();
                  this.selectedFile = null;
                  // this.seatMetrix = []
                } else
                {
                  this.RoomExcelDetailsList = this.DataExcel
                  console.log(this.RoomExcelDetailsList)
                }


                return { keys, values };  // Return an object with separate keys and values arrays
              });
            })
          ).subscribe((result: any) => {
            this.DataExcel = result;
            console.log('Processed Data:', result);
            // `result` will be an array of objects with `keys` and `values` arrays
          });
          if (this.IsNull == true) {
            this.DataExcel = [];
          }
        }
      });
  }

  async SaveExcelData() {
    //this.isSubmitted = true;
    //if (this.RequestFormGroup.invalid) {
    //  return console.log("Form is invalid, cannot submit")
    //}
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.HSRoomID) {
        this.request.HSRoomID = this.HSRoomID
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      console.log("this.RoomDetailsList", this.RoomExcelDetailsList)
      this.RoomExcelDetailsList.forEach((item: any) => {
        item.HostelID = this.sSOLoginDataModel.HostelID;
      })
      await this.hostelRoomDetailsService.SaveExcelData(this.RoomExcelDetailsList)
        .then((data: any) => {
          
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)            
            this.GetAllData();
            this.ResetControl();
            this.RoomExcelDetailsList = [];    
            this.selectedFile = null;        
          }
          else if (data.State === EnumStatus.Warning) {
            this.toastr.error(data.Message);
          }
          else {
            this.toastr.error("Data Already Added");
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

  async CloseExcel() {
    this.RoomExcelDetailsList = [];
    this.selectedFile = null;
  }
}
