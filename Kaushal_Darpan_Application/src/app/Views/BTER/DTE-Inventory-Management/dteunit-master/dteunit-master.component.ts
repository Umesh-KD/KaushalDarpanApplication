import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { DTEItemUnitModel } from '../../../../Models/DTEInventory/DTEItemUnitModel';
import { DteItemUnitMasterService } from '../../../../Services/DTEInventory/DTEItemUnitMaster/DTEItemunit-master.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-dteunit-master',
  templateUrl: './dteunit-master.component.html',
  styleUrls: ['./dteunit-master.component.css'],
  standalone: false
})
export class DteUnitMasterComponent {
  public request = new DTEItemUnitModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public UnitId: number = 0;
  public Table_SearchText: string = "";
  public UnitMasterList: any = [];
    MenuAllowedRoleList: any;

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

  constructor(
    private toastr: ToastrService,
    private dteItemUnitMasterService: DteItemUnitMasterService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2, private commonMasterService: CommonFunctionService,
    private modalService: NgbModal) { }


  async ngOnInit() {

    this.RequestFormGroup = this.formBuilder.group({
      UnitName: ['', Validators.required]
    });

    this.UnitId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetMenuPermission();
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
    if (this.UnitId > 0) {
      await this.GetByID(this.UnitId);  
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

      if (this.UnitId) {
        this.request.UnitId = this.UnitId
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      await this.dteItemUnitMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetAllData();
            this.routers.navigate(['/DteUnitMaster']);

          }
          else if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage);
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

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.dteItemUnitMasterService.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.UnitName = data['Data']["UnitName"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
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

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      await this.dteItemUnitMasterService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.UnitMasterList = data['Data'];
          console.log('Unit Master List ==>',this.UnitMasterList)
          this.loadInTable();
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
    this.isSubmitted = false;
    this.request = new DTEItemUnitModel();
    this.RequestFormGroup.reset();
    this.GetAllData();
  }
  async btnEdit_OnClick(UnitId: number) {
    if (UnitId > 0) {
      this.UnitId = UnitId;
      await this.GetByID(this.UnitId);
    }
  }
  async btnDelete_OnClick(UnitId: number) {
    
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.dteItemUnitMasterService.DeleteDataByID(UnitId, this.UserID)
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

  async GetMenuPermission() {

    const baseRoute = this.routers.url.split('?')[0].split('/').filter(Boolean)[0] ?? '';

    var request: any = {
      FilterBy: baseRoute,
      MasterCode: "GetAllowedRoleForMenu"
    }

    await this.commonMasterService.CommonMasterDataByAction(request).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      if (data.State == EnumStatus.Success) {
        this.MenuAllowedRoleList = data.Data

        if (!this.MenuAllowedRoleList.some(
          (item: any) => Number(item.RoleID) == Number(this.sSOLoginDataModel.RoleID)
        )) {
          // Navigate to dashboard if RoleID is not allowed
          this.routers.navigate(['/dashboard']);
        }
      }
    })
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
    this.paginatedInTableData = [...this.UnitMasterList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.UnitMasterList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.UnitMasterList.length;
  }
  // (replace org. list here)
  get totalInTableSelected(): number {
    return this.UnitMasterList.filter((x:any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.UnitMasterList.forEach((x:any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.UnitMasterList.filter((x:any) => x.StudentID == item.StudentID && x.SemesterID == item.SemesterID);
    data.forEach((x:any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.UnitMasterList.every((r:any) => r.Selected);
  }
  // end table feature

}
