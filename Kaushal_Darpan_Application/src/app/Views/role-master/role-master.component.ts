import { Component, OnInit, Input, Injectable, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { RoleMasterService } from '../../Services/RoleMaster/role-master.service';
import { RoleMasterDataModel, RoleSearchModel } from '../../Models/RoleMasterDataModel';

import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { EnumDepartment, EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { ReportService } from '../../Services/Report/report.service';
export * from '../Shared/loader/loader.component';


@Injectable({
  providedIn: 'root'
})
@Component({
    selector: 'app-role-master',
    templateUrl: './role-master.component.html',
    styleUrls: ['./role-master.component.css'],
    standalone: false
})
export class RoleMasterComponent implements OnInit {

  RoleMasterFormGroup!: FormGroup;

  public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DistrictList: any = [];
  public RoleMasterList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public CourseTypeList: any = []
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public LevelMasterList: any = [];
  public DesignationMasterList: any = [];
  public Table_SearchText: string = '';
  public searchRequest = new RoleSearchModel();


  request = new RoleMasterDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();


  constructor(private commonMasterService: CommonFunctionService, private RoleMasterService: RoleMasterService, private reportService: ReportService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2) {
  }

  async ngOnInit() {

    this.RoleMasterFormGroup = this.formBuilder.group(
      {
        txtRoleName: ['', Validators.required],
        //ddlLevel: ['', [DropdownValidators]],
        //ddlDesignation: ['', [DropdownValidators]],
        txtRoleNameHindi: ['', Validators.required],
        txtRoleNameShort: ['', Validators.required],       
        CourseType: [{ value: '', disabled: true }, [DropdownValidators]],
        chkActiveStatus: ['true'],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;


    await this.GetMasterData();
    await this.GetRoleMasterList();
    await this.GetCouseType();

  }
  get form() { return this.RoleMasterFormGroup.controls; }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLevelMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.LevelMasterList = data['Data'];
        }, error => console.error(error));

      await this.commonMasterService.GetDesignationMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DesignationMasterList = data['Data'];;
          console.log(this.DesignationMasterList);
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

  async GetCouseType() {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetCourseType(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CourseTypeList = data['Data'];

          //console.log(this.DivisionMasterList)
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

  async GetRoleMasterList() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      await this.RoleMasterService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoleMasterList = data['Data'];
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

  async SaveData() {
    
    this.isSubmitted = true;
    if (this.RoleMasterFormGroup.invalid) {
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    if (this.request.RoleID > 0) {
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    } else {
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    }
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    try {
      await this.RoleMasterService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.GetRoleMasterList();
            this.ResetControl();
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

  async btnEdit_OnClick(RoleID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.RoleMasterService.GetByID(RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.request.RoleID = data['Data']["RoleID"];
          this.request.LevelID = data['Data']["LevelID"];
          this.request.DesignationID = data['Data']["DesignationID"];
          this.request.RoleNameEnglish = data['Data']["RoleNameEnglish"];
          this.request.RoleNameHindi = data['Data']["RoleNameHindi"];
          this.request.RoleNameShort = data['Data']["RoleNameShort"];
          this.request.ActiveStatus = data['Data']["ActiveStatus"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = this.sSOLoginDataModel.UserID;
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async btnDelete_OnClick(RoleID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.RoleMasterService.DeleteDataByID(RoleID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (!this.State) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetRoleMasterList();
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


  async ResetControl() {
    const txtRoleName = document.getElementById('txtRoleName');
    if (txtRoleName) txtRoleName.focus();
    this.isSubmitted = false;
    this.request.RoleID = 0;
    this.request.LevelID = 0;
    this.request.DesignationID = 0;
    this.request.RoleNameEnglish = '';
    this.request.RoleNameHindi = '';
    this.request.RoleNameShort = '';
    this.request.ActiveStatus = true;
    this.request.ActiveDeactive = '';
    this.request.DeleteStatus = false;

    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.RoleMasterList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][3] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "RoleMaster.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }

  }
  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  async SetUserRoleRights(RoleID: number) {
    this.routers.navigate(['/userrolerights' + "/" + encodeURI(RoleID.toString())]);
  }

  async redirecttorights(RoleID: number) {
    this.routers.navigate(['/rolemenuright' + "/" + encodeURI(RoleID.toString())]);
  }

}

