import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ReservationRosterDataModel, ReservationRosterSearchModel } from '../../Models/ReservationRosterDataModels';
import { ReservationRosterService } from '../../Services/Reservation-Roster/reservation-roster.service';
import { EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';

@Component({
  selector: 'app-reservation-roster',
  standalone: false,
  templateUrl: './reservation-roster.component.html',
  styleUrl: './reservation-roster.component.css'
})
export class ReservationRosterComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public CategoryList: any = [];
  public ReservationRosterList: any = [];
  searchText: string = '';
  request = new ReservationRosterDataModel()
  public searchRequest = new ReservationRosterSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public IsAddNewReservationRoster: boolean = false;
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public Reservation_Id: number | null = null;
  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private ReservationRosterService: ReservationRosterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit() {

    this.groupForm = this.fb.group({
      //ddlCategoryId: ['', [DropdownValidators], new FormControl({ value: 0, disabled: true })],
      ddlCategoryId: [{ value: 0, disabled: false }, [DropdownValidators]],
      txtReservationPr: ['', Validators.required],
      txtRemarks: ['', Validators.required]
    });
    

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentId = this.sSOLoginDataModel.DepartmentID;
    
    await this.getCategoryList();
    await this.getReservationRosterList();
  }


  async getCategoryList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCastCategory()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryList = data['Data'];
          console.log(this.CategoryList, 'CategoryList');
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

  async getReservationRosterList() {
    try {
      this.loaderService.requestStarted();
      await this.ReservationRosterService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ReservationRosterList = data['Data'];
          console.log(this.ReservationRosterList, "ReservationRosterList")
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


  async addReservationRoster(content: any, ID: number) {
    //alert(ID)
    this.Reservation_Id = 0;
    this.IsAddNewReservationRoster = true;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
    });
    const ddlCategoryIdControl = this.groupForm.get('ddlCategoryId');
    ddlCategoryIdControl?.enable();
    this.request.CategoryId = 0;
    if (ID > 0) {
      if (this.groupForm && this.groupForm.get('ddlCategoryId')) {
        if (ddlCategoryIdControl?.value !== 0) {
          ddlCategoryIdControl?.disable();
        }
      }

      this.Reservation_Id = ID;
      this.GetByID(ID)
    }
  }


  CloseAddReservationRoster() {
    this.modalService.dismissAll();
    this.request = new ReservationRosterDataModel()
    this.getReservationRosterList();
    this.ResetControl();
  }



  async saveData() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.request.AcademicYearID = 1;
    this.request.DepartmentId = this.sSOLoginDataModel.DepartmentID;
    try {

      if (this.Reservation_Id) {
        this.request.Reservation_Id = this.Reservation_Id
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }



      await this.ReservationRosterService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            setTimeout(() => {
              this.toastr.success(this.Message)
              this.CloseAddReservationRoster();
              this.ResetControl();
              this.getReservationRosterList();
            }, 200);
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message);
            this.CloseAddReservationRoster();
            this.ResetControl();
            this.getReservationRosterList();
          }
          else {
            this.toastr.error(this.ErrorMessage);
            this.CloseAddReservationRoster();
            this.ResetControl();
            this.getReservationRosterList();
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
    this.request = new ReservationRosterDataModel
    this.groupForm.reset();
    this.groupForm.patchValue({

      code: '',

    });
  }




  async btnDeleteOnClick(Reservation_Id: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.request.ModifyBy = this.sSOLoginDataModel.UserID;
            this.loaderService.requestStarted();
            await this.ReservationRosterService.DeleteDataByID(Reservation_Id, this.request.ModifyBy)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.getReservationRosterList();
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

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.ReservationRosterService.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
        
          this.request.CategoryId = data['Data']["CategoryId"];
          this.request.ReservationPr = data['Data']["ReservationPr"];
          this.request.Remarks = data['Data']["Remarks"];
          this.request.IsHorizontalCateogory = data['Data']["IsHorizontalCateogory"];

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

  onCancel(): void {
    this.searchRequest.CategoryId = 0;
    this.getReservationRosterList();
  }

  exportToExcel(): void {
    const unwantedColumns = ['ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress', 'Reservation_Id',	'CategoryId',	'IsHorizontalCateogory',	'DepartmentId',	'AcademicYearID'];
    const filteredData = this.ReservationRosterList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ReservationRosterList.xlsx');
  }

}
