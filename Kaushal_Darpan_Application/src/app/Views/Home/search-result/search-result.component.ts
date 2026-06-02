import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EnumResultType, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CampusDetailsWebSearchModel } from '../../../Models/CampusDetailsWebDataModel';
import { StudentResultSearchModel } from '../../../Models/DownloadMarksheetDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { MarksheetDownloadService } from '../../../Services/MarksheetDownload/marksheet-download.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
  standalone: false
})
export class SearchResultComponent implements OnInit {
  _formGroup!: FormGroup;
  public isSubmitted: boolean = false;
  public resultSearchReq = new StudentResultSearchModel();
  public searchRequest = new CampusDetailsWebSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public SemesterList: any = [];
  public FinancialYear: any = [];
  public StudentData: any = [];
  public SubjectDetailsData: any = [];
  public FinalResultData: any = [];

  public StudentResultData: any;
  public showResult: boolean = false;

  minEndDate: string = '';

  searchModel = {
    startDate: '',
    endDate: ''
  };
  FilteredCampusPostList: any[] = [];
  CampusFromDate: string = '';
  CampusToDate: string = '';
  FinancialYearID: number = 0;
  InstituteID: number = 0;
  OriginalCampusPostList: any[] = []; // Store unfiltered data
  public BranchMasterList: any[] = [];
  StreamID: number = 0;
  ResultTypeList: any;
  public _enumResultType = EnumResultType;

  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private marksheetDownloadService: MarksheetDownloadService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    this._formGroup = this.fb.group({
      EndTermID: ['0', [DropdownValidators]],
      SemesterID: ['0', [DropdownValidators]],
      ResultType: ['0', [DropdownValidators]],
      RollNo: ['', Validators.required],
      DOB: ['', Validators.required],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.resultSearchReq = new StudentResultSearchModel();
    await this.GetSemesterList();
    await this.GetResultEndTermDDLList();
    await this.GetResultTypeList();
  }

  async GetSemesterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterList = data['Data'];
          this.SemesterList = this.SemesterList.filter((x: any) => x.SemesterID !== 7 && x.SemesterID !== 8 && x.SemesterID !== 9);
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetResultEndTermDDLList() {
    this.loaderService.requestStarted();

    try {
      const data: any = await this.marksheetDownloadService.GetResultEndTermDDLList();
      const parsedData = JSON.parse(JSON.stringify(data)); // Not ideal, see note below
      this.FinancialYear = parsedData['Data'];

    } catch (error) {
      console.error('Error in GetFinancialYear:', error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStudentResult_public() {
    //debugger
    try {
      this.isSubmitted = true;
      if (this._formGroup.invalid) {
        return;
      }
      //debugger
      // call
      await this.marksheetDownloadService.GetStudentResult_public(this.resultSearchReq)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.StudentResultData = data['Data'];
            this.StudentData = data.Data['Table'][0];
            this.SubjectDetailsData = data.Data['Table1'];
            this.FinalResultData = data.Data['Table2'];

            if (this.SubjectDetailsData?.length > 0) {
              this.showResult = true;
            }
          } else if (data.State === EnumStatus.Warning) {
            this.showResult = false;
            this.toastr.warning(data.Message);
            this.StudentResultData = [];
            this.StudentData = [];
            this.SubjectDetailsData = [];
            this.FinalResultData = [];
          } else {
            this.showResult = false;
            this.toastr.error(data.Message);
            console.error(data.ErrorMessage);
            this.StudentResultData = [];
            this.StudentData = [];
            this.SubjectDetailsData = [];
            this.FinalResultData = [];
          }

        })
    } catch (error) {
      console.error(error);
    }
  }

  onendtermchange(event: any) {
    this.resultSearchReq.EndTermID = event.target.value;
  }

  onsemesterchange(event: any) {
    this.resultSearchReq.SemesterID = event.target.value;
  }

  // downloadPDF() {
  //   const element = document.getElementById('resultContent');

  //   if (!element) return;

  //   html2canvas(element, { scale: 2 }).then(canvas => {
  //     const imgData = canvas.toDataURL('image/png');

  //     const pdf = new jsPDF('p', 'mm', 'a4');

  //     const imgWidth = 210; // A4 width in mm
  //     const pageHeight = 295; // A4 height
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     let heightLeft = imgHeight;
  //     let position = 0;

  //     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;

  //     // Handle multiple pages
  //     while (heightLeft > 0) {
  //       position = heightLeft - imgHeight;
  //       pdf.addPage();
  //       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }

  //     pdf.save('Result.pdf');
  //   });
  // }

  downloadPDF() {
    const element = document.getElementById('resultContent');

    if (!element) return;
    // Add PDF mode class
    element?.classList.add('pdf-mode');

    html2canvas(element, {
      scale: 2
    }).then(canvas => {

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`result_${this.resultSearchReq.RollNo}.pdf`);

      // Remove class after PDF generation
      element.classList.remove('pdf-mode');
    });
  }

  async GetResultTypeList() {
    try {
      await this.commonMasterService.GetExamResultType()
        .then((data: any) => {
          this.ResultTypeList = data['Data'] || [];
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }
}
