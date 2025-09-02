import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, Renderer2, signal, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AppsettingService } from "../../../Common/appsetting.service";
import { EnumDepartment, EnumStatus, GlobalConstants } from "../../../Common/GlobalConstants";

import { DocumentDetailsModel } from "../../../Models/DocumentDetailsModel";
import { PreviewApplicationModel } from "../../../Models/PreviewApplicationformModel";
import { ItiApplicationFormService } from "../../../Services/ItiApplicationForm/iti-application-form.service";
import { LoaderService } from "../../../Services/Loader/loader.service";
import { ReportService } from "../../../Services/Report/report.service";
import { CommonFunctionService } from "../../../Services/CommonFunction/common-function.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";
import { jsPDF } from 'jspdf';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ItiApplicationSearchmodel } from "../../../Models/ItiApplicationPreviewDataModel";
import { DropdownValidators } from "../../../Services/CustomValidators/custom-validators.service";
import { ITIStateTradeCertificateSearchModel } from "../../../Models/TheoryMarksDataModels";
import { ITICollegeStudentMarksheetSearchModel } from "../../../Models/ITI/ITICollegeStudentMarksheetSearchModel";
import { StudentMarksheetSearchModel } from "../../../Models/OnlineMarkingReportDataModel";
import { ITICollegeMarksheetDownloadService } from "../../../Services/ITI/ITICollegeStudentMarksheet/ITICollegeStudentMarksheet.Service";
import { CenterSuperitendentExamReportService } from "../../../Services/ITI/CenterSuperitendentExamReport/CenterSuperitendentExamReport.Service";
import pdfmake from 'pdfmake/build/pdfmake';
import { FontsService } from "../../../Services/FontService/fonts.service";
import { ITINodalOfficerExminerSearch } from "../../../Models/ITI/ITINodalOfficerExminerReportModel";
import { SSOLoginDataModel } from "../../../Models/SSOLoginDataModel";
@Component({
  selector: 'app-marksheet',
  standalone: false,
  templateUrl: './center-superitendent-exam-report-master.component.html',
  styleUrl: './center-superitendent-exam-report-master.component.css'
})
export class CenterSuperitendentExamReportMasterComponent{
  

  pdfMakeVfs:any=pdfmake.vfs||{};
  
  public searchrequest = new ItiApplicationSearchmodel();
  public searchRequestConsolidated = new ITIStateTradeCertificateSearchModel();
  public searchRequest = new ITINodalOfficerExminerSearch();
  sSOLoginDataModel = new SSOLoginDataModel()
  searchForm!: FormGroup;
  tooltipText = signal(''); 
  StudentExamsPapersList: any = [];
  // STUFFPapersList : any = [];
  // public StudentDetails: any[] = [];
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  // public MarksheetSearch = new ITICollegeStudentMarksheetSearchModel();
  // public MarksheetSearch1 = new StudentMarksheetSearchModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public GetCenterSuperitendentReportList: any[] = [];
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
    public ItiResultDownloadService : ITICollegeMarksheetDownloadService,
    public CenterSuperitendentService:CenterSuperitendentExamReportService,
    private fontsService : FontsService
  ) 
  {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }
  // ngAfterViewInit() {
  //   this.cdr.detectChanges(); // Make sure the DOM is ready
  // }

   englishToHindiTranslation:any={
    satisfactory:'संतोषजनक',
    good:'अच्छा',
    unsatisfactory:'असंतोषजनक',
    no:'नहीं',
    yes:'हां',
    true:'हां',
    false:'नहीं'
  };



  async ngOnInit() {
   
    // console.log("im in")
    // this.searchForm = this.fb.group({
    //   collegeCode: ['', Validators.required],
    //   collegeID: ['', []],
    //   districtID: ['', []],
    // });
    //  this.MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
    // this.MarksheetSearch.InstituteID = 0;
    // this.MarksheetSearch.DistrictID = 0;
    await this.GetCenterSuperitendentReportData();
    // this.collegeDropDown = this.GetStudentITI_MarksheetList;
   
    //this.MarksheetSearch.ExamYearID = 1;
    this.pdfMakeVfs['NotoSansDevanagari-Regular.ttf'] = await this.fontsService.getHindiFontRegular();
    this.pdfMakeVfs['NotoSansDevanagari-Bold.ttf'] = await this.fontsService.getHindiFontBold();
    this.pdfMakeVfs['Roboto-Regular.ttf'] = await this.fontsService.getEnglishFontRegular();
    this.pdfMakeVfs['Roboto-Bold.ttf'] = await this.fontsService.getHindiFontBold();
    pdfmake.vfs = this.pdfMakeVfs;
  } 

  async onSubmit() {
    
    this.isSubmitted = true;
    if (this.searchForm.invalid) {
      console.log(this.searchForm.value)
      return
    }
    // this.GetITIStudent_MarksheetList();
  }
  // get _searchForm() { return this.searchForm.controls; }
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


  async GetCenterSuperitendentReportData() {
    debugger
    try {

      this.loaderService.requestStarted();

      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      if (this.sSOLoginDataModel.RoleID == 96 || this.sSOLoginDataModel.RoleID == 98) {
        this.searchRequest.UserID = this.sSOLoginDataModel.UserID
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      }
      this.searchRequest.CourseType = this.sSOLoginDataModel.Eng_NonEng
     
      // await this.CenterSuperitendentService.GetCenterSuperitendentReportData(this.MarksheetSearch)
      await this.CenterSuperitendentService.GetCenterSuperitendentReportData(this.searchRequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
              if(Object.keys(data).includes('Data')){
                this.GetCenterSuperitendentReportList = data['Data'];
              }
              else{
                this.GetCenterSuperitendentReportList = [data];
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
    this.paginatedInTableData = [...this.GetCenterSuperitendentReportList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.totalInTableRecord = this.GetCenterSuperitendentReportList.length;
  }


  generatePDF(id: number ) {
    debugger
      try {
        this.loaderService.requestStarted();
        this.CenterSuperitendentService.GetByID(id)
        .then((data: any) => {
            //data=JSON.parse(JSON.stringify(data));
            debugger
            data = data['Data'] || [];;
            console.log(data);
            data = data[0];
            console.log(data);
           data.examSchedule = JSON.parse(data.examSchedule);
            data.flyingSquadDetails = JSON.parse(data.flyingSquadDetails);

            pdfmake.fonts = {
              NotoSansDevanagari: {
                normal: 'NotoSansDevanagari-Regular.ttf',
                bold: 'NotoSansDevanagari-Bold.ttf'
              },
              Roboto: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Bold.ttf'
              }
            }
           let dateBody = [];
            dateBody.push(['दिनांक', 'प्रारंभ होने का समय', 'समाप्त होने का समय']);
            data.examSchedule.forEach((schedule: any) => {
              if(schedule.examDate && schedule.startTime && schedule.endTime) {
              dateBody.push([schedule.examDate, schedule.startTime, schedule.endTime]);
              }
            });
            console.log(dateBody);
            let dateBody1 = [];
            dateBody1.push(['क्रम सख्या', 'फ्लाईंग के आने की दिनांक व ठहरनें की समयावधी', 'फ्लाईग टीम के प्रभारी का नाम ,पद व वाहन संख्या']);
          data.flyingSquadDetails.forEach((schedule: any) =>
          {
              if(schedule.serialNumber && schedule.visitDate && schedule.duration && schedule.inchargeName && schedule.inchargePosition && schedule.vehicleNumber ) 
              {
                const visitInfo = `${schedule.visitDate || ''}, ${schedule.duration || ''}`;
                const inchargeInfo = `${schedule.inchargeName || ''}, ${schedule.inchargePosition || ''}, ${schedule.vehicleNumber || ''}`;
                dateBody1.push([schedule.serialNumber, {text :visitInfo, font: 'Roboto'}, {text :inchargeInfo, font: 'Roboto'}]);
              }
            });
            console.log(dateBody1);
            const docDefinition = {
              content: [
                {
                  text: 'प्रायोगिक परीक्षा केन्द्रों हेतु केन्द्र अधीक्षक द्वारा भेजी जाने वाली रिपोर्ट का प्रपत्र (राजकीय नोडल आई.टी.आई. को प्रेषित की जावे): - ',
                  bold: true,
                  fontSize: 14,
                  decoration: 'underline',
                  margin: [0, 0, 0, 5] // optional spacing below the text
                },
                {
                  ol: [
                    this.fontsService.checkStringHaveEnglish(data.confidentialityLevel) ? {
                      text:[
                        { text: 'गोपनीयता व निष्पक्षता का स्तर। ', font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
                        { text: data.confidentialityLevel, font: 'Roboto', fontSize: 12, margin: [0, 0, 0, 5] }
                      ]
                    }:{ text: 'गोपनीयता व निष्पक्षता का स्तर। '+ data.confidentialityLevel, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
                    { text: `परीक्षाऐं आयोजन का समय (क्या परीक्षाएँ सामान्य कार्य घण्टों से अधिक समय में आयोजित की गई है) । ${this.englishToHindiTranslation[data.examOnTime]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
                    
                      'परीक्षाऐं कितने दिनों तक आयोजित की गई (परीक्षाओं के आयोजन का समय का विवरण)।'
                      ]
                    },
                    dateBody.length > 1 ? {
                      style: 'tableExample',
                      table: {
                        widths: ['*', '*', '*'],
                        body: dateBody
                      }
                    }:{},
                    {
                      start: 4,
                      ol : [
                          {text:`कया मूल्यांकन के दौरान मार्किंग निर्देशों की पालना की गई है। ${this.englishToHindiTranslation[data.markingGuidance]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
                          {text: `क्या प्रत्यके ईकाई के लिये निर्देशानुसार जाब की साईज में परिवर्तन कर जॉब को भिन्न बताया गया है यदि हां तो विविरण संलग्न करें। ${this.englishToHindiTranslation[data.changeSizeOfUnits]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
                          {text: 'परीक्षा केन्द्र पर अन्य व्यवस्थाऐ ।', font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]}
                      ]
                    },
                    {text: `प्रकाश व्यवस्था: ${this.englishToHindiTranslation[data.lightFacilities]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
                    {text: `पानी की व्यवस्था: ${this.englishToHindiTranslation[data.waterFacilities]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
                    {text: `अनुशासन: ${this.englishToHindiTranslation[data.discipline]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
                    {text: `शौचालय की व्यवस्था: ${this.englishToHindiTranslation[data.toiletFacilities]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
                    {
                      start : 7,
                      ol : [
                        {text: `परीक्षा के दौरान घटित घटना जिससे परीक्षा की निष्पक्षता व गोपनीयता प्रभावित हुई हो। ${this.englishToHindiTranslation[data.incidentOnExam]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
                        {text: `परीक्षा संचालन बाबत् समग्र टिप्पणी। ${this.englishToHindiTranslation[data.examConductComment]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
                        {text: `भविष्य में संबन्धित संस्थान को परीक्षा केन्द्र बनाये जाने बाबत् टिप्पणी। ${this.englishToHindiTranslation[data.examConductComment]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
                        {text: [
                          `अन्य कोई सुझाव जो भविष्य में परीक्षा आयोजन हेतु लाभप्रद हो। `,
                          {text: data.otherFutureExamSuggestions, font: 'Roboto', fontSize: 12, margin: [0, 0, 0, 5]}
                        ]},
                        {text: `आपके परीक्षा केंद्र को फ्लाईंग द्वारा कब कब चैक किया गया (नीचे दिये अनुसार विवरण देवें)`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]}
                      ]
                    },
                    dateBody1.length > 1 ? {
                      style: 'tableExample',
                      table: {
                        widths: ['auto', 'auto', '*'],
                        body: dateBody1
                      }
                    }:{},

              ],
              defaultStyle: {
                font: 'NotoSansDevanagari',
                lineHeight: 1.5,
              },
              styles: {
                tableExample: {
                margin: [15, 2, 15, 2]
              },
              }
            };
            // pdfmake.createPdf(docDefinition as any).open();
            // pdfmake.createPdf(docDefinition as any).open('ITICenterSuperitendentExamReport.pdf');
  
            pdfmake.createPdf(docDefinition as any).download('RelievingForm.pdf');
  
          })
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



  //function for consolidatemarksheet
 


   //function for consolidatemarksheet


  searchbtn_click() {
  //  this.MarksheetSearch.CollegeCode = this.searchForm.value.collegeCode;
  //  this.MarksheetSearch.DistrictID = this.searchForm.value.districtID;
  //  this.MarksheetSearch.InstituteID = this.searchForm.value.collegeID;
  //  this.GetITICollegeStudent_Marksheet();
  }





}

