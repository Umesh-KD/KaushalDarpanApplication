import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
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

@Component({
  selector: 'app-bter-paper-upload',
  standalone: false,
  templateUrl: './bter-paper-upload.component.html',
  styleUrl: './bter-paper-upload.component.css'
})
export class BterPaperUploadComponent implements OnInit, AfterViewInit {
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
  displayedColumns: string[] = ['SrNo', 'ExamName', 'StreamName', 'SemesterName', 'PaperType', 'PaperDate', 'CenterCode'];
  dataSource = new MatTableDataSource<PaperUploadInterface>([]);
  filterForm: FormGroup | undefined;
  instituteId: any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private menuService: MenuService,
    private commonMasterService: CommonFunctionService,
    private PaperMasterService: PaperMasterService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private documentDetailsService: DocumentDetailsService) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllPaperUploadData();
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
      PaperID: ['', Validators.required],
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

    this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterList = data['Data'];
      }, (error: any) => console.error(error));

    this.commonMasterService.StreamMaster()
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

    this.searchRequestPaper.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequestPaper.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequestPaper.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.commonMasterService.GetCenterMasterDDL(this.searchRequestPaper)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CenterMasterList = data['Data'];
      }, (error: any) => console.error(error));


    this.PaperMasterService.GetAllData(this.searchRequestPaper)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.PaperMasterList = data['Data'];

      }, error => console.error(error));

    this.filterForm.valueChanges.subscribe((values) => {
      this.applyFilter(values);
    });
   
  }

  ngAfterViewInit(): void {
    // Apply filter after the view is initialized
    setTimeout(() => {
      this.applyFilter(this.filterForm?.value);
    }, 1000);
  }

  applyFilter(values: any): void {
    const { searchTerm, selectedStream, selectedSemester } = values;
    let filteredData = this.PaperDetailsList.filter(item => {
      const matchesSearchTerm = item.ExamName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStream = selectedStream === 'all' || item.StreamName == selectedStream;
      const matchesSemester = selectedSemester === 'all' || item.SemesterName === selectedSemester;

      return matchesSearchTerm && matchesStream && matchesSemester;
    });

    this.totalRecords = filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.updateTable(filteredData);
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

  resetForm(): void {
    this.filterForm?.reset({
      searchTerm: '',
      selectedStream: 'all',
      selectedSemester: 'all',
    });

    this.applyFilter(this.filterForm?.value);
  }

  onExamChange(event: any): void {
    const selectedExam = this.ExamList.find((exam: { ID: any; }) => exam.ID == event.target.value);
    if (selectedExam) {
      this.examForm.get('ExamName')?.setValue(selectedExam.Name);
    }
  }

  async GetAllPaperUploadData() {
    let obj = {
      EndTermID: this.sSOLoginDataModel.EndTermID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID
    };
    try {
      await this.PaperMasterService.GetAllPaperUploadData(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.PaperDetailsList = data.Data;
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

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.updateTable();
  }

  // Simulate the saving of data into the table
  async onSubmit() {
    const sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.examForm.valid) {
      const formData = this.examForm.value as PaperUpload;
      
      let obj = {
        ExamID: formData.ExamID,
        ExamName: formData.ExamName,
        StreamID: formData.StreamID,
        SemesterID: formData.SemesterID,
        Password: formData.Password,
        PaperID: formData.PaperID,
        FinancialYearID: formData.FinancialYearID,
        PaperDate: formData.PaperDate,
        FileName: this.documentDetails[0].FileName,
        Dis_FileName: this.documentDetails[0].Dis_FileName,
        CenterCode: formData.CenterCode.toString(),
        Active: formData.Active,
        CreatedBy: sSOLoginDataModel.UserID,
        ModifyBy: sSOLoginDataModel.UserID,
        EndTermID: sSOLoginDataModel.EndTermID,
        IPAddress: sSOLoginDataModel.IpPhone,
        ModifyDate: new Date()
      };

      try {
        await this.PaperMasterService.SavePaperUploadData(obj).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.Data == 1) {
            this.toastr.success(data.Message);
            this.GetAllPaperUploadData();
            this.documentDetails = [];
          }

        });
      } catch (error) {
        console.error(error);
      }
      this.examForm.reset();
    }
  }

  async UploadDocument(event: any) {
    try {
      const formData = this.examForm.value as PaperUpload
      //upload model
      if (formData.Password != null && formData.Password != "" && formData.Password != undefined) {
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "";
        uploadModel.FolderName = "ITIUpload";
        uploadModel.Password = formData.Password;
        //call
        await this.documentDetailsService.UploadFile(event, uploadModel)
          .then((data: any) => {

            if (data.State == EnumStatus.Success) {
              //add/update document in js list
              this.documentDetails = data.Data;
              this.documentDetails[0].FileName = data.Data[0].FileName;
              this.documentDetails[0].Dis_FileName = data.Data[0].Dis_FileName;
              console.log(this.documentDetails);
              this.examForm.patchValue({
                FileName: this.documentDetails[0].FileName,
                Dis_FileName: this.documentDetails[0].Dis_FileName
              })
              //reset file type
              event.target.value = null;
            }
            if (data.State == EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage)
            }
            else if (data.State == EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage)
            }
          });
      }
      else {
        this.examForm.get('FileName')?.reset();
        this.toastr.warning("Password Required")
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async DeleteDocument(item: any) {
    try {
      // delete from server folder
      let deleteModel = new DeleteDocumentDetailsModel()
      deleteModel.FolderName = "ITIUpload";
      deleteModel.FileName = this.documentDetails[0].FileName;
      //call
      await this.documentDetailsService.DeleteDocument(deleteModel)
        .then((data: any) => {
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.documentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.documentDetails[index].FileName = '';
              this.documentDetails[index].Dis_FileName = '';
            }
            console.log(this.documentDetails)
          }
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  exportToExcel(): void {
    //const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('data-table')!);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.PaperDetailsList);
    // Create a new Excel workbook this.PreExamStudentData
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'CollegesWiseReports.xlsx');
  }

  // Toggle password visibility
  togglePasswordVisibility(element: any): void {
    element.showPassword = !element.showPassword;
  }

  // Copy password to clipboard
  onCopySuccess(element: any): void {
    element.isCopied = true; // Optionally change the icon or show a success message
    setTimeout(() => {
      element.isCopied = false; // Reset after a short delay
    }, 2000);
  }

  DownloadFile(FileName: string): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/ITIUpload" + "/" + FileName; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }
}
