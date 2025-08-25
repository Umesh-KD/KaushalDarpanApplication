import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TimeTableService } from '../../../Services/TimeTable/time-table.service';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { EnumEnrollNoStatus, enumExamStudentStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { TimeTableDataModels, TimeTableInvigilatorModel, TimeTableSearchModel } from '../../../Models/TimeTableModels';
import { InvigilatorSSOIDList } from '../../../Models/InvigilatorAppointmentDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { DDL_InvigilatorSSOID_DataModel } from '../../../Models/CommonMasterDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { ReportBasedModel } from '../../../Models/ReportBasedDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { publish } from 'rxjs';

@Component({
    selector: 'app-time-table',
    templateUrl: './time-table.component.html',
    styleUrls: ['./time-table.component.css'],
    standalone: false
})
export class TimeTableComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];
  public _EnumRole = EnumRole;
  public ErrorMessage: any = [];
  public Status: number = 0
  public TimeTablePdf: string = ''
  public Dis_TimeTablePdf: string = ''
  public IsYearly:number=0
  _enumRole = EnumRole
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public AllSelect: boolean=false
  public TimeTableList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  ddlRollListStatus:number=0
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  showDownloadOptions = false;
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
  public TimeTableDataExcel: any = [];
  public searchRequest = new TimeTableSearchModel();
  public _RollListStatus = EnumEnrollNoStatus;
  
  public request = new TimeTableDataModels();
  public tablerequest = new ReportBasedModel();
  public TimeTableBranchSubList: any = []
  public InvigilatorDDL: InvigilatorSSOIDList[] = []
  public InvigilatorFormGroup!: FormGroup;
  public TimeTableID: number = 0
  sSOLoginDataModel = new SSOLoginDataModel();
  public InvigilatorID: number = 0
  public requestInv = new TimeTableInvigilatorModel()
  public TimeTableInvigilatorData: any = []
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  public requestInvigilatorSSOID = new DDL_InvigilatorSSOID_DataModel()
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public PublishFileName:string=''
  constructor(
    private streamService: StreamMasterService, 
    private commonMasterService: CommonFunctionService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private Router: Router,
    private reportService: ReportService, 
    private TimeTableService: TimeTableService, 
    private toastr: ToastrService,
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder,
    private modalService: NgbModal, 
    private Swal2: SweetAlert2
  ) {}

  async ngOnInit() {
    this.InvigilatorFormGroup = this.formBuilder.group({
/*      InvigilatorID: ['', [DropdownValidators]],*/
    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("sSOLoginDataModel", this.sSOLoginDataModel)
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;
/*    await this.GetTimeTableList();*/
    await this.GetStreamMasterList()
    await this.GetExamShift()
    await this.GetSubjectList()
    await this.GetSemesterList()
    await this.getMasterData()
    await this.GetDateConfig();
  }
  get _InvigilatorFormGroup() { return this.InvigilatorFormGroup.controls; }

  async ViewandUpdate(content: any, id: number)
  {
    this.TimeTableID = id
    await this.GetTimeTableByID(id)
    if(this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon){
      await this.GetInvigilatorByID(id)
    }
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });


  }

  toggleDownloadOptions() {
    this.showDownloadOptions = !this.showDownloadOptions;
  }

  async GetStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.streamService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
          console.log('Stream Master List ===>', this.StreamMasterList)
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
      await this.commonMasterService.GetExamShift()
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
      await this.commonMasterService.SemesterMaster(1)
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
    this.request = new TimeTableDataModels()
    this.searchRequest = new TimeTableSearchModel()
   
  }

  async GetTimeTableList() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;

    if (this.searchRequest.SemesterID == 0) {
      this.toastr.warning("Please Select Semester/Year")
      return
    }

    if (this.searchRequest.SemesterID == 0 && this.searchRequest.Status > 0)
    {
      this.toastr.warning("Plese select Year/Semester ")
      this.searchRequest.Status = 0;
      return;
    }


    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      this.searchRequest.Status=14
    }
    try {
      
      this.loaderService.requestStarted();
      await this.TimeTableService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TimeTableList = data['Data'];
          this.SearchTimeTableList = [...data['Data']];
          this.Status = this.searchRequest.Status
          this.PublishFileName = data['Data'][0]['PublishFileName']
          console.log("Time Table List==>",this.TimeTableList)
          console.log("Time status List==>", this.Status)
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

            await this.TimeTableService.DeleteDataByID(InstitudeID, this.UserID, this.sSOLoginDataModel.DepartmentID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  this.GetTimeTableList()
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
      await this.TimeTableService.GetTimeTableByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TimeTableBranchSubList = data.Data
          
          console.log("TimeTableBranchSubList", this.TimeTableBranchSubList)

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
      await this.TimeTableService.GetInvigilatorByID(id, InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TimeTableInvigilatorData = data.Data
          console.log("TimeTableInvigilatorData", this.TimeTableInvigilatorData)
          if(this.TimeTableInvigilatorData != null) {
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
      this.requestInvigilatorSSOID.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
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
    if(this.InvigilatorFormGroup.invalid) {
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
      this.requestInv.SemesterID = this.TimeTableBranchSubList[0].SemesterID;

      console.log("request at SaveInvigilator", this.requestInv)
      await this.TimeTableService.SaveInvigilator(this.requestInv)
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

  async GetDateConfig() {
    
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "TimeTable"
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.TimeTable;
      }, (error: any) => console.error(error)
      );
  }

  openOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      //this.PublishTimeTable();
      this.PublishTimeTable1(EnumEnrollNoStatus.Published);
    })
  }

  async DownloadPublishTimeTable() {
    try {

      this.loaderService.requestStarted();
      if (this.searchRequest.SemesterID == 1) {
        this.tablerequest.Action = '_GetSemester'
      }
      else {
        this.tablerequest.Action = '_GetYearly'
      }
      this.tablerequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.tablerequest.ExamType = this.searchRequest.SemesterID

      await this.reportService.DownloadTimeTable(this.tablerequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
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
  //async DownloadTimeTable1() {
  //  try {
  //    this.loaderService.requestStarted();
  //    if (this.searchRequest.SemesterID == 1) {
  //      this.tablerequest.Action = '_GetSemester'
  //    }
  //    else
  //    {
  //      this.tablerequest.Action = '_GetYearly'
  //    }
  //    this.tablerequest.SemesterID = this.searchRequest.SemesterID
  //    this.tablerequest.EndTermID = this.sSOLoginDataModel.EndTermID
  //    this.tablerequest.ExamType = this.searchRequest.SemesterID;
  //    this.tablerequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      
  //    await this.reportService.DownloadTimeTable(this.tablerequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        console.log(data);
  //        if (data.State == EnumStatus.Success) {
  //          this.DownloadFile(data.Data, 'file download');
  //        }
  //        else {
  //          this.toastr.error(data.ErrorMessage)
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
  
  async DownloadTimeTable1(fileType: 'pdf' | 'word') {
    try {
      this.loaderService.requestStarted();

      this.tablerequest.Action = this.searchRequest.SemesterID == 1 ? '_GetSemester' : '_GetYearly';
      this.tablerequest.SemesterID = this.searchRequest.SemesterID;
      this.tablerequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.tablerequest.ExamType = this.searchRequest.SemesterID;
      this.tablerequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.tablerequest.FileType = fileType; // 👈 Add file type to request

      await this.reportService.DownloadTimeTable(this.tablerequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          
          if (data.State == EnumStatus.Success) {
            const fileName = `timetable.${fileType === 'pdf' ? 'pdf' : 'docx'}`;
            this.DownloadFile(data.Data, fileName);
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

    this.Swal2.Confirmation("Are you sure you want to Publish Time-Table ?,You cannot Revert Process Once you final Publish it!",
      async (result: any) => {
        if (result.isConfirmed) {
          this.openOTP()

        }
      })
   
  }

  // DownloadFile(FileName: string, DownloadfileName: any): void {
     
  //   const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
  //   // Fetch the file as a blob
  //   this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
  //     const downloadLink = document.createElement('a');
  //     const url = window.URL.createObjectURL(blob);
  //     downloadLink.href = url;
  //     downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
  //     downloadLink.click();
  //     // Clean up the object URL
  //     window.URL.revokeObjectURL(url);
  //   });
  // }

  DownloadFile(FileName: string, DownloadfileName: string): void {
  const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

  const fileExtension = FileName.split('.').pop() || 'pdf'; 

  this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
    const downloadLink = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;

    downloadLink.download = DownloadfileName ? `${DownloadfileName}.${fileExtension}` : FileName;

    downloadLink.click();
    window.URL.revokeObjectURL(url);
  });
 }
  generateFileName(extension: string): string
  {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    const d =this.searchRequest.SemesterID == 1 ? 'TimeTableSemesterReport' : 'TimeTableYearly'
    const ctype = this.sSOLoginDataModel.Eng_NonEng == 1 ? 'Engineering' : 'Non_Engineering'
    return `${d}${ctype}.${extension}`;
  }

  async PublishTimeTable1(Action: number) {
    try
    {
      const Selected = this.TimeTableList;
      if (this.searchRequest.SemesterID == 1) {
        this.IsYearly = 0
      } else {
        this.IsYearly=1
      }

      Selected.forEach((e: any) => {
        e.Status = Action, e.ModifyBy = this.sSOLoginDataModel.UserID, e.EndTermID = this.sSOLoginDataModel.EndTermID,
          e.RoleID = this.sSOLoginDataModel.RoleID, e.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng,
          e.ModuleID = this.sSOLoginDataModel.Eng_NonEng == 1 ? 5 : 6,
        e.TimeTablePdf = this.TimeTablePdf,
        e.IsYearly = this.IsYearly,
        e.UserID = this.sSOLoginDataModel.UserID
      })

      this.loaderService.requestStarted();
      //call
      await this.TimeTableService.SaveTimeTableWorkflow(Selected).then(
        (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
       /*     this.DownloadPublishTimeTable();*/
            this.toastr.success(this.Message)

            /*    this.CloseOTPModal()*/
            this.GetTimeTableList()

            this.TimeTableList.forEach((item: any) => item.Selected = false);
            this.AllSelect = false;

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



  async VerifyRollNumber(Action:number) {
    try
    {

      const isAnySelected = this.TimeTableList.some((x: any) => x.Selected)
      if (!isAnySelected) {
        this.toastr.error('Please select at least one Item!');
        return;
      }

      const Selected = this.TimeTableList.filter((x: any) => x.Selected == true)


      Selected.forEach((e: any) => {
        e.Status = Action, e.ModifyBy = this.sSOLoginDataModel.UserID, e.EndTermID = this.sSOLoginDataModel.EndTermID,
          e.RoleID = this.sSOLoginDataModel.RoleID, e.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng,
          e.ModuleID = this.sSOLoginDataModel.Eng_NonEng == 1 ? 5 : 6

      })

      this.loaderService.requestStarted();
      //call
      await this.TimeTableService.SaveTimeTableWorkflow(Selected).then(
        (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {

            this.toastr.success(this.Message)

            /*    this.CloseOTPModal()*/
            this.GetTimeTableList()

            this.TimeTableList.forEach((item: any) => item.Selected = false);
            this.AllSelect = false;

            this.ShowPublishButton();
            this.ShowPublishpublisButton()

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

 

  //showHideButton(row: any): boolean
  //{

  //  if ([row.status].includes(11, 15) && [this.sSOLoginDataModel.RoleID].includes(EnumRole.Admin, EnumRole.AdminNon, EnumRole.ExaminationIncharge)) {
  //    return true
  //  } else {
  //    return false;


  //  }
    
  //}
  showHideButton(row: any): boolean {
    const validStatuses = [11, 15];
    const validRoles = [EnumRole.ExaminationIncharge, EnumRole.ExaminationIncharge_NonEng];

    return validStatuses.includes(row.Status) && validRoles.includes(this.sSOLoginDataModel.RoleID);
  }


  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.TimeTableList) {
      item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
    }
  }


  ShowPublishButton(): boolean
  {

    if (this.TimeTableList?.length > 0) {

      const allVerify = this.TimeTableList.every((f: any) => f.Status == EnumEnrollNoStatus.Verified &&f.TimeTableStatus!=14)
      if (allVerify && this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge || allVerify && this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng) {
        return true;
      }
      else {
        return false;

      }
    }
    else
    {
      return false;
    }
    return false;
  }

  ShowPublishpublisButton(): boolean {
    
    console.log(this.TimeTableList,"asfdadfasd")
    if (this.TimeTableList?.length > 0) {

      const allVerify = this.TimeTableList.every((f: any) => f.Status == EnumEnrollNoStatus.Verified && f.TimeTableStatus == EnumEnrollNoStatus.Generated)
      if (allVerify && this.sSOLoginDataModel.RoleID == EnumRole.Admin || allVerify && this.sSOLoginDataModel.RoleID == EnumRole.AdminNon) {
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




  async PublishOnAction(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }



  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {

      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'application/pdf') {

          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}`
        }
        else {// type validation
          this.toastr.error('Select Only pdf file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "TimeTablePdf") {
                this.Dis_TimeTablePdf = data['Data'][0]["Dis_FileName"];
                this.TimeTablePdf = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
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
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }



}
