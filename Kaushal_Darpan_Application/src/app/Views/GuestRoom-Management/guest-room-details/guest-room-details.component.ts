import { Component, ViewChild } from '@angular/core';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { BTERSeatsDistributionsService } from '../../../Services/BTER/Seats-Distributions/seats-distributions.service';
import { map, of } from 'rxjs';
import { AppsettingService } from '../../../Common/appsetting.service';
import { GuestRoomManagmentService } from '../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { GuestRoomSeatSearchModel, StatusChangeGuestModel } from '../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
import { RoomDetailsDataModel } from '../../../Models/GuestRoom-Management/RoomDetailsDataModel';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-guest-room-details',
  standalone: false,
  templateUrl: './guest-room-details.component.html',
  styleUrl: './guest-room-details.component.css'
})
export class GuestRoomDetailsComponent {
  public request = new RoomDetailsDataModel()
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
  public searchRequest1 = new GuestRoomSeatSearchModel();
  StautsChangeMdl = new StatusChangeGuestModel()
  public GuestRoomList: any = [];
  public GuestHouseNameList: any = [];
  public RoomTypeList: any = [];
  displayedColumns: string[] = [
    'SNo', 'RoomNo', 'RoomType', 'GuestHouseName', 'StudyTableFacilities', 'FanFacilities',
    'CoolingFacilities', 'AttachedBathFacilities', 'Action'
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private appsettingConfig: AppsettingService,
    private SeatsDistributionsService: BTERSeatsDistributionsService,
    private guestRoomManagmentService: GuestRoomManagmentService) { }

  async ngOnInit() {
    this.fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + "Sample_Formate_HostelRoomFacility.xlsx?2";

    this.RequestFormGroup = this.formBuilder.group({
      guestRoomID: ['', [DropdownValidators]],
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
      await this.GetByIDGuestRoomDetails(this.HSRoomID);
    }
    await this.GetAllRoomSeatList();
    await this.GetGuestHouseNameList();
  }
  get _RequestFormGroup() { return this.RequestFormGroup.controls; }

  async saveData() {
    this.isSubmitted = true;

    if (this.RequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit");
    }

    if (this.request.RoomNo === 0) {
      this.toastr.warning("Room No. 0 is not allowed");
      return;
    }
    if (this.request.GuestRoomDetailID == 0) {
      // Get the allowed room quantity for this GuestHouse and RoomType
      const room = this.GuestRoomList.find((x: { GuestHouseID: number; RoomType: number }) =>
        x.GuestHouseID === Number(this.request.GuestHouseID) &&
        x.RoomType === Number(this.request.RoomTypeID)
      );

      const allowedQuantity = room?.RoomQuantity ?? 0;

      // Check for duplicate room entry based on GuestHouseID, RoomTypeID, and RoomNo
      const isDuplicate = this.RoomDetailsList.some((room: { GuestHouseID: number; RoomTypeID: number; RoomNo: number; GuestRoomDetailID: number }) =>
        room.GuestHouseID === Number(this.request.GuestHouseID) &&
        room.RoomTypeID === Number(this.request.RoomTypeID) &&
        room.RoomNo === Number(this.request.RoomNo) &&
        room.GuestRoomDetailID !== this.request.GuestRoomDetailID // Allow editing the same record
      );

      if (isDuplicate) {
        this.toastr.warning("Duplicate room entry: Room with same GuestHouseID, RoomTypeID, and RoomNo already exists.");
        return;
      }

      // Count existing rooms with the same GuestHouseID and RoomTypeID
      const existingCount = this.RoomDetailsList.filter((room: { GuestHouseID: number; RoomTypeID: number }) =>
        room.GuestHouseID === Number(this.request.GuestHouseID) &&
        room.RoomTypeID === Number(this.request.RoomTypeID)
      ).length;

      // If the allowed quantity is already met or exceeded
      if (existingCount >= allowedQuantity) {
        this.toastr.warning("Cannot add more rooms: maximum allowed room quantity reached.");
        return;
      }
    }

    // Show loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (this.HSRoomID) {
        this.request.GuestRoomDetailID = this.HSRoomID;
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }

      await this.guestRoomManagmentService.SaveGuestRoomDetails(this.request)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.ResetControl();
          } else if (data.State === EnumStatus.Warning) {
            this.toastr.warning(data.Message);
          } else {
            this.toastr.error(data.ErrorMessage);
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

  async GetAllData() {
    try {
      this.loaderService.requestStarted();

      await this.guestRoomManagmentService.GetAllGuestRoomDetails(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoomDetailsList = data['Data'];
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

  async GetByIDGuestRoomDetails(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.guestRoomManagmentService.GetByIDGuestRoomDetails(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.GuestHouseID = data['Data']["GuestHouseID"];
          this.request.RoomTypeID = data['Data']["RoomTypeID"];
          this.request.RoomNo = data['Data']["RoomNo"];
          this.request.AttachedBathFacilities = data['Data']["AttachedBathFacilities"];
          this.request.FanFacilities = data['Data']["FanFacilities"];
          this.request.CoolingFacilities = data['Data']["CoolingFacilities"];
          this.request.StudyTableFacilities = data['Data']["StudyTableFacilities"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
          this.HSRoomID = data['Data']["GuestHouseID"];

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

  async btnDelete_OnClick(item: any) {
    this.Swal2.Confirmation("Are you sure you want to delete this?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            // Show loading
            this.loaderService.requestStarted();

            // Soft delete: update DeleteStatus instead of calling delete API
            
            item.DeleteStatus = true;
            item.ActiveStatus = false;
            item.ModifyBy = this.sSOLoginDataModel.UserID;

            await this.guestRoomManagmentService.SaveGuestRoomDetails(item)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State === EnumStatus.Success) {
                  this.toastr.success(this.Message);
                  this.GetAllData(); // Reload list
                } else {
                  this.toastr.error(this.ErrorMessage);
                }
              }, (error: any) => {
                console.error(error);
                this.toastr.error("An error occurred during deletion.");
              });
          } catch (ex) {
            console.log(ex);
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
  }


  async btnEdit_OnClick(items: any) {
    debugger
    this.request.GuestRoomDetailID = Number(items.GuestRoomDetailID);
    this.RoomTypeList = [];
    let RoomTypeList = this.GuestRoomList.filter(
      (x: { GuestHouseID: number }) =>
        x.GuestHouseID === Number(items.GuestHouseID));
    if (RoomTypeList.length > 0) {
      this.RoomTypeList = RoomTypeList;
      this.RequestFormGroup.patchValue({
        guestRoomID: items.GuestHouseID,
        roomTypeID: items.RoomTypeID,
        roomNo: items.RoomNo,
        studyTableFacilities: items.StudyTableFacilities,
        attachedBathFacilities: items.AttachedBathFacilities,
        fanFacilities: items.FanFacilities,
        coolingFacilities: items.CoolingFacilities,
      });
    } else {
      this.toastr.warning("Room Type Not Available !")
    }
    
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
    this.RequestFormGroup.reset();
    this.RequestFormGroup.patchValue({
      guestRoomID: ['0'],
      roomTypeID: ['0'],
      roomNo: [''],
      studyTableFacilities: ['0'],
      attachedBathFacilities: ['0'],
      fanFacilities: ['0'],
      coolingFacilities: ['0'],
    });
    this.request = new RoomDetailsDataModel();    
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
                }


                return { keys, values };  // Return an object with separate keys and values arrays
              });
            })
          ).subscribe((result: any) => {
            this.DataExcel = result;
            // `result` will be an array of objects with `keys` and `values` arrays
          });
          if (this.IsNull == true) {
            this.DataExcel = [];
          }
        }
      });
  }

  async SaveExcelData() {
    this.isLoading = true;
    try {
      debugger
      console.log(this.RoomDetailsList);
      if (this.HSRoomID) {
        this.request.GuestRoomDetailID = this.HSRoomID
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      this.RoomExcelDetailsList.forEach((item: any) => {
        item.HostelID = this.sSOLoginDataModel.HostelID;
      })
      await this.guestRoomManagmentService.SaveGuestRoomDetails(this.RoomExcelDetailsList)
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

  async GetGuestHouseNameList() {
    try {
      this.loaderService.requestStarted();
      await this.guestRoomManagmentService.GetGuestHouseNameList(this.searchRequest1)
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

  async GetRoomTypeList() {
    try {
      debugger
      this.RoomTypeList = [];
      let RoomTypeList = this.GuestRoomList.filter(
        (x: { GuestHouseID: number }) =>
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

  initTable() {
    this.dataSource = new MatTableDataSource(this.RoomDetailsList);
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
