import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ITITimeTableService } from '../../../../Services/ITI/ITITimeTable/ititime-table.service';
import { StreamMasterService } from '../../../../Services/BranchesMaster/branches-master.service';
import { EnumDepartment, EnumEnrollNoStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ITITimeTableDataModels, TimeTableInvigilatorModel, ITITimeTableSearchModel } from '../../../../Models/ITI/ITITimeTableModels';
import { InvigilatorSSOIDList } from '../../../../Models/InvigilatorAppointmentDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { DDL_InvigilatorSSOID_DataModel } from '../../../../Models/CommonMasterDataModel';
import { ReportBasedModel } from '../../../../Models/ReportBasedDataModel';
import { ReportService } from '../../../../Services/Report/report.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { HttpClient } from '@angular/common/http';
import { CenterAllocationService } from '../../../../Services/Center_Allocation/center-allocation.service';
import { ITICenterAllocationService } from '../../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
@Component({
  selector: 'app-ititime-table',
  standalone: false,
  
  templateUrl: './ititime-table.component.html',
  styleUrl: './ititime-table.component.css'
})
export class ITITimeTableComponent {
  public State: number = -1;
  public Message: any = [];
  showDownloadOptions = false;
  public tablerequest = new ReportBasedModel();
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Status: number = 0
  public PublishFileName:string=''
  public ITITimeTableList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public TimeTablePdf: string = ''
  public Dis_TimeTablePdf: string = ''
  public IsYearly: number = 0
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  searchbySemester: string = '';
  searchbyExamShift: string = '';
  searchbySubject: string = ''
  public Table_SearchText: string = '';
  public SearchTimeTableList: any = []
  serchrequest = new InvigilatorSSOIDList();
  public StreamMasterList: any = [];
  public ExamShiftList: any = [];
  public PaperList: any = [];
  public SubjectList: any = [];
  public SemesterList: any = [];
  public searchRequest = new ITITimeTableSearchModel();
  public request = new ITITimeTableDataModels();
  public TimeTableTradeSubList: any = []
  public InvigilatorDDL: InvigilatorSSOIDList[] = []
  public InvigilatorFormGroup!: FormGroup;
  public TimeTableID: number = 0
  sSOLoginDataModel = new SSOLoginDataModel();
  public InvigilatorID: number = 0
  public requestInv = new TimeTableInvigilatorModel()
  public TimeTableInvigilatorData: any = [];
  public requestInvigilatorSSOID = new DDL_InvigilatorSSOID_DataModel()
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  constructor(
    private streamService: StreamMasterService,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private ITITimeTableService: ITITimeTableService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private centerAllocationService: ITICenterAllocationService
  ) { }

  async ngOnInit() {
    this.InvigilatorFormGroup = this.formBuilder.group({
      InvigilatorID: ['', [DropdownValidators]],
    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("sSOLoginDataModel", this.sSOLoginDataModel)
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetITITimeTableList();
    await this.GetStreamMasterList()
    await this.GetExamShift()
    await this.GetSubjectList()
    await this.GetSemesterList()
    await this.getMasterData()
  }

  

  get _InvigilatorFormGroup() { return this.InvigilatorFormGroup.controls; }

  async ViewandUpdate(content: any, id: number) {
    this.TimeTableID = id
    await this.GetTimeTableByID(id)
    if (this.sSOLoginDataModel.RoleID == 7) {
      await this.GetInvigilatorByID(id)
    }
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
  }

  async GetStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.streamService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetExamShift() {
    try {
      this.loaderService.requestStarted();
      var DepartmentID = EnumDepartment.ITI
      await this.commonMasterService.GetExamShift(DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamShiftList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetSemesterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ITI_SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async GetSubjectList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ResetControl() {
    this.request = new ITITimeTableDataModels()
    this.searchRequest = new ITITimeTableSearchModel()
    this.GetITITimeTableList();
  }
  async GetITITimeTableList() {
    
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
   

    try {
      if (this.sSOLoginDataModel.RoleID == 7) {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      }
      this.loaderService.requestStarted();
      await this.ITITimeTableService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ITITimeTableList = data['Data'];
          this.SearchTimeTableList = [...data['Data']];
          this.Status=data['Data'][0]['Status']
          this.PublishFileName = data['Data'][0]['FileName']
          this.tablerequest.SemesterID = this.searchRequest.SemesterID
          console.log("TimeTableList", this.ITITimeTableList)
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async btnDelete_OnClick(InstitudeID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();

            await this.ITITimeTableService.DeleteDataByID(InstitudeID, this.UserID, this.sSOLoginDataModel.DepartmentID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  this.GetITITimeTableList()
                }
                else {
                  this.toastr.error(this.ErrorMessage)
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
      });
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    this.requestInv = new TimeTableInvigilatorModel()
  }

  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onEdit(id: number): void {
    this.Router.navigate(['/updatetimetable', id]);
    console.log(id)
  }

  async GetTimeTableByID(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.ITITimeTableService.GetTimeTableByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TimeTableTradeSubList = data.Data

          console.log("TimeTableTradeSubList", this.TimeTableTradeSubList)

        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetInvigilatorByID(id: number) {
    try {
      const InstituteID = this.sSOLoginDataModel.InstituteID
      this.loaderService.requestStarted();
      await this.ITITimeTableService.GetInvigilatorByID(id, InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TimeTableInvigilatorData = data.Data
          console.log("TimeTableInvigilatorData", this.TimeTableInvigilatorData)
          if (this.TimeTableInvigilatorData != null) {
            this.requestInv.CreatedBy = this.sSOLoginDataModel.UserID;
            this.requestInv.InvigilatorID = this.TimeTableInvigilatorData.InvigilatorID
          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getMasterData() {
    try {
      this.requestInvigilatorSSOID.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.loaderService.requestStarted();
      await this.commonMasterService.Get_InvigilatorSSOID(this.requestInvigilatorSSOID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InvigilatorDDL = data.Data;
        console.log("CourseMasterDDL", this.InvigilatorDDL);
      })

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async SaveInvigilator() {
    this.isSubmitted = true;
    if (this.InvigilatorFormGroup.invalid) {
      this.toastr.error("Please select Invigilator")
      return;
    }
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      this.requestInv.TimeTableID = this.TimeTableID
      this.requestInv.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestInv.ModifyBy = this.sSOLoginDataModel.UserID;
      this.requestInv.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.requestInv.SemesterID = this.TimeTableTradeSubList[0].SemesterID;

      console.log("request at SaveInvigilator", this.requestInv)
      await this.ITITimeTableService.SaveInvigilator(this.requestInv)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.ResetControl();
            this.CloseModalPopup();
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }



  toggleDownloadOptions() {
    this.showDownloadOptions = !this.showDownloadOptions;
  }


  async DownloadTimeTable1() {
    try {

      //if (this.Status == 14) {
      //  this.DownloadFile(this.PublishFileName, 'file download')
      //  return
      //}

      this.loaderService.requestStarted();

      this.tablerequest.Action = '_GetSemester'
      //this.tablerequest.SemesterID = this.searchRequest.SemesterID;
      this.tablerequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.tablerequest.ExamType = this.searchRequest.SemesterID;
      this.tablerequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.tablerequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
/*      this.tablerequest.FileType = fileType; // 👈 Add file type to request*/

      await this.reportService.ItiDownloadTimeTable(this.tablerequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          
          if (data.State == EnumStatus.Success) {
            /*         const fileName = `timetable.${fileType === 'pdf' ? 'pdf' : 'docx'}`;*/
   
            this.DownloadFile(data.Data, 'pdf');
            this.GetITITimeTableList()
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async DownloadTimeTable() {

    this.Swal2.Confirmation("Please ensure that the timetable has been added and the order generated correctly. You cannot revert this process once it is finally published!",
      async (result: any) => {
        if (result.isConfirmed) {
          this.openOTP()

        }
      })

  }



  DownloadFile(FileName: string, DownloadfileName: string): void {

    
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ITIReportsFolder}/TimeTable/${FileName}`;



    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);

    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    const d = 'TimeTableYearly';
    const ctype = this.sSOLoginDataModel.Eng_NonEng == 1 ? 'SCVT' : 'SCVT'
    return `${d}${ctype}.${extension}`;
  }

  async PublishOrder(Action: number) {
    try {


      let obj = {
        PDFType: 3,

        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        CreatedBy: this.sSOLoginDataModel.UserID,
        ModifyBy: this.sSOLoginDataModel.UserID,
        SemesterID: this.tablerequest.SemesterID,
        Status: 14
      }

      this.loaderService.requestStarted();
      //call
      await this.centerAllocationService.SaveWorkflow(obj).then(
        (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            /*     this.DownloadPublishTimeTable();*/
            this.toastr.success(this.Message)

            /*    this.CloseOTPModal()*/
            this.GetITITimeTableList()



            this.CloseModalPopup()

          } else {
            this.toastr.error(data.ErrorMessage)
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  openOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      //this.PublishTimeTable();
      this.PublishOrder(EnumEnrollNoStatus.Published);
    })
  }



  ShowPublishButton(): boolean {

    if (this.ITITimeTableList?.length > 0 ) {


      if (this.sSOLoginDataModel.RoleID == EnumRole.ITIAdmin_SCVT && this.Status == 0 || this.sSOLoginDataModel.RoleID == EnumRole.ITIAdmin_SCVT && this.Status == 11 ) {
        return true;
      }
      else {
        return false;

      }
    }
    else {
      return false;
    }
    return false;
  }



  ShowPublishpublisButton(): boolean {

    if (this.ITITimeTableList?.length > 0 ) {


      if (this.sSOLoginDataModel.RoleID == EnumRole.ITIAdmin_SCVT &&  this.Status == 11) {
        return true;
      }
      else {
        return false;

      }
    }
    else {
      return false;
    }
    return false;
  }

  async DownloadPDF1() {

    this.Swal2.Confirmation("Are you sure you want to Time Table Order List ?,You cannot Revert Process Once you final Publish it!",
      async (result: any) => {
        if (result.isConfirmed) {
          this.openOTP()

        }
      })

  }
}
