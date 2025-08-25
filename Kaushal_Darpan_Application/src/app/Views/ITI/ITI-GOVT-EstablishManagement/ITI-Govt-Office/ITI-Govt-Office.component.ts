import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ITIGovtEM_OfficeSaveDataModel, ITIGovtEM_OfficeSearchModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import * as XLSX from 'xlsx';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';

@Component({
  selector: 'app-ITI-Govt-Office',
  templateUrl: './ITI-Govt-Office.component.html',
  styleUrls: ['./ITI-Govt-Office.component.css'],
    standalone: false
})
export class ITIGovtOfficeComponent {

  FormGroup!: FormGroup;
  public SubjectID: number = 0
  public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public SubjectCategoryListList: any = []
  public SubjectMasterList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public BranchesMasterList: any = []
  public LevelMasterList: any = []
  public showDropdown = false;  // Controls dropdown visibility
  public isShowInput = false
  public ParentList: any = []
  public settingsMultiselect: object = {};
  public Table_SearchText: string = '';
  public SearchRequest = new ITIGovtEM_OfficeSearchModel()
  public SelectedInstituteList:number=0
  request = new ITIGovtEM_OfficeSaveDataModel()
  sSOLoginDataModel = new SSOLoginDataModel();
  
  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default
  constructor(private ITIGovtEMStaffMaster: ITIGovtEMStaffMaster,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2, private commonMasterService: CommonFunctionService) {
  }

  async ngOnInit() {

    



    this.FormGroup = this.formBuilder.group(
      {
        txtOfficeName: ['', Validators.required],    
        ddlLevelId: ['', [DropdownValidators]]        
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.modifyBy = this.sSOLoginDataModel.UserID;

    await this.GetLevelMasterData()
    await this.GetOfficeMasterList()

    if (this.SubjectID > 0) {
      await this.btnEdit_OnClick(this.SubjectID)
    }

  }
  get form() { return this.FormGroup.controls; }

  

  async GetLevelMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLevelMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.LevelMasterList = data.Data;
        console.log("LevelMasterList", this.LevelMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }





  async SaveData() {
    this.isSubmitted = true;
    if (this.FormGroup.invalid) {
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.request.departmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.courseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.request.endTermId = this.sSOLoginDataModel.EndTermID;
    this.request.createdBy = this.sSOLoginDataModel.UserID;
    this.request.modifyBy = this.sSOLoginDataModel.UserID;
    try {
      await this.ITIGovtEMStaffMaster.ITIGovtEM_OfficeSaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetOfficeMasterList();
          } else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
          console.log(this.FormGroup)
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

  async btnEdit_OnClick(officeID: number) {
    
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.ITIGovtEMStaffMaster.ITIGovtEM_OfficeGetByID(officeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.request = data['Data']
          this.request.officeID = data['Data']["OfficeID"];
          this.request.levelID = data['Data']["LevelID"];
          this.request.officeName = data['Data']["OfficeName"];        
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

  


  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }


  

  async btnDelete_OnClick(officeID: number) {
    
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
        
          try {
            //Show Loading
            this.loaderService.requestStarted();
       /*     alert(isParent)*/
            await this.ITIGovtEMStaffMaster.ITIGovtEM_OfficeDeleteById(officeID,this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data)
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  this.GetOfficeMasterList()
                  //reload
                  /*        this.GetSubjectCategoryList()*/
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

  async GetOfficeMasterList() {
    this.SearchRequest.departmentID = this.sSOLoginDataModel.DepartmentID
    /*this.SearchRequest.CourseType = this.sSOLoginDataModel.Eng_NonEng*/
    try {
      this.loaderService.requestStarted();
      await this.ITIGovtEMStaffMaster.ITIGovtEM_OfficeGetAllData(this.SearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SubjectMasterList = data['Data'];
          this.loadInTable()
          console.log(this.SubjectMasterList, "CodeSubject")
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

  async ResetControl() {    

    this.request = new ITIGovtEM_OfficeSaveDataModel()    
    this.isSubmitted = false;
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }

  

  
  


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.SubjectMasterList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.SubjectMasterList.length;
  }



}
