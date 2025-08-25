import { Component } from '@angular/core';

import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { CollegeMasterDataModels, CollegeMasterSearchModel } from '../../../Models/CollegeMasterDataModels';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ITIInvigilatorService } from '../../../Services/ITI/ITIInvigilator/itiinvigilator.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-iti-invigilator-payment-request',
  standalone: false,
  templateUrl: './iti-invigilator-payment-request.component.html',
  styleUrl: './iti-invigilator-payment-request.component.css'
})
export class ITIInvigilatorPaymentRequestComponent {

  public Marked?: boolean = false;
  public Table_SearchText: string = "";
  InstituteData: any = [];
  pageInTableSize: string = '50';
  startInTableIndex: number = 0;
  displayedColumns: string[] = [];
  public SSOLoginDataModel = new SSOLoginDataModel();

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public DropOutStudentList: any[] = [];
  modalReference: NgbModalRef | undefined;
  public Visible: number = 0;
  public AppointExaminerID: number = 0;
  public InvigilatorID: number = 0;

  public pdfUrl: SafeResourceUrl | null = null;
  public showPdfModal = false;
  public pdfFileName: string = '';
  public totalcheckedRow: any[] = [];//copy of main data

  public SelectedInvigilatorID :string =''

  constructor(

    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private http: HttpClient,
    private InvigilatorService: ITIInvigilatorService,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer,
    private routers: Router,

  ) { }

  async ngOnInit() {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetStudentDetails();
  }


  async GetStudentDetails() {
    try {
      this.loaderService.requestStarted();

      let obj = {
        InstituteID: this.SSOLoginDataModel.InstituteID ,
        EndTermID: this.SSOLoginDataModel.EndTermID,
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.SSOLoginDataModel.Eng_NonEng,
        UserID : this.SSOLoginDataModel.UserID,
      };


      await this.InvigilatorService.GetInvigilatorDataUserWise(obj)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            if (data.Data.length > 0) {
              this.InstituteData = data.Data;
              this.loadInTable();
            }

          }
          else if (data.State == EnumStatus.Error)
          {
            this.toastrService.error(data.Message)
          }
          //else {
          //  this.toastrService.error(data.ErrorMessage)
          //  //    data.ErrorMessage
          //}
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

  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.InstituteData.length;
  }
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.InstituteData].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.InstituteData] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }


  //async ViewPDF() {
  //  try {
  //    this.loaderService.requestStarted();

  //    console.log(this.paginatedInTableData)
  //    this.totalcheckedRow = this.paginatedInTableData.filter(s => s.ischeck == true);
  //    if (this.totalcheckedRow.length == 0)
  //    {
  //      this.toastrService.error("Please Select atleast one Record");
  //          return ;
  //    }

  //    return;

  //    let obj = {
  //      InstituteID: this.SSOLoginDataModel.InstituteID,
  //      EndTermID: this.SSOLoginDataModel.EndTermID,
  //      DepartmentID: this.SSOLoginDataModel.DepartmentID,
  //      Eng_NonEng: this.SSOLoginDataModel.Eng_NonEng,
  //      InvigilatorID: this.SSOLoginDataModel.UserID,
  //      SSOID: this.SSOLoginDataModel.SSOID,
  //      RoleID: this.SSOLoginDataModel.RoleID ,
  //      Status : 0
  //    };


  //    await this.InvigilatorService.Iti_InvigilatorPaymentGenerateAndViewPdf(obj)
  //      .then((data: any) => {
  //        if (data.State == EnumStatus.Success) {
  //          if (data.Data.length > 0) {
  //            this.InstituteData = data.Data;
  //            this.loadInTable();
  //          }

  //        }
  //        else {
  //          this.toastrService.error(data.ErrorMessage)
  //          //    data.ErrorMessage
  //        }
  //      }, (error: any) => console.error(error)
  //      );
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




  async ViewPDF() {
    try {


      this.loaderService.requestStarted();

      console.log(this.paginatedInTableData)
      this.totalcheckedRow = this.paginatedInTableData.filter(s => s.ischeck == true);
      if (this.totalcheckedRow.length == 0) {
        this.toastrService.error("Please Select atleast one Record");
        this.loaderService.requestEnded();
        return;
      }
      if (this.totalcheckedRow.length > 0) {
        this.SelectedInvigilatorID = ''; 
        this.paginatedInTableData.forEach(s => {
          if (s.ischeck === true) {
            this.SelectedInvigilatorID += s.InvigilatorID + ',';
          }
        });

        
        if (this.SelectedInvigilatorID.endsWith(',')) {
          this.SelectedInvigilatorID = this.SelectedInvigilatorID.slice(0, -1);
        }
      }
      console.log(this.SelectedInvigilatorID);
  


      let obj = {
        InstituteID: this.SSOLoginDataModel.InstituteID,
        EndTermID: this.SSOLoginDataModel.EndTermID,
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.SSOLoginDataModel.Eng_NonEng,
        InvigilatorID: this.SSOLoginDataModel.UserID,
        SSOID: this.SSOLoginDataModel.SSOID,
        RoleID: this.SSOLoginDataModel.RoleID,
        Status: 0,
        Userid: this.SSOLoginDataModel.UserID,
        ITIInvigilatorIDs: this.SelectedInvigilatorID,
      };


      await this.InvigilatorService.Iti_InvigilatorPaymentGenerateAndViewPdf(obj)
        .then((response: any) => {
          debugger;
          const contentType = response?.headers.get('Content-Type');
          //
          if (contentType === 'application/pdf') {//1.
            // Extract filename from header
            const contentDisposition = response?.headers.get('Content-Disposition');
            let fileName = 'Remuneration.pdf';
            if (contentDisposition) {
              const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
              if (match && match[1]) {
                fileName = match[1].replace(/['"]/g, '');

             
                const idMatch = fileName.match(/^RemunerationInvigilator(\d+)_/);
                this.pdfFileName = fileName;
                if (idMatch && idMatch[1]) {
                 // this.AppointExaminerID = parseInt(idMatch[1], 10);
                  this.InvigilatorID = parseInt(idMatch[1], 10);
                  this.pdfFileName = fileName;
                  console.log("Extracted AppointExaminerID:", this.InvigilatorID);
                 
                }
              }
            }
            // Download PDF
            const blob = response?.body as Blob;
            const url = window.URL.createObjectURL(blob);

            // Bypass Angular sanitization safely
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            //show
            this.showPdfModal = true;
          } else if (contentType?.includes('text/plain')) {//2.
            // Handle plain text (like errors or "No data")
            const reader = new FileReader();
            reader.onload = () => {
              //load text
              const message = reader.result as string;
              this.toastrService.error(message);
            };
            //read text
            reader.readAsText(response?.body as Blob);
          } else {
            //
            this.toastrService.error('Unexpected content type received.');
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }



  async clearAll()
  {
    // All checkbox clear
    this.paginatedInTableData.forEach(s => s.ischeck = false);
  }



  ClosePopupAndGenerateAndViewPdf() {
    this.showPdfModal = false;
   // this.searchRequest.ExaminerID = 0;
    //this.searchRequest.Status = 0;
    if (this.pdfUrl) {
      window.URL.revokeObjectURL(this.pdfUrl as string);
      this.pdfUrl = null;
    }
  }

  async SavePDFSubmitAndForwardToAdmin(InvigilatorID: number) {
    console.log(InvigilatorID)
    try {
      let obj = {
        UserID: this.SSOLoginDataModel.UserID,     
        RoleID: this.SSOLoginDataModel.RoleID,
        FileName: this.pdfFileName,
        EndTermID: this.SSOLoginDataModel.EndTermID,
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.SSOLoginDataModel.Eng_NonEng,
        ITIInvigilatorID: this.SelectedInvigilatorID
      };

      await this.InvigilatorService.SavePDFSubmitAndForwardToAdmin(obj)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastrService.success("Forwarded to admin");
            this.ClosePopupAndGenerateAndViewPdf();
            //this.GetStudentDetails();
              setTimeout(() => {
                this.routers.navigate(['/iti-remunerationInvigilatorApproved-list']);
              }, 1200);
         

          } else {
            this.toastrService.error(data.Message);        
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }


}
