import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchModelAssignedApplication } from '../../../Models/DTE_AssignApplicationDataModel';
import { AssignApplicationService } from '../../../Services/DTE_AssignApplication/assign-application.service';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus, EnumDepartment } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
  selector: 'app-deficiency-uploaded-applications',
  templateUrl: './deficiency-uploaded-applications.component.html',
  styleUrls: ['./deficiency-uploaded-applications.component.css'],
  standalone: false
})
export class DeficiencyUploadedApplicationsComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public CategoryBlist: any = []
  public CategoryAlist: any = []
  public category_CList: any = []
  public GenderList: any = []
  public SearchDataFormGroup!: FormGroup
  public searchRequest = new SearchModelAssignedApplication()
  public AssignedStudentApplicationData: any = []
  public VerifierList: any = []
  public ID: number = 0
  public AppID: number = 0
  public ApplicationsData: any = []
  public assignverifierlist: any = []
  public assignverifierlist1: any = []
  public AssignVerifierID: number = 0
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CurrentVerifier: number = 0
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
  action: string = ''
  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private assignApplicationService: AssignApplicationService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private routers: Router,
    private encryptionService: EncryptionService,
    private Swal2: SweetAlert2,
  ) { }

  async ngOnInit() {

    this.SearchDataFormGroup = this.formBuilder.group(
      {
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
      })

    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("SSOLoginDataModle", this.SSOLoginDataModel);
    await this.GetMasterDDL();

    //this.ID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    await this.GetVerifierList();
    await this.GetStudentsData();
  }

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetCommonMasterDDLByType('CategoryB')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryBlist = data['Data'];
          console.log("CategoryBlist", this.CategoryBlist)
        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryAlist = data['Data'];
          console.log("CategoryAlist", this.CategoryAlist)
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.GetCommonMasterDDLByType('Category_C')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.category_CList = data['Data'];
          console.log("category_CList", this.category_CList)
        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
          console.log("GenderList", this.GenderList)
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

  async GetStudentsData() {
    try {

      this.loaderService.requestStarted();
      this.ApplicationsData.FromApplicationNo = this.searchRequest.FromApplication;
      this.ApplicationsData.ToApplicationNo = this.searchRequest.ToApplication;
      this.searchRequest.Eng_NonEng = this.SSOLoginDataModel.Eng_NonEng
      this.searchRequest.AcademicYearID = this.SSOLoginDataModel.FinancialYearID
      // this.searchRequest.VerifierID = this.SSOLoginDataModel.FinancialYearID
      this.searchRequest.Action = "_getAllDataUploaded";
      await this.assignApplicationService.GetVerifierData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State = EnumStatus.Success) {
          this.AssignedStudentApplicationData = data.Data
          this.CurrentVerifier = this.searchRequest.VerifierID
          this.GetAssignVerifierList()
          console.log("this.AssignApplicationData ", this.AssignedStudentApplicationData)
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

  async GetVerifierList() {
    try {
      this.loaderService.requestStarted();
      this.ApplicationsData.FromApplicationNo = this.searchRequest.FromApplication;
      this.ApplicationsData.ToApplicationNo = this.searchRequest.ToApplication;
      this.searchRequest.Eng_NonEng = this.SSOLoginDataModel.Eng_NonEng
      this.searchRequest.AcademicYearID = this.SSOLoginDataModel.FinancialYearID
      this.searchRequest.Action = "_getAllUploadedVerifiers";
      await this.assignApplicationService.GetVerifierData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State = EnumStatus.Success) {
          this.VerifierList = data.Data


          console.log("this.AssignApplicationData ", this.assignverifierlist)
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

  //async GetAssignVerifierList() {
  //  try {
  //    this.loaderService.requestStarted();
  //    this.ApplicationsData.FromApplicationNo = this.searchRequest.FromApplication;
  //    this.ApplicationsData.ToApplicationNo = this.searchRequest.ToApplication;
  //    this.searchRequest.Eng_NonEng = this.SSOLoginDataModel.Eng_NonEng
  //    this.searchRequest.AcademicYearID = this.SSOLoginDataModel.FinancialYearID
  //    this.searchRequest.Action = "_getAllUploadedVerifiers";
  //    await this.assignApplicationService.GetVerifierData(this.searchRequest).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      if (data.State = EnumStatus.Success) {
  //        this.assignverifierlist = data.Data


  //        this.assignverifierlist = this.assignverifierlist.filter((e: any) => e.VerifierID != this.searchRequest.VerifierID)
  //        console.log("this.AssignApplicationData ", this.assignverifierlist)
  //        ////table feature load
  //        //this.loadInTable();
  //        //end table feature load
  //      } else {
  //        this.toastr.error(data.ErrorMessage)
  //      }
  //    }, (error: any) => console.error(error));
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async SaveStudent() {
    //validation    

    const isSelected = this.AssignedStudentApplicationData.some((x: any) => x.Selected);
    if (!isSelected) {
      this.toastr.error("Please select at least one Student!");
      return;
    }
    // confirm
    this.Swal2.Confirmation("Are you sure you want to assign this Verifier to selected students?", async (result: any) => {
      //confirmed
      if (result.isConfirmed) {
        try {

          // Filter out only the selected students
          const selectedStudents = this.AssignedStudentApplicationData.filter((x: any) => x.Selected);

          selectedStudents.forEach((e: any) => {
            e.CheckerID = this.AssignVerifierID;
            e.ModifyBy = this.SSOLoginDataModel.UserID;
          });


          await this.assignApplicationService.AssignChecker(selectedStudents)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                await this.GetAssignVerifierList();
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        }
      }
    });
  }




  async GetAssignVerifierList() {
    try {
      this.loaderService.requestStarted();
      this.action = "VerifierDDL"
      await this.commonMasterService.GetCommonMasterData(this.action, this.SSOLoginDataModel.DepartmentID, this.SSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.assignverifierlist = data['Data'];
          this.assignverifierlist1 = this.assignverifierlist.filter((e: any) => e.ID != this.CurrentVerifier)
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
      await this.assignApplicationService.GetApplicationsById(ID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ApplicationsData = data.Data;
        console.log(this.ApplicationsData, "ApplicationsData")
        this.searchRequest.FromApplication = (this.ApplicationsData.FromApplicationNo).toString();
        this.searchRequest.ToApplication = (this.ApplicationsData.ToApplicationNo).toString();
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
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.AssignedStudentApplicationData].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.AssignedStudentApplicationData] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.AssignedStudentApplicationData.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.AssignedStudentApplicationData.filter((x: { Selected: any; }) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.AssignedStudentApplicationData.forEach((x: { Selected: boolean; }) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.AssignedStudentApplicationData.filter((x: { ApplicationID: any; }) => x.ApplicationID == item.ApplicationID);
    data.forEach((x: { Selected: boolean; }) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.AssignedStudentApplicationData.every((r: { Selected: any; }) => r.Selected);
  }
  // end table feature


  async Onrouting(ApplicationID: number) {

    this.AppID = ApplicationID
    await this.routers.navigate(['/documentationscrutiny'],
      { queryParams: { ApplicationID: this.encryptionService.encryptData(this.AppID) } }
    );
  }

  //async Onrouting(ApplicationID: number) {

  //  if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.BTER) {
  //    this.routers.navigate(['/documentationscrutiny'], {
  //      queryParams: { ApplicationID: ApplicationID }
  //    });
  //  } else {
  //    this.routers.navigate(['/ItiDocumentScrutiny'], {
  //      queryParams: { AppID: ApplicationID }
  //    });
  //  }
  //}


}
