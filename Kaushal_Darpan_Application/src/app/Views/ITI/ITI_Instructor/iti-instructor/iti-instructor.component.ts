import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, Renderer2, signal, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AppsettingService } from "../../../../Common/appsetting.service";
import { EnumDepartment, EnumStatus, GlobalConstants } from "../../../../Common/GlobalConstants";
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentDetailsModel } from "../../../../Models/DocumentDetailsModel";
import { PreviewApplicationModel } from "../../../../Models/PreviewApplicationformModel";
import { ItiApplicationFormService } from "../../../../Services/ItiApplicationForm/iti-application-form.service";
import { LoaderService } from "../../../../Services/Loader/loader.service";
import { ReportService } from "../../../../Services/Report/report.service";
import { CommonFunctionService } from "../../../../Services/CommonFunction/common-function.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";
import { jsPDF } from 'jspdf';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ItiApplicationSearchmodel } from "../../../../Models/ItiApplicationPreviewDataModel";
import { DropdownValidators } from "../../../../Services/CustomValidators/custom-validators.service";
import { ITIStateTradeCertificateSearchModel } from "../../../../Models/TheoryMarksDataModels";
import { ITICollegeStudentMarksheetSearchModel } from "../../../../Models/ITI/ITICollegeStudentMarksheetSearchModel";
import { StudentMarksheetSearchModel } from "../../../../Models/OnlineMarkingReportDataModel";

import { FontsService } from "../../../../Services/FontService/fonts.service";
import { ITI_InstructorService } from "../../../../Services/ITI/ITI_Instructor/ITI_Instructor.Service";
import { ITI_InstructorDataSearchModel, ITI_InstructorGridDataSearchModel, ITI_InstructorDataBindSearchModel } from "../../../../Models/ITI/ItiInstructorDataModel";
@Component({
  selector: 'app-marksheet',
  standalone: false,
  templateUrl: './iti-instructor.component.html',
  styleUrl: './iti-instructor.component.css'
})
export class ItiInstructorComponent{
  

  public searchrequest = new ItiApplicationSearchmodel();
  public searchRequestConsolidated = new ITIStateTradeCertificateSearchModel();

  sSOLoginDataModel: any;
  searchForm!: FormGroup;
  public InstructorSearch = new ITI_InstructorDataSearchModel();
  public InstructorBindSearch = new ITI_InstructorDataBindSearchModel();

  tooltipText = signal(''); 
  StudentExamsPapersList: any = [];
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  // public MarksheetSearch1 = new StudentMarksheetSearchModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public GetInstructorDataList: any[] = [];
  public InstructorDetailsModelList : any[] = [];
  public isSubmitted: boolean = false;
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
  public Table_SearchText: string = "";
  public request = new ITI_InstructorGridDataSearchModel();
  public requests = new ITI_InstructorDataBindSearchModel();
  public isShowGrid: boolean = false;
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  collegeDropDown: any = [];
  districtDropDown: any = [];

  constructor(
    private loaderService: LoaderService,
    private ApplicationService: ItiApplicationFormService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private fb: FormBuilder,
    private reportService: ReportService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private fontsService : FontsService,
    private ItiInstructorService: ITI_InstructorService,
    private router: Router,
  ) 
  {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);
  }

  async ngOnInit() {
    this.searchForm = this.fb.group({
      Name: [''],
      Uid: [''],
      //ApplicationNo:['']
    });
    this.InstructorBindSearch.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.InstructorBindSearch.Uid = '';
    this.InstructorBindSearch.Name = '';
    //this.InstructorBindSearch.ApplicationNo = '';
  
   //await this.GetItiInstructorDatas();

  } 

  async onSubmit() {  
    this.isSubmitted = true;
    if (this.searchForm.invalid) {
      console.log(this.searchForm.value)
      return
    }
  }


  //async onSearchClickAllotListITI() {
  //  debugger;

  //  //if (!this.requests.ApplicationNo || this.requests.ApplicationNo == '') {
  //    //this.toastr.warning('Please enter Application No.');
  //    //return;
  //  //}

  //  //this.isShowGrid = true;

  //  try {
  //    this.loaderService.requestStarted();
  //    await this.ItiInstructorService.GetGridInstructorData(this.request)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {


  //          if (data.Data[0]) {
  //            console.log("data", data.Data[0]);

  //            this.InstructorDetailsModelList = data['Data'];

  //            console.log("studentlist", this.InstructorDetailsModelList);

  //            if (this.InstructorDetailsModelList.length > 0) {
  //              this.isShowGrid = true;
  //            } else {
  //              this.isShowGrid = false;
  //            }

  //          } else {
  //            this.toastr.error(data.Data[0].MSG);
  //          }
  //        } else {
  //        }
  //      }, (error: any) => console.error(error));
  //  } catch (Ex) {
  //    console.log(Ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //onResetClick() {
  //  //this.request = new ITI_InstructorGridDataSearchModel();
  //  this.requests = new ITI_InstructorDataBindSearchModel();
  //  this.InstructorDetailsModelList = [];
  //  //this.isShowGrid = false;
  //}

  onResetClick() {
    // 1️⃣ Reset the reactive form fields
    this.searchForm.reset();

    // 2️⃣ Clear your bound search model
    this.InstructorBindSearch = {
      Uid: '',
      Name: ''
      // ApplicationNo: '' // if you use it later, add here too
    };
    //this.InstructorDetailsModelList = [];
    // 3️⃣ Optionally reload the default list
    //this.GetItiInstructorDatas();
  }

  onViewDetail(ID: any): void {
    console.log("item", ID);
    this.router.navigate(['/ItiInstructorForm', ID]);
  }

  

  //async GetItiInstructorData() {
  //  try {

  //    this.loaderService.requestStarted();
     
  //    await this.ItiInstructorService.GetGridBindInstructorData(this.InstructorBindSearch)
  //      .then((data: any) => {
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data && data.Data) {
  //            if(Object.keys(data).includes('Data')){
  //              this.GetInstructorDataList = data['Data'];
  //            }
  //            else{
  //              this.GetInstructorDataList = [data];
  //            }
          
  //          console.log(data);
            
  //        } else {
  //          this.toastr.error(this.Message)
  //        }
  //      }, (error: any) => {
  //        console.error(error);
  //        this.toastr.error(this.ErrorMessage)
  //      });

  //  } catch (Ex) {
  //    console.log(Ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  //using this function
  async GetItiInstructorDatas() {

    // ✅ Check Role ID first
    //if (this.sSOLoginDataModel.RoleID !== 16) {
    //  this.toastr.warning("You are not authorized to view instructor data.");
    //  return;
    //}

    try {
      this.loaderService.requestStarted();
      const searchValues = this.searchForm.value;

      //this.InstructorBindSearch.ApplicationNo = searchValues.ApplicationNo;
      this.InstructorBindSearch.Name = searchValues.Name;
      this.InstructorBindSearch.Uid = searchValues.Uid;
      this.InstructorBindSearch.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      await this.ItiInstructorService.GetGridBindInstructorData(this.InstructorBindSearch)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.InstructorDetailsModelList = data.Data;
          if (data && data.Data) {
            this.InstructorDetailsModelList = data.Data;
            this.totalInTableRecord = this.InstructorDetailsModelList.length;
            this.loadInTable();
          } else {
            this.toastr.error(this.Message);
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage);
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


   async deleteInstructorDataByID( id:number) {
    try {

      this.loaderService.requestStarted(); 
     
      await this.ItiInstructorService.deleteInstructorDataByID(id)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));

          if (data && data.Data) {
              this.ngOnInit();
              if(Object.keys(data).includes('Data')){
                this.GetInstructorDataList = data['Data'];
              }
              else{
                this.GetInstructorDataList = [data];
              }
          
            console.log(data);
            
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
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


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.InstructorDetailsModelList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = [];
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.InstructorDetailsModelList.length;
  }

  async searchbtn_click() {
    this.InstructorBindSearch.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.InstructorBindSearch.Uid = this.searchForm.value.Uid;
    this.InstructorBindSearch.Name = this.searchForm.value.Name;
  }

}

