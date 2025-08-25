import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  RevertApplicationDataModel,
  SearchModelAssignedApplication,
} from '../../../Models/DTE_AssignApplicationDataModel';
import { AssignApplicationService } from '../../../Services/DTE_AssignApplication/assign-application.service';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-assigned-applications',
  templateUrl: './assigned-applications.component.html',
  styleUrls: ['./assigned-applications.component.css'],
  standalone: false,
})
export class AssignedApplicationsComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel();
  public CategoryBlist: any = [];
  public CategoryAlist: any = [];
  public category_CList: any = [];
  public GenderList: any = [];
  public SearchDataFormGroup!: FormGroup;
  public searchRequest = new SearchModelAssignedApplication();
  public AssignedStudentApplicationData: any = [];
  public ID: number = 0;
  public AppID: number = 0;
  public ApplicationsData: any = [];
  public requestRevert = new RevertApplicationDataModel();

  //table feature default
  public paginatedInTableData: any[] = []; //copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = '50';
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private assignApplicationService: AssignApplicationService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private routers: Router,
    private encryptionService: EncryptionService
  ) {}

  async ngOnInit() {
    this.SearchDataFormGroup = this.formBuilder.group({
      ddlCategoryA: [''],
      ddlCategoryB: [''],
      ddlCategoryC: [''],
      ddlGender: [''],
      ddlCategoryD: [''],
      ddlApplicationStatus: [''],
      txtName: [''],
      txtMobileNo: [''],
      txtApplicaitonFrom: [''],
      txtApplicaitonTo: [''],
    });

    this.SSOLoginDataModel = await JSON.parse(
      String(localStorage.getItem('SSOLoginUser'))
    );
    console.log('SSOLoginDataModle', this.SSOLoginDataModel);
    await this.GetMasterDDL();

    this.ID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    if (this.ID) {
      await this.GetApplicationsById(this.ID);
    }
  }

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetCommonMasterDDLByType('CategoryB').then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryBlist = data['Data'];
          console.log('CategoryBlist', this.CategoryBlist);
        },
        (error: any) => console.error(error)
      );
      await this.commonMasterService.CasteCategoryA().then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryAlist = data['Data'];
          console.log('CategoryAlist', this.CategoryAlist);
        },
        (error: any) => console.error(error)
      );

      await this.commonMasterService
        .GetCommonMasterDDLByType('Category_C')
        .then(
          (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.category_CList = data['Data'];
            console.log('category_CList', this.category_CList);
          },
          (error: any) => console.error(error)
        );

      await this.commonMasterService.GetCommonMasterData('Gender').then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log('GenderList', this.GenderList);
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStudentsData() {
    try {
      this.loaderService.requestStarted();
      this.ApplicationsData.FromApplicationNo =
        this.searchRequest.FromApplication;
      this.ApplicationsData.ToApplicationNo = this.searchRequest.ToApplication;
      this.searchRequest.Eng_NonEng = this.SSOLoginDataModel.Eng_NonEng;
      this.searchRequest.AcademicYearID =
        this.SSOLoginDataModel.FinancialYearID;
      await this.assignApplicationService
        .GetStudentsData(this.searchRequest)
        .then(
          (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if ((data.State = EnumStatus.Success)) {
              this.AssignedStudentApplicationData = data.Data;
              console.log(
                'this.AssignApplicationData ',
                this.AssignedStudentApplicationData
              );
              //table feature load
              this.loadInTable();
              //end table feature load
            } else {
              this.toastr.error(data.ErrorMessage);
            }
          },
          (error: any) => console.error(error)
        );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async clearSearchData() {
    this.searchRequest.ApplicationStatus = 0;
    this.searchRequest.CategoryA = 0;
    this.searchRequest.CategoryB = 0;
    this.searchRequest.CategoryC = 0;
    this.searchRequest.CategoryD = 0;
    this.searchRequest.Gender = 0;
    this.searchRequest.Name = '';
    this.searchRequest.MobileNumber = '';
    this.GetStudentsData();
  }

  async GetApplicationsById(ID: number) {
    try {
      this.loaderService.requestStarted();
      await this.assignApplicationService
        .GetApplicationsById(ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ApplicationsData = data.Data;
          console.log(this.ApplicationsData, 'ApplicationsData');
          this.searchRequest.FromApplication =
            this.ApplicationsData.FromApplicationNo.toString();
          this.searchRequest.ToApplication =
            this.ApplicationsData.ToApplicationNo.toString();
          this.GetStudentsData();
        });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(
      this.totalInTableRecord / parseInt(this.pageInTableSize)
    );
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex =
      (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex =
      this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex =
      this.endInTableIndex > this.totalInTableRecord
        ? this.totalInTableRecord
        : this.endInTableIndex;
    this.paginatedInTableData = [...this.AssignedStudentApplicationData].slice(
      this.startInTableIndex,
      this.endInTableIndex
    );
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
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
    if (
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (
      this.currentInTablePage <= 0 ||
      this.currentInTablePage > this.totalInTablePage
    ) {
      this.currentInTablePage = 1;
    }
    if (
      this.currentInTablePage > 0 &&
      this.currentInTablePage < this.totalInTablePage &&
      this.totalInTablePage > 0
    ) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection =
      this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = (
      [...this.AssignedStudentApplicationData] as any[]
    )
      .sort((a, b) => {
        const comparison =
          a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
        return this.sortInTableDirection == 'asc' ? comparison : -comparison;
      })
      .slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = []; //copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.AssignedStudentApplicationData.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.AssignedStudentApplicationData.filter(
      (x: { Selected: any }) => x.Selected
    )?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.AssignedStudentApplicationData.forEach((x: { Selected: boolean }) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.AssignedStudentApplicationData.filter(
      (x: { ApplicationID: any }) => x.ApplicationID == item.ApplicationID
    );
    data.forEach((x: { Selected: boolean }) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.AssignedStudentApplicationData.every(
      (r: { Selected: any }) => r.Selected
    );
  }
  // end table feature

  async Onrouting(ApplicationID: number) {
    this.AppID = ApplicationID;
    await this.routers.navigate(['/documentationscrutiny'], {
      queryParams: {
        ApplicationID: this.encryptionService.encryptData(this.AppID),
        key: 2,
        statusid: this.ID
      },
    });
  }

  async RevertApplication(applicationID: number) {
    try {
      this.loaderService.requestStarted();
      this.requestRevert.ApplicationID = applicationID;
      this.requestRevert.UserID = this.SSOLoginDataModel.UserID;
      
      await this.assignApplicationService.RevertApplication(this.requestRevert).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.GetStudentsData()
          } else {
            this.toastr.error(data.ErrorMessage);
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
}
