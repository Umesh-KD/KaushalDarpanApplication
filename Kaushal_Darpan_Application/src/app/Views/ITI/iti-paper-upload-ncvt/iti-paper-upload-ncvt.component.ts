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
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from "../../../Common/SweetAlert2";

@Component({
  selector: 'app-iti-paper-upload-ncvt',
  standalone: false,
  templateUrl: './iti-paper-upload-ncvt.component.html',
  styleUrl: './iti-paper-upload-ncvt.component.css'
})
export class ItiPaperUploadNcvtComponent {
  examForm!: FormGroup;
  PaperUploadTypesList!: any[];
  InstituteMasterList!: any[];
  SemesterMasterList!: any[];
  StreamMasterList: any = [];
  lstAcedmicYear: any = [];
  CenterMasterList: any = [];
  showPassword: boolean = false;
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
  isAllSelected = false;   // new addded 18062025
  public PaperID: number = 0

  CenterListPaperWise: any[] = [];
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private menuService: MenuService,
    private apiService: ItiTradeService,
    private commonMasterService: CommonFunctionService,
    private PaperMasterService: PaperMasterService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private routers: Router,
    private Activeroute: ActivatedRoute,
    private documentDetailsService: DocumentDetailsService, private swal: SweetAlert2) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllPaperUploadData();

  }

  async ngOnInit() {
    if (this.sSOLoginDataModel.RoleID == 7) {
      this.displayedColumns.push('Password');
      this.displayedColumns.push('Download');
    }

    this.examForm = this.fb.group({
      PaperUploadID: [null],
      ExamID: ['1', Validators.required],
      ExamName: ['', Validators.required],
      StreamID: ['0'],
      SemesterID: ['', Validators.required],
      Password: ['', [Validators.required]],
      PaperID: ['0', Validators.required],

      FileName: [''],
      PaperDate: ['', Validators.required],
      //CenterCode: [''],   // new comment addded 18062025
      Active: [true],
      CenterCode: [[]]    // new addded 18062025
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





    this.menuService.GetAcedmicYearList()
      .then((AcedmicYear: any) => {
        AcedmicYear = JSON.parse(JSON.stringify(AcedmicYear));
        this.lstAcedmicYear = AcedmicYear['Data'];
        //this.loaderService.requestEnded();
      }, error => console.error(error));

    await this.commonMasterService.GetExamName(this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ExamList = data.Data;
    })


    this.onExamChange(this.examForm.get("ExamID")?.value);

    this.searchRequestPaper.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequestPaper.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequestPaper.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.commonMasterService.GetCenterMasterDDL(this.searchRequestPaper)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CenterMasterList = data['Data'];
      }, (error: any) => console.error(error));
    //this.PaperMasterService.GetAllPaperUploadData(this.searchRequestPaper)
    //  .then((data: any) => {
    //    data = JSON.parse(JSON.stringify(data));
    //    this.PaperMasterList = data['Data'];

    //  }, error => console.error(error));

    //this.filterForm.valueChanges.subscribe((values) => {
    //  this.applyFilter(values);
    //});
    debugger
    this.PaperID = Number(
      this.Activeroute.snapshot.queryParamMap.get('PaperUploadID') ?? 0
    );
    if (this.PaperID > 0) {
      this.getRecordByID(this.PaperID);
      this.examForm.get('Password')?.disable()
    }

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

  async onExamChange(event: any) {
    debugger;
    const selectedExam = this.ExamList.find((exam: { ID: any; }) => exam.ID == event);
    if (selectedExam) {
      this.examForm.get('ExamName')?.setValue(selectedExam.Name);
    }
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

  async GetTradeWisePapers(StreamID: number) {

    if (StreamID == 0) {
      this.examForm.get('PaperID')?.reset('0');
    }

    const formData = this.examForm.value as PaperUpload;
    let obj =
    {
      Action: "_getPapersList",
      EndTermID: this.sSOLoginDataModel.EndTermID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      SemesterID: formData.SemesterID,
      TradeID: StreamID,

    };
    try {
      await this.apiService.GetTradeWisePapers(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.PaperMasterList = data.Data;
        console.log("Ravi Data", this.PaperMasterList)

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
      this.examForm.get('Password')?.enable();
      const formData = this.examForm.value as PaperUpload;
      debugger;
      const Pcode = this.PaperMasterList
        .find(f => f.PaperID == formData.PaperID)
        ?.SubjectCode;

      let obj =
      {
        PaperUploadID: formData.PaperUploadID,
        ExamID: formData.ExamID,
        ExamName: formData.ExamName,
        StreamID: formData.StreamID,
        SemesterID: formData.SemesterID,
        Password: formData.Password,
        PaperID: formData.PaperID,
        FinancialYearID: sSOLoginDataModel.FinancialYearID,
        PaperDate: formData.PaperDate,
        FileName: this.documentDetails[0].FileName,
        Dis_FileName: this.documentDetails[0].Dis_FileName,
        CenterCode: formData.CenterCode.toString(),
        Active: formData.Active,
        CreatedBy: sSOLoginDataModel.UserID,
        ModifyBy: sSOLoginDataModel.UserID,
        EndTermID: sSOLoginDataModel.EndTermID,
        IPAddress: sSOLoginDataModel.IpPhone,
        CourseType: sSOLoginDataModel.Eng_NonEng,
        ModifyDate: new Date(),
        PaperCode: Pcode
      };
      try {
        await this.apiService.SavePaperUploadData(obj).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.Data == 1 || data.Data == 2) {
            this.toastr.success(data.Message);
            //this.GetAllPaperUploadData();
            this.routers.navigate(['/ITIPaperUploaded-List'])
            this.documentDetails = [];

            setTimeout(() => {
              this.GoToITIPaperUploadedListPage();
            }, 2100);
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

      const passwordControl = this.examForm.get('Password');

      // mark as touched so validation messages appear
      passwordControl?.markAsTouched();

      // ❌ If password has ANY validation error → stop here
      if (passwordControl?.invalid) {
        this.toastr.warning("Please Enter Correct Password First")
        return;
      }

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

              this.examForm.get('Password')?.disable()
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
              this.documentDetails = []
              this.examForm.get('Password')?.enable()
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

  GoToITIPaperUploadedListPage() {
    this.routers.navigate(['/ITIPaperUploaded-List']);
    //sessionStorage.setItem('PaperSetterAssignEditId', '0');
  }

  onSelectionChange(event: any) {
    const selected = event.value;
    const allIDs = this.CenterMasterList.map((item: { ID: any; }) => item.ID);

    if (selected.includes('ALL')) {
      if (this.isAllSelected) {
        // Unselect all
        this.examForm.get('CenterCode')?.setValue([]);
        this.isAllSelected = false;
      } else {
        // Select all
        this.examForm.get('CenterCode')?.setValue(allIDs);
        this.isAllSelected = true;
      }
    } else {
      this.isAllSelected = selected.length === allIDs.length;
    }
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  getSteram(event: any): void {
    this.examForm.get('StreamID')?.setValue(0);
    this.examForm.get('PaperID')?.setValue(0);

    if (event > 0) {
      this.getTradeList(event);
    }
    else {
      this.StreamMasterList = [];
    }
  }


  getTradeList(semesterid: number) {

    this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, 0, 0, semesterid)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterList = data['Data'];
      }, (error: any) => console.error(error));

  }



  seletDeselectCenters(event: any) {

    debugger;
    this.isAllSelected = false;
    const selected = event;
    const allIDs = this.CenterMasterList.map((item: { ID: any; }) => item.ID);
    if (selected == "0") {
      if (this.isAllSelected) {
        // Unselect all
        this.examForm.get('CenterCode')?.setValue([]);
        this.isAllSelected = false;
      }
      else {
        // Select all
        this.examForm.get('CenterCode')?.setValue(allIDs);
        this.isAllSelected = true;
      }
    } else {
      this.examForm.get('CenterCode')?.setValue([]);
      this.isAllSelected = false;
    }
  }


  async GetCenterDatapaperWise(PaperID: number) {
    const formData = this.examForm.value as PaperUpload;
    debugger;

    if (formData.StreamID == 0) {
      return;
    }
    if (PaperID > 0) {

      let obj =
      {
        Action: "_getCenterIdPaperWise",
        EndTermID: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        SemesterID: formData.SemesterID,
        PaperID: PaperID
      };
      try {
        await this.apiService.GetTradeWisePapers(obj).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CenterListPaperWise = data.Data;
          this.selectCenterAcordigntoPapers();

        });
      } catch (error) {
        console.error(error);
      }
    }
    else {
      this.examForm.get('CenterCode')?.setValue([]);
    }
  }

  selectCenterAcordigntoPapers() {

    debugger;
    const allIDs = this.CenterListPaperWise.map((item: { CenterID: any; }) => item.CenterID);
    if (allIDs.length > 0) {
      this.examForm.get('CenterCode')?.setValue(allIDs);

    } else {
      this.examForm.get('CenterCode')?.setValue([]);

    }

  }

  getSelectedCenterNames() {

    const selectedIds = this.examForm.get('CenterCode')?.value || [];
    console.log()

    navigator.clipboard.writeText(this.CenterMasterList
      .filter((x: any) => selectedIds.includes(x.ID))
      .map((x: any) => x.Code)
      .join(',')).then(() => {
        // optional success message
        this.swal.Success('Copied!<br/> Selected centers copied to clipboard',);
      });
  }

  async getRecordByID(PaperUploadID: number) {


    let obj =
    {
      Action: "_getRecordBYID",
      PaperUploadID: PaperUploadID
    };
    try {
      await this.apiService.GetTradeWisePapers(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.fillEditData(data.Data[0]);
        debugger
        if (!this.documentDetails || this.documentDetails.length === 0) {
          this.documentDetails = [{} as DocumentDetailsModel];
        }

        this.documentDetails[0].FileName = data?.Data?.[0]?.FileName ?? '';

        console.log(this.documentDetails[0].FileName)
      });
    } catch (error) {
      console.error(error);
    }
  }

  async fillEditData(editData: any) {


    this.examForm.patchValue({
      SemesterID: editData.SemesterID
    });
    this.getSteram(editData.SemesterID);

    this.examForm.patchValue({
      StreamID: editData.StreamID,
    });

    await this.GetTradeWisePapers(editData.StreamID);
    await this.seletDeselectCenters(editData.StreamID)


    this.examForm.patchValue({
      PaperID: editData.PaperID
    });

    this.GetCenterDatapaperWise(editData.PaperID)

    this.examForm.patchValue({
      PaperUploadID: editData.PaperUploadID,
      ExamID: editData.ExamID,
      ExamName: editData.ExamName,
      SemesterID: editData.SemesterID,
      Password: editData.Password,
      //FileName: editData.FileName,
      PaperDate: editData.PaperDate,
      Active: editData.Active,
      CenterCode: this.convertCenterCode(editData.CenterCode),
      // IMPORTANT for mat-select multiple

    });
  }

  convertCenterCode(value: any): number[] {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    }

    return value
      .split(',')
      .map((x: string) => Number(x.trim()))
      .filter((x: number) => !isNaN(x));
  }


}
