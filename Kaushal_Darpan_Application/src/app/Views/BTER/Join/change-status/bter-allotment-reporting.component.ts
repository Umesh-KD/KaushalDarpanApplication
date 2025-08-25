import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AllotmentDocumentModel } from '../../../../Models/ITI/AllotmentreportDataModel';
import { BterAllotmentDocumentListModel, BterAllotmentDocumentModel, BterAllotmentReportingModel } from '../../../../Models/BterAllotmentReportingDataModel';
import { BterStudentsJoinStatusMarksSearchModel } from '../../../../Models/BterStudentJoinStatusDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { SearchSlidingModel } from '../../../../Models/InternalSlidingDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsJoiningStatusMarksService } from '../../../../Services/Students-Joining-Status-Marks/students-joining-status-marks.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { InternalSlidingService } from '../../../../Services/ITIInternalSliding/internal-sliding.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'
import { BterStudentsJoinStatusMarksService } from '../../../../Services/BterStudentJoinStatus/Student-join-status-mark.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ReportService } from '../../../../Services/Report/report.service';
import { BterSearchmodel } from '../../../../Models/ApplicationFormDataModel';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DeleteDocumentDetailsModel } from '../../../../Models/DeleteDocumentDetailsModel';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { UploadBTERFileModel } from '../../../../Models/UploadFileModel';
import { DocumentDetailsModel } from '../../../../Models/DocumentDetailsModel';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';
@Component({
  selector: 'app-bter-allotment-reporting',
  standalone: false,
  
  templateUrl: './bter-allotment-reporting.component.html',
  styleUrl: './bter-allotment-reporting.component.css'
})
export class BterAllotmentReportingComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  public filteredDocumentDetails: BterAllotmentDocumentModel[] = []
  request = new BterAllotmentReportingModel()
  public searchRequest = new BterStudentsJoinStatusMarksSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  /*  public AllotmentId: number | null = null;*/
  public downloadrequest = new BterSearchmodel()
  sSOLoginDataModel = new SSOLoginDataModel();
  public AllotmentDocument: any[] = [];
  public StudentsJoiningStatusMarksDetails: any[] = [];
  public slidingrequest = new SearchSlidingModel()
  public TradeList: any[] = [];
  public OriginalDocumentList: any[] = [];
  public InternalSlidingUnitList: any[] = [];
  public IsStatusMark: boolean = false;
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public AllotmentId: number = 0
  public Isremarkshow: boolean = false
  public remarkheader: boolean = true
  public remarkvalidate:boolean=false
  public documentDetails: DocumentDetailsModel[] = []
  public DateConfigSetting: any = [];
  public deleteRequest = new DocumentDetailsModel()
  public ReportingStatus: any = [{ Name: "Admitted", Id: 12 }, { Name: "Not Reported", Id: 5 }, { Name: "Reject", Id: 7 },  { Name: "withdraw", Id: 9 }, { Name: "Cancel", Id: 3 }]

  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  public isSupp: boolean = false
  imageSrc: string | null = null;
  isError: boolean = false;

  AllotmentKey: string = "";
  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private sanitizer: DomSanitizer,
    private StudentsJoiningStatusMarksService: BterStudentsJoinStatusMarksService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private ApplicationService: BterApplicationForm,
    private modalService: NgbModal,
    public appsettingConfig: AppsettingService,
    private internalSlidingService: InternalSlidingService,
    private reportService: ReportService,
    private http: HttpClient,
    private documentDetailsService: DocumentDetailsService,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit() {
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.EndTermId = this.sSOLoginDataModel.EndTermID;
    this.AllotmentId = Number(this.routers.snapshot.queryParamMap.get('AllotmentID') ?? 0)
    this.searchRequest.ReportingStatus = '';
    if (this.AllotmentId > 0) {
      this.searchRequest.AllotmentId = this.AllotmentId;

      this.GetById()
      /*      this.GetDDLInternalSlidingUnitList()*/
    }

  }

  async GetDateConfig() {
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.searchRequest.CourseTypeId,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermId: this.sSOLoginDataModel.EndTermID,
      Key: "FIRST ALLOTMENT REPORTING,FIRST UPWARD REPORTING,SECIND ALLOTMENT REPORTING,FIRST UPWARD REPORTING,INTERNAL SLIDING",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];
        
        if (this.DateConfigSetting[0][this.AllotmentKey] != 1) {
          this.ErrorMessage = "Date for reporting is closed.";
          if (this.searchRequest.CourseTypeId == 1) {
            this.router.navigate(['/btermeritENG/1']);
          } else if (this.searchRequest.CourseTypeId == 2) {
            this.router.navigate(['/btermeritNonENG/2']);
          } else if (this.searchRequest.CourseTypeId == 3) {
            this.router.navigate(['/StudentJoinStatusLateral/3']);
          }
        }       

      }, (error: any) => console.error(error)
      );
  }

  AllotmentChange() {
    debugger;
    if (this.request.AllotmentMasterId == 2) {
      this.AllotmentKey = "FIRST ALLOTMENT REPORTING";
    } else if (this.request.AllotmentMasterId == 3) {
      this.AllotmentKey = "FIRST UPWARD REPORTING";
    } else if (this.request.AllotmentMasterId == 4) {
      this.AllotmentKey = "SECOND ALLOTMENT REPORTING";
    } else if (this.request.AllotmentMasterId == 6) {
      this.AllotmentKey = "INTERNAL SLIDING";
    } else {

    }
  }

  async GetById() {
    // const DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.StudentsJoiningStatusMarksService.GetAllotmentdata(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("What I got from DB", data.Data)
          if (data['Data'] != null) {
            this.request = data['Data']
            this.searchRequest.CourseTypeId = this.request.StreamTypeID;
            if (this.request.ReportingStatus != null) {
              this.searchRequest.ReportingStatus = this.request.ReportingStatus;
            } else {
              this.searchRequest.ReportingStatus = '';
            }

            this.AllotmentChange();
            //this.GetDateConfig();
            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0');
            const day = String(dob.getDate()).padStart(2, '0');
            this.request.DOB = `${year}-${month}-${day}`;

            debugger

            if (this.request?.AllotmentDocumentModel) {
              let listModel: BterAllotmentDocumentListModel = {
                DocumentMasterID: [] // Assuming DocumentDetailsID is an array
              };
              this.filteredDocumentDetails = this.request.AllotmentDocumentModel.filter((x) => x.GroupNo === 1);
              this.request.AllotmentDocumentModel.forEach((dOC: any) => {
                dOC.ShowRemark = dOC.DocumentStatus == false;
                listModel.DocumentMasterID.push(dOC.DocumentMasterID);
              });
              this.commonMasterService.GetBTEROriginalDocument(listModel)
                .then((data: any) => {
                  data = JSON.parse(JSON.stringify(data));
                  if (data.State == EnumStatus.Success) {
                    debugger
                    this.request.AllotmentDocumentModel[0].OriginalDocumentModel = data.Data
                  } else {
                    /*     this.toastr.error(data.ErrorMessage || 'Error fetching data.');*/
                  }
                }, (error: any) => console.error(error));
              // Recalculate Isremarkshow
              this.Isremarkshow = this.request.AllotmentDocumentModel.some((x: any) => x.DocumentStatus == false);
            } else {

              this.filteredDocumentDetails = [];
            }
          }

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

         

        }, error => console.error(error));

    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async openPdfModal(url: string): Promise<void> {
    debugger
    const el = document.getElementById('app-menu');
    if (el) {
      el.classList.add('DocShowers'); // or any class you want
    }


    const ext = url.split('.').pop()?.toLowerCase();
    this.isPdf = ext === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');

    this.safePdfUrl = null;
    this.imageSrc = '';
    this.pdfUrl = url;
    this.isError = false;

    try {
      const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.imageSrc = blobUrl;
      } else {
        throw new Error('Blob is undefined');
      }
    } catch (error) {
      console.error('File load failed, using dummy image.', error);
      this.isPdf = false;
      this.isImage = true;
      this.safePdfUrl = null;
      this.imageSrc = 'assets/images/dummyImg.jpg';
      this.isError = true;
    }

    this.showPdfModal = true;
  }

  async DownloadApplicationForm() {
    try {
      this.loaderService.requestStarted();
      this.downloadrequest.DepartmentID = EnumDepartment.BTER;
      this.downloadrequest.ApplicationID = this.request.ApplicationID
 
      await this.reportService.GetApplicationFormPreview1(this.downloadrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
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

  async OnRemarkChange(dOC: any, index: number) {

    if (index == 0) {
      dOC.ShowRemark = true;
      dOC.DocumentStatus = false

    } else {
      dOC.ShowRemark = false;
      dOC.DocumentStatus = true
      dOC.Remark = '';
    }
    //
    //console.log(this.request.AllotmentDocumentModel)
    this.Isremarkshow = this.request.AllotmentDocumentModel.some((x: any) => x.DocumentStatus === false);

    this.remarkheader = this.Isremarkshow;
  }

  async SaveData() {

    this.isSubmitted = true
    this.remarkvalidate = true
    
    //console.log(this.request.AllotmentDocumentModel)
    //if (this.request.AllotmentDocumentModel == null) {
    //  this.request.AllotmentDocumentModel = [];
    //}
    //const IsRemarKvalid = this.request.AllotmentDocumentModel.some((x: any) => x.DocumentStatus === false && x.Remark == null);
    //if (IsRemarKvalid == true) {
    //        /*this.toastr.error("Please enter valisd Remark")*/
    //  return
    //}

    this.request.CreatedBy = this.sSOLoginDataModel.UserID
    this.request.ModifyBy = this.sSOLoginDataModel.UserID

    //if (this.request.ShiftUnitID == 0) {
    //  this.toastr.error("Please select shift unit")
    //  return
    //}

    this.Isremarkshow = this.request.AllotmentDocumentModel.some((x) => x.DocumentStatus == false);
    this.request.JoiningStatus = this.searchRequest.ReportingStatus

    //if (this.Isremarkshow) {
    //  this.request.JoiningStatus = 'R'
    //} else {
    //  this.request.JoiningStatus = 'J'
    //}


    try {
      await this.StudentsJoiningStatusMarksService.SaveInstituteReporting(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
          } else {
            /*     this.toastr.error(data.ErrorMessage || 'Error fetching data.');*/
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }

  getDocumentsByMasterID(masterID: number) {
    return this.OriginalDocumentList.filter(doc => doc.DocumentMasterID === masterID && doc.ActiveStatus && !doc.DeleteStatus);
  }

  //document
  async UploadDocument(event: any, item: any) {
    debugger
    try {
      //upload model
      let uploadModel: UploadBTERFileModel = {
        ApplicationID: this.request.ApplicationID.toString() ?? "0",
        DocumentMasterID: item.DocumentMasterID.toString() ?? "0",
        AcademicYear: this.sSOLoginDataModel.FinancialYearID.toString() ?? "0",
        DepartmentID: this.sSOLoginDataModel.DepartmentID.toString() ?? "0",
        EndTermID: this.sSOLoginDataModel.EndTermID.toString() ?? "0",
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng.toString() ?? "0",
        FileName: item.ColumnName+"_Org",
        FileExtention: item.FileExtention ?? "",
        MinFileSize: item.MinFileSize ?? "",
        MaxFileSize: item.MaxFileSize ?? "",
        FolderName: item.FolderName ?? ""
      }

      //call
      await this.documentDetailsService.UploadBTEROriginalDocument(event, uploadModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            debugger
            //add/update document in js list
            const index = this.documentDetails.findIndex((x: any) => x.DocumentMasterID === item.DocumentMasterID);

            if (index !== -1) {
              // Update if found
              this.documentDetails[index].FileName = data.Data[0].FileName;
              this.documentDetails[index].Dis_FileName = data.Data[0].Dis_FileName;
            } else {
              // Find the source document from AllotmentDocumentModel to get base data
              const sourceDoc = this.request.AllotmentDocumentModel.find((x: any) => x.DocumentMasterID === item.DocumentMasterID);

              if (sourceDoc) {
                // Push new document details if not found
                this.documentDetails.push({
                    ...sourceDoc, // spread existing properties
                    FileName: data.Data[0].FileName,
                    Dis_FileName: data.Data[0].Dis_FileName,
                    TransactionID: 0,
                    DisplayColumnNameEn: '',
                    DisplayColumnNameHi: '',
                    ModifyBy: 0,
                    IsMandatory: false,
                    FileExtention: '',
                    MinFileSize: '',
                    MaxFileSize: '',
                    SortOrder: 0,
                    CommonRemark: '',
                    OldFilePath: '',
                    validationError: ''
                });
              }
            }
            //reset file type
            event.target.value = null;
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async DeleteDocument(item: any) {

    try {
      // delete from server folder
      debugger
      let deleteModel = new DeleteDocumentDetailsModel()

      deleteModel.FolderName = item.FolderName ?? "";
      deleteModel.FileName = item.FileName;
      //call
      await this.documentDetailsService.DeleteBTERDocument(deleteModel)
        .then(async (data: any) => {
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.documentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.documentDetails[index].FileName = '';
              this.documentDetails[index].Dis_FileName = '';
            }

            await this.DeleteApplicationDocument_FromTable(item);
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

  async DeleteApplicationDocument_FromTable(item: any) {

    try {
      this.deleteRequest.TransactionID = item.TransactionID;
      this.deleteRequest.DocumentDetailsID = item.DocumentDetailsID;
      this.deleteRequest.ModifyBy = this.sSOLoginDataModel.UserID;

      this.loaderService.requestStarted();
      await this.ApplicationService.DeleteDocumentById(this.deleteRequest)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
          }
          // else {
          //   this.toastr.error(data.ErrorMessage)
          // }
        });
    }
    catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

}
