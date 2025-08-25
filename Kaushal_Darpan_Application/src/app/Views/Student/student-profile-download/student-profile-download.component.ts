import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, Renderer2, signal, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AppsettingService } from "../../../Common/appsetting.service";
import { EnumDepartment, EnumStatus, GlobalConstants } from "../../../Common/GlobalConstants";
import { BterSearchmodel } from "../../../Models/ApplicationFormDataModel";
import { DocumentDetailsModel } from "../../../Models/DocumentDetailsModel";
import { PreviewApplicationModel } from "../../../Models/PreviewApplicationformModel";
import { BterApplicationForm } from "../../../Services/BterApplicationForm/bterApplication.service";
import { LoaderService } from "../../../Services/Loader/loader.service";
import { ReportService } from "../../../Services/Report/report.service";
import { CommonFunctionService } from "../../../Services/CommonFunction/common-function.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";
import { jsPDF } from 'jspdf';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-student-profile-download',
  standalone: false,
  templateUrl: './student-profile-download.component.html',
  styleUrl: './student-profile-download.component.css'
})
export class StudentProfileDownloadComponent implements AfterViewInit {
  public searchrequest = new BterSearchmodel();
  sSOLoginDataModel: any;
  searchForm!: FormGroup;
  tooltipText = signal(''); 
  StudentExamsPapersList: any = [];
  STUFFPapersList : any = [];
  public StudentDetails: any[] = [];
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  constructor(
    private loaderService: LoaderService,
    private ApplicationService: BterApplicationForm,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private fb: FormBuilder,
    private reportService: ReportService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
}
  ngAfterViewInit() {
    this.cdr.detectChanges(); // Make sure the DOM is ready
  }
  async ngOnInit() {
    this.searchForm = this.fb.group({
      EnrollmentNo: ['', Validators.required],
    });
    this.commonMasterService.StudentExamsPapers()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StudentExamsPapersList = data['Data'];
      }, (error: any) => console.error(error));
  }
  onSubmit() {
    if (this.searchForm.valid) {
      /*EE20240002/009*/
      this.GetById(this.searchForm.value.EnrollmentNo);
    }
  }
  async GetById(id:string) {
    this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID;
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    this.searchrequest.EnrollmentNo = id;
    try {
      await this.ApplicationService.GetStudentProfileDownload(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(this.StudentDetails,'DATAAA')

          this.StudentDetails = data['Data'];
          const papersObservable = of(this.StudentDetails[0].STUFFPapers.split(','));

          papersObservable.subscribe(x => {
            this.STUFFPapersList = x;
          })
          this.onHover(this.STUFFPapersList[0]);
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex); }
  }


  public downloadEnrollmentPDF() {
    const margin = 10; // Define margin size
    const pageWidth = 210 - 2 * margin; // A4 width (210mm) minus left & right margins
    const pageHeight = 200 - 2 * margin; // 500mm height minus top & bottom margins

    const doc = new jsPDF({
      orientation: 'p', // Portrait mode
      unit: 'mm',
      format: [210, 300], // A4 width (210mm) and custom height (500mm)
    });

    const pdfTable = this.pdfTable.nativeElement;
    const editorElement = document.getElementById('editor');

    if (editorElement) {
      editorElement.classList.add('customEditorStyle');
    }

    doc.html(pdfTable, {
      callback: function (doc) {
        doc.save('enrollment.pdf');

        if (editorElement) {
          editorElement.classList.remove('customEditorStyle');
        }
      },
      x: margin, // Apply left margin
      y: margin, // Apply top margin
      width: pageWidth, // Adjust width to fit within margins
      windowWidth: pdfTable.scrollWidth, // Ensures full content width
    });
  }


  onHover(item: string) {
    let filterData = this.StudentExamsPapersList.filter((x: { ID: string; }) => x.ID.trim() === item.trim());
    
    if (filterData.length > 0) {
      this.tooltipText.set(filterData[0].Name); // Set tooltip text
    }
  }

  // Function to reset tooltip when mouse leaves
  onMouseLeave() {
    this.tooltipText.set('');
  }

  async DownloadApplicationForm() {
    try {
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = EnumDepartment.BTER;
      this.searchrequest.ApplicationID = this.StudentDetails[0].ApplicationID;
      this.searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      console.log("searchrequest", this.searchrequest);
      await this.reportService.GetApplicationFormPreview(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage);
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

  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }
}

