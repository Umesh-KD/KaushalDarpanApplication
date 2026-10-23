import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HiringRoleMasterDataModel } from '../../Models/HiringRoleMasterDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { HiringRoleMasterService } from '../../Services/HiringRoleMaster/hiring-role-master.service';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumStatus } from '../../Common/GlobalConstants';

@Component({
    selector: 'app-hiring-role-master',
    templateUrl: './hiring-role-master.component.html',
    styleUrls: ['./hiring-role-master.component.css'],
    standalone: false
})

export class HiringRoleMasterComponent implements OnInit {

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
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public LevelMasterList: any = [];
  public DesignationMasterList: any = [];
  public Table_SearchText: string = '';


  request = new HiringRoleMasterDataModel();
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


  constructor(private commonMasterService: CommonFunctionService, private HiringRoleMasterService: HiringRoleMasterService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2) {
  }

  async ngOnInit() {

    this.RoleMasterFormGroup = this.formBuilder.group(
      {
        txtRoleName: ['', Validators.required],
        chkActiveStatus: ['true'],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetRoleMasterList();
  }
  get form() { return this.RoleMasterFormGroup.controls; }


  async GetRoleMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.HiringRoleMasterService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoleMasterList = data['Data'];
          this.loadInTable();
        }, (error: any) => console.error(error));
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
    if (this.request.ID > 0) {
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    } else {
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    }

    try {
      await this.HiringRoleMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetRoleMasterList();
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

  async btnEdit_OnClick(ID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.HiringRoleMasterService.GetByID(ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.request.ID = data['Data']["ID"];
          this.request.Name = data['Data']["Name"];
          this.request.ActiveStatus = data['Data']["ActiveStatus"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = this.sSOLoginDataModel.UserID;
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, (error: any) => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async btnDelete_OnClick(ID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.HiringRoleMasterService.DeleteDataByID(ID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
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
    this.request.ID = 0;
    this.request.Name = '';
    this.request.ActiveStatus = true;
    this.request.ActiveDeactive = '';
    this.request.DeleteStatus = false;

    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }

  onStatusChange(status: any) {
    if (typeof (window as any).js_StatusYesNoActiveInActive === 'function') {
      (window as any).js_StatusYesNoActiveInActive(status);
    }
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
    this.paginatedInTableData = [...this.RoleMasterList].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org. list here)
  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.RoleMasterList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.RoleMasterList.length;
  }
  // (replace org. list here)
  get totalInTableSelected(): number {
    return this.RoleMasterList.filter((x:any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.RoleMasterList.forEach((x:any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.RoleMasterList.filter((x:any) => x.StudentID == item.StudentID && x.SemesterID == item.SemesterID);
    data.forEach((x:any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.RoleMasterList.every((r:any) => r.Selected);
  }
  // end table feature

}
