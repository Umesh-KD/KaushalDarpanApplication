import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, Renderer2, signal, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AppsettingService } from "../../../../Common/appsetting.service";
import { EnumDepartment, EnumStatus, GlobalConstants } from "../../../../Common/GlobalConstants";

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
import { ITICollegeMarksheetDownloadService } from "../../../../Services/ITI/ITICollegeStudentMarksheet/ITICollegeStudentMarksheet.Service";

@Component({
  selector: 'app-marksheet',
  standalone: false,
  templateUrl: './iti-marksheet.component.html',
  styleUrl: './iti-marksheet.component.css'
})
export class ITImarksheetDownloadComponent{
  public searchrequest = new ItiApplicationSearchmodel();
  public searchRequestConsolidated = new ITIStateTradeCertificateSearchModel();

  sSOLoginDataModel: any;
  searchForm!: FormGroup;
  tooltipText = signal(''); 
  StudentExamsPapersList: any = [];
  STUFFPapersList : any = [];
  public StudentDetails: any[] = [];
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  public MarksheetSearch = new ITICollegeStudentMarksheetSearchModel();
  public MarksheetSearch1 = new StudentMarksheetSearchModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public GetStudentITI_MarksheetList: any[] = [];
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
    public ReportServices: ReportService,
    public ItiResultDownloadService : ITICollegeMarksheetDownloadService
  ) 
  {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }
  // ngAfterViewInit() {
  //   this.cdr.detectChanges(); // Make sure the DOM is ready
  // }
  async ngOnInit() {
    debugger
    console.log("im in")
    this.searchForm = this.fb.group({
      collegeCode: ['', Validators.required],
      collegeID: ['', []],
      districtID: ['', []],
    });
     this.MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.MarksheetSearch.InstituteID = 0;
    this.MarksheetSearch.DistrictID = 0;
    this.MarksheetSearch.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
    await this.GetITICollegeStudent_Marksheet();
    this.collegeDropDown = this.GetStudentITI_MarksheetList;
   
    //this.MarksheetSearch.ExamYearID = 1;
   
  } 

  async onSubmit() {
    
    this.isSubmitted = true;
    if (this.searchForm.invalid) {
      console.log(this.searchForm.value)
      return
    }
    // this.GetITIStudent_MarksheetList();
  }
  get _searchForm() { return this.searchForm.controls; }
  // async GetITIStudent_MarksheetList() {
    
  //   try {

  //     this.loaderService.requestStarted();
  //     /* this.MarksheetSearch.RollNo = "10017";*/
  //     // this.MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
  //     this.MarksheetSearch.EndTermID = 14;
  //     await this.reportService.GetITIStudent_MarksheetList(this.MarksheetSearch)
  //       .then((data: any) => {
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         data = JSON.parse(JSON.stringify(data));
  //         debugger
  //         this.GetStudentITI_MarksheetList = data['Data']['Table'];
  //         console.log('checkdata',this.GetStudentITI_MarksheetList);
         
  //       }, (error: any) => {
  //         console.error(error);
  //         this.toastr.error(this.ErrorMessage)
  //       });

  //   } catch (Ex) {
  //     console.log(Ex);
  //   } finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }


  async GetITICollegeStudent_Marksheet() {
    
    try {

      this.loaderService.requestStarted();
   
      this.MarksheetSearch.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;

      await this.ItiResultDownloadService.GetITICollegeList(this.MarksheetSearch)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
              if(Object.keys(data).includes('Data')){
                this.GetStudentITI_MarksheetList = data['Data'];
              }
              else{
                this.GetStudentITI_MarksheetList = [data];
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

  // async GetITIStudent_PassList() {
    
  //   try {

  //     this.loaderService.requestStarted();

  //     this.MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
  //     await this.reportService.GetITIStudent_PassList(this.MarksheetSearch)
  //       .then((data: any) => {
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         data = JSON.parse(JSON.stringify(data));
          
  //         if (data && data.Data) {
  //           const base64 = data.Data;

  //           const byteCharacters = atob(base64);
  //           const byteNumbers = new Array(byteCharacters.length);
  //           for (let i = 0; i < byteCharacters.length; i++) {
  //             byteNumbers[i] = byteCharacters.charCodeAt(i);
  //           }

  //           const byteArray = new Uint8Array(byteNumbers);
  //           const blob = new Blob([byteArray], { type: 'application/pdf' });
  //           const blobUrl = URL.createObjectURL(blob);

  //           const link = document.createElement('a');
  //           link.href = blobUrl;
  //           link.download = 'StudentMarksheet.pdf';
  //           document.body.appendChild(link);
  //           link.click();
  //           document.body.removeChild(link);
  //           URL.revokeObjectURL(blobUrl);
  //         } else {
  //           this.toastr.error(this.Message)
  //         }
  //       }, (error: any) => {
  //         console.error(error);
  //         this.toastr.error(this.ErrorMessage)
  //       });

  //   } catch (Ex) {
  //     console.log(Ex);
  //   } finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
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
    this.paginatedInTableData = [...this.GetStudentITI_MarksheetList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.totalInTableRecord = this.GetStudentITI_MarksheetList.length;
  }



  // async ConsolidatedDownload(StudentID: number) {

  //   try {

  //     this.loaderService.requestStarted();
  //     this.searchRequestConsolidated.StudentID = StudentID;
  //     this.searchRequestConsolidated.EndTermID = this.sSOLoginDataModel.EndTermID;
  //     await this.ReportServices.ITIMarksheetConsolidated(this.searchRequestConsolidated)
  //       .then((data: any) => {
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         data = JSON.parse(JSON.stringify(data));

  //         if (data && data.Data) {
  //           const base64 = data.Data;

  //           const byteCharacters = atob(base64);
  //           const byteNumbers = new Array(byteCharacters.length);
  //           for (let i = 0; i < byteCharacters.length; i++) {
  //             byteNumbers[i] = byteCharacters.charCodeAt(i);
  //           }

  //           const byteArray = new Uint8Array(byteNumbers);
  //           const blob = new Blob([byteArray], { type: 'application/pdf' });
  //           const blobUrl = URL.createObjectURL(blob);

  //           const link = document.createElement('a');
  //           link.href = blobUrl;
  //           link.download = 'ConsolidatedMarksheet.pdf';
  //           document.body.appendChild(link);
  //           link.click();
  //           document.body.removeChild(link);
  //           URL.revokeObjectURL(blobUrl);
  //         } else {
  //           this.toastr.error(this.Message)
  //         }
  //       }, (error: any) => {
  //         console.error(error);
  //         this.toastr.error(this.ErrorMessage)
  //       });

  //   } catch (Ex) {
  //     console.log(Ex);
  //   } finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }



  // async TradeWiseResultDownload(StudentID: number) {

  //   try {

  //     this.loaderService.requestStarted();
  //     //this.searchRequestConsolidated.ExamYearID = this.MarksheetSearch.ExamYearID;
  //     this.searchRequestConsolidated.ExamYearID = 2;
  //     this.searchRequestConsolidated.StudentID = StudentID;
  //     this.searchRequestConsolidated.EndTermID = this.sSOLoginDataModel.EndTermID;
  //     await this.ReportServices.ITITradeWiseResult(this.searchRequestConsolidated)
  //       .then((data: any) => {
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         data = JSON.parse(JSON.stringify(data));

  //         if (data && data.Data) {
  //           const base64 = data.Data;

  //           const byteCharacters = atob(base64);
  //           const byteNumbers = new Array(byteCharacters.length);
  //           for (let i = 0; i < byteCharacters.length; i++) {
  //             byteNumbers[i] = byteCharacters.charCodeAt(i);
  //           }

  //           const byteArray = new Uint8Array(byteNumbers);
  //           const blob = new Blob([byteArray], { type: 'application/pdf' });
  //           const blobUrl = URL.createObjectURL(blob);

  //           const link = document.createElement('a');
  //           link.href = blobUrl;
  //           link.download = 'TradeWiseResult.pdf';
  //           document.body.appendChild(link);
  //           link.click();
  //           document.body.removeChild(link);
  //           URL.revokeObjectURL(blobUrl);
  //         } else {
  //           this.toastr.error(this.Message)
  //         }
  //       }, (error: any) => {
  //         console.error(error);
  //         this.toastr.error(this.ErrorMessage)
  //       });

  //   } catch (Ex) {
  //     console.log(Ex);
  //   } finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  //  Functions for marksheet
  async GetITIStudent_Marksheet(institudeId: number = 0,CollegeCode:any) {
    
    try {

      this.loaderService.requestStarted();
      this.MarksheetSearch.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      this.MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.MarksheetSearch.CollegeCode = CollegeCode;
      // this.MarksheetSearch.InstituteID = 1;
      this.MarksheetSearch.InstituteID = institudeId;
      this.MarksheetSearch.ExamYearID = 2;
      await this.ItiResultDownloadService.GetITIStudent_Marksheet(this.MarksheetSearch)
         .then((response: any) => {
          debugger;
          const contentType = response?.headers.get('Content-Type');
          //
          if (contentType === 'application/zip') {//1.
            // Extract filename from header
            const contentDisposition = response?.headers.get('Content-Disposition');
            let fileName = 'Students_' + this.MarksheetSearch.CollegeCode + '.zip';
            if (contentDisposition) {
              const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
              if (match && match[1]) {
                fileName = match[1].replace(/['"]/g, '');
              }
            }
            // Download PDF
            const blob = response?.body as Blob;
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(objectUrl);

          } else if (contentType?.includes('text/plain')) {//2.
            // Handle plain text (like errors or "No data")
            const reader = new FileReader();
            reader.onload = () => {
              //load text
              const message = reader.result as string;
              this.toastr.error(message);
            };
            //read text
            reader.readAsText(response?.body as Blob);
          } else {
            //
            this.toastr.error('Unexpected content type received.');
          }
        }, (error: any) => console.error(error)
        );

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  //function for consolidatemarksheet
  async GetITIStudent_ConsolidateMarksheet(institudeId: number = 0, CollegeCode:any) {
    try {

      this.loaderService.requestStarted();
      this.MarksheetSearch.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      this.MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.MarksheetSearch.CollegeCode = CollegeCode;
      // this.MarksheetSearch.InstituteID = 1;
      this.MarksheetSearch.InstituteID = institudeId;
      // this.MarksheetSearch.ExamYearID = 2;
      this.ItiResultDownloadService.ConsolidateTestMethod(this.MarksheetSearch)
      .then((response: any) => {
            debugger;
            const contentType = response?.headers.get('Content-Type');
            //
            if (contentType === 'application/zip') {//1.
              // Extract filename from header
              const contentDisposition = response?.headers.get('Content-Disposition');
              let fileName = 'ConsolidateMarksheet' + this.MarksheetSearch.CollegeCode + '.zip';
              if (contentDisposition) {
                const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match && match[1]) {
                  fileName = match[1].replace(/['"]/g, '');
                }
              }
              // Download PDF
              const blob = response?.body as Blob;
              const a = document.createElement('a');
              const objectUrl = URL.createObjectURL(blob);
              a.href = objectUrl;
              a.download = fileName;
              a.click();
              URL.revokeObjectURL(objectUrl);

            } else if (contentType?.includes('text/plain')) {//2.
              // Handle plain text (like errors or "No data")
              const reader = new FileReader();
              reader.onload = () => {
                //load text
                const message = reader.result as string;
                this.toastr.error(message);
              };
              //read text
              reader.readAsText(response?.body as Blob);
            } else {
              //
              this.toastr.error('Unexpected content type received.');
            }
          }, (error: any) => console.error(error)
          );

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


   //function for consolidatemarksheet
  async GetITIStudent_SCVTCertificate(institudeId: number = 0, CollegeCode:any) {
    try {
      debugger;
      this.loaderService.requestStarted();
      this.MarksheetSearch.TradeScheme = this.sSOLoginDataModel.Eng_NonEng;
      this.MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.MarksheetSearch.CollegeCode = CollegeCode;
      // this.MarksheetSearch.InstituteID = 1;
      this.MarksheetSearch.InstituteID = institudeId;
      // this.MarksheetSearch.ExamYearID = 2;
      this.ItiResultDownloadService.GetITIStudent_SCVTCertificate(this.MarksheetSearch)
      .then((response: any) => {
            debugger;
            const contentType = response?.headers.get('Content-Type');
            //
            if (contentType === 'application/zip') {//1.
              // Extract filename from header
              const contentDisposition = response?.headers.get('Content-Disposition');
              let fileName = 'SCVTCertificate' + this.MarksheetSearch.CollegeCode + '.zip';
              if (contentDisposition) {
                const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match && match[1]) {
                  fileName = match[1].replace(/['"]/g, '');
                }
              }
              // Download PDF
              const blob = response?.body as Blob;
              const a = document.createElement('a');
              const objectUrl = URL.createObjectURL(blob);
              a.href = objectUrl;
              a.download = fileName;
              a.click();
              URL.revokeObjectURL(objectUrl);

            } else if (contentType?.includes('text/plain')) {//2.
              // Handle plain text (like errors or "No data")
              const reader = new FileReader();
              reader.onload = () => {
                //load text
                const message = reader.result as string;
                this.toastr.error(message);
              };
              //read text
              reader.readAsText(response?.body as Blob);
            } else {
              //
              this.toastr.error('Unexpected content type received.');
            }
          }, (error: any) => console.error(error)
          );

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  searchbtn_click() {
   this.MarksheetSearch.CollegeCode = this.searchForm.value.collegeCode;
   this.MarksheetSearch.DistrictID = this.searchForm.value.districtID;
   this.MarksheetSearch.InstituteID = this.searchForm.value.collegeID;
   this.GetITICollegeStudent_Marksheet();
  }





}

