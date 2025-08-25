import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { AssignApplicationService } from '../../../Services/DTE_AssignApplication/assign-application.service';
import { AssignApplicationSearchModel } from '../../../Models/DTE_AssignApplicationDataModel';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
    selector: 'app-assign-application-list',
    templateUrl: './assign-application-list.component.html',
    styleUrls: ['./assign-application-list.component.css'],
    standalone: false
})
export class AssignApplicationListComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public searchRequest = new AssignApplicationSearchModel();
  public isSubmitted = false;
  public VerifierID: number = 0
  public VerifiersList: any = []
  public AssignApplicationData: any = []
  public Table_SearchText: string = ""

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
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private commonFunctionService: CommonFunctionService,
    private assignApplicationService: AssignApplicationService,
    private Swal2: SweetAlert2
  ) {}

  async ngOnInit(){
    
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("SSOLoginDataModle", this.SSOLoginDataModel);
    this.searchRequest.DepartmentID = this.SSOLoginDataModel.DepartmentID
    this.searchRequest.Eng_NonEng = this.SSOLoginDataModel.Eng_NonEng;
    this.searchRequest.EndTermID = this.SSOLoginDataModel.EndTermID;
    await this.GetMasterDDL();
    await this.getAllData();
  }

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();

      await this.commonFunctionService.GetCommonMasterData('VerifierDDL', this.SSOLoginDataModel.DepartmentID, this.SSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.VerifiersList = data['Data'];
          console.log("VerifiersList", this.VerifiersList)
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

  async getAllData() {
    this.isSubmitted = true;
    try {
      this.loaderService.requestStarted();
      
      await this.assignApplicationService.GetAllData(this.searchRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State = EnumStatus.Success) {
            this.AssignApplicationData = data.Data
            console.log("this.AssignApplicationData ",this.AssignApplicationData )
            //table feature load
            this.loadInTable();
            //end table feature load
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        }, (error: any) => console.error(error));
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
    this.searchRequest.VerifierID = 0;
    this.searchRequest.Application = 0;
    this.getAllData();
  }

  async DeleteDataByID(ID: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.assignApplicationService.DeleteDataByID(ID, this.SSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);
                if (data.State = EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.getAllData();
                } else {
                  this.toastr.error(data.ErrorMessage)
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

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.AssignApplicationData].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.AssignApplicationData] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.AssignApplicationData.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.AssignApplicationData.filter((x: { Selected: any; }) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.AssignApplicationData.forEach((x: { Selected: boolean; }) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.AssignApplicationData.filter((x: { StudentID: any; }) => x.StudentID == item.StudentID);
    data.forEach((x: { Selected: boolean; }) => {
      x.Selected = isSelected;
    });
  }
  // end table feature


  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }



}
