import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { PaperUpload, PaperUploadInterface } from "../../../Models/PaperUploadInterface";
import { ItiTradeService } from "../../../Services/iti-trade/iti-trade.service";
import { CommonFunctionService } from "../../../Services/CommonFunction/common-function.service";
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { DocumentDetailsService } from "../../../Common/document-details";
import { EnumStatus } from "../../../Common/GlobalConstants";
import { DocumentDetailsModel } from "../../../Models/DocumentDetailsModel";
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { ToastrService } from "ngx-toastr";
import { MenuService } from "../../../Services/Menu/menu.service";
import { PaperMasterService } from "../../../Services/PapersMaster/papers-master.service";
import { PaperMasterSearchModel } from "../../../Models/PaperMasterDataModels";
import * as XLSX from 'xlsx';
import { AppsettingService } from "../../../Common/appsetting.service";
import { HttpClient } from "@angular/common/http";
import { RequestBaseModel } from "../../../Models/RequestBaseModel";
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-itipaper-uploaded-list',
  standalone: false,
  templateUrl: './itipaper-uploaded-list.component.html',
  styleUrl: './itipaper-uploaded-list.component.css'
})
export class ITIPaperUploadedListComponent implements OnInit, AfterViewInit {
  examForm!: FormGroup;
  PaperUploadTypesList!: any[];
  InstituteMasterList!: any[];
  SemesterMasterList!: any[];
  StreamMasterList: any = [];
  lstAcedmicYear: any = [];
  CenterMasterList: any = [];

  ExamList: any = [];
  PaperMasterList: any[] = [];
  PaperDetailsList: PaperUploadInterface[] = [];
  documentDetails: DocumentDetailsModel[] = [];
  totalRecords: number = 0;
  pageSize: number = 10; 
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  sSOLoginDataModel!: any;
  startDate = new Date();
  searchRequestPaper = new RequestBaseModel()
  displayedColumns: string[] = ['SrNo', 'ExamName', 'StreamName', 'SemesterName', 'PaperDate', 'CenterCode'];
  dataSource = new MatTableDataSource<PaperUploadInterface>([]);
  filterForm: FormGroup | undefined;
  instituteId: any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  modalReference: NgbModalRef | undefined;
  public CenterDtlsList: any = [];
  public SSOLoginDataModel_new = new SSOLoginDataModel()
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private menuService: MenuService,
    private apiService: ItiTradeService,
    private commonMasterService: CommonFunctionService,
    private PaperMasterService: PaperMasterService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private loaderService: LoaderService,
    private routers: Router,
    private modalService: NgbModal,
    private documentDetailsService: DocumentDetailsService) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SSOLoginDataModel_new = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllPaperUploadData();
  }

  async GetAllPaperUploadData() {
    let obj = {
      EndTermID: this.sSOLoginDataModel.EndTermID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng
    };
    try {
      await this.apiService.GetAllPaperUploadData(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.PaperDetailsList = data.Data;

        console.log(this.PaperDetailsList, 'ankit');

        this.dataSource = new MatTableDataSource(this.PaperDetailsList);
        this.dataSource.sort = this.sort;
        this.totalRecords = this.PaperDetailsList.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.updateTable();
      });
    } catch (error) {
      console.error(error);
    }
  }

  updateTable(filteredData: PaperUploadInterface[] = this.PaperDetailsList): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource.data = filteredData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }


  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.updateTable();
  }

  ngOnInit(): void {

    if (this.sSOLoginDataModel.RoleID == 7) {
      this.displayedColumns.push('Password');
      this.displayedColumns.push('Download');
    }

    this.examForm = this.fb.group({
      PaperUploadID: [null],
      ExamID: ['', Validators.required],
      ExamName: ['', Validators.required],
      StreamID: ['', Validators.required],
      SemesterID: ['', Validators.required],
      Password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
      ]],
      PaperID: [''],
      FinancialYearID: ['', Validators.required],
      FileName: [''],
      PaperDate: ['', Validators.required],
      CenterCode: [''],
      Active: [true],
    });

    this.filterForm = this.fb.group({
      searchTerm: [''],
      selectedStream: ['all'],
      selectedSemester: ['all'],
    });

    this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterList = data['Data'];
      }, (error: any) => console.error(error));

    this.commonMasterService.ITI_SemesterMaster()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));

    //this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID)
    //  .then((data: any) => {
    //    data = JSON.parse(JSON.stringify(data));
    //    this.StreamMasterList = data['Data'];
    //  }, (error: any) => console.error(error));

    this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.InstituteID)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterList = data['Data'];
      }, (error: any) => console.error(error));



    this.menuService.GetAcedmicYearList()
      .then((AcedmicYear: any) => {
        AcedmicYear = JSON.parse(JSON.stringify(AcedmicYear));
        this.lstAcedmicYear = AcedmicYear['Data'];
        //this.loaderService.requestEnded();
      }, error => console.error(error));

    this.commonMasterService.GetExamName().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ExamList = data.Data;
    })

  }

  ngAfterViewInit(): void {
    // Apply filter after the view is initialized
    setTimeout(() => {
      this.applyFilter(this.filterForm?.value);
    }, 1000);
  }

  applyFilter(values: any): void
  {
   
    const { searchTerm, selectedStream, selectedSemester } = values;
    let filteredData = this.PaperDetailsList.filter(item => {
      const matchesSearchTerm = item.ExamName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStream = selectedStream == 'all' || item.StreamID == selectedStream;
      const matchesSemester = selectedSemester == 'all' || item.SemesterID == selectedSemester;
      return matchesSearchTerm && matchesStream && matchesSemester;
    });

    this.totalRecords = filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.updateTable(filteredData);
  }

  resetForm(): void {
    this.filterForm?.reset({
      searchTerm: '',
      selectedStream: 'all',
      selectedSemester: 'all',
    });

    this.applyFilter(this.filterForm?.value);
  }

  GoToITIPaperUploadPage() {
    this.routers.navigate(['/iti-paper-upload']);
    //sessionStorage.setItem('PaperSetterAssignEditId', '0');
  }

  

  async ViewCenterDetail(content: any, PaperUploadedID: number) {
    await this.GetCenterDetailByPaperUploadID(PaperUploadedID)
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'md', keyboard: true, centered: true });
  }

  async GetCenterDetailByPaperUploadID(PaperUploadedID: number) {


    try {
      await this.apiService.GetCenterDetailByPaperUploadID(PaperUploadedID, this.SSOLoginDataModel_new.UserID, this.SSOLoginDataModel_new.RoleID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0) {
          this.CenterDtlsList = data.Data;
        }
        else
        {
          this.CenterDtlsList = [];
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  async DownloadCenterDtlsInExcel(PaperUploadedID: number) {

    try {
      await this.apiService.GetCenterDetailByPaperUploadID(PaperUploadedID, this.SSOLoginDataModel_new.UserID, this.SSOLoginDataModel_new.RoleID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0) {
          this.CenterDtlsList = data.Data;

          if (this.CenterDtlsList.length == 0) {
            this.toastr.error('Center List No Found.');
            return;
          }
          else
          {
            
            const keys = Object.keys(this.CenterDtlsList[0]);
            const _keys = Object.keys(this.CenterDtlsList[0]).filter(key => key !== 'CenterID');
            const totalColumns = _keys.length + 1;

            const tableHeader = `
             <tr>
              <th colspan="${totalColumns}" style="background-color: #90EE90 ; color: black; padding: 10px; font-size: 18px; text-align: center;">
                ITI Paper Download Center Report
              </th>
            </tr>
             <tr>
               <th style="border: 1px solid black; padding: 5px;">S.No.</th>
               ${_keys.map(key => `<th style="border: 1px solid black; padding: 5px;">${key}</th>`).join('')}
             </tr>`;

            const tableRows = this.CenterDtlsList.map((item: any, index: number) => `
            <tr>
              <td style="border: 1px solid black; padding: 5px;">${index + 1}</td>
                  ${_keys.map(key => {
                            let value = item[key];
                            if (key === 'IsDownload') {
                              value = value ? 'Yes' : 'No';
                            }
                            return `<td style="border: 1px solid black; padding: 5px;">${value ?? ''}</td>`;
                          }).join('')}
            </tr>
              `).join('');

            const html = `
             <html>
             <head>
               <meta charset="UTF-8">
               <style>
                 body {
                   background-color: white;
                   font-family: Calibri, sans-serif;
                 }
                 table {
                   border-collapse: collapse;
                   width: 50%;
                 }
                 th, td {
                   border: 1px solid black;
                   padding: 2px;
                   text-align: center;
                 }
                 th {
                   background-color: #f2f2f2;
                 }
               </style>
             </head>
             <body>
               <table>
                 <thead>${tableHeader}</thead>
                 <tbody>${tableRows}</tbody>
               </table>
             </body>
             </html>`;
                         

            const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'CenterDetails.xls';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }

        }
        else {
          this.CenterDtlsList = [];
        }
      });
    } catch (error) {
      console.error(error);
    }


}

}
