import { Component, ElementRef, ViewChild } from '@angular/core';
import { TimeTableDataModels, TimeTableInvigilatorModel, TimeTableSearchModel } from '../../Models/TimeTableModels';
import { InvigilatorSSOIDList } from '../../Models/InvigilatorAppointmentDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { StreamMasterService } from '../../Services/BranchesMaster/branches-master.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { Router } from '@angular/router';
import { TimeTableService } from '../../Services/TimeTable/time-table.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../Common/GlobalConstants';
import { SetExamAttendanceSearchModel } from '../../Models/SetExamAttendanceDataModel';
import { SetExamAttendanceService } from '../../Services/SetExamAttendance/set-exam-attendance.service';
import { DDL_InvigilatorSSOID_DataModel } from '../../Models/CommonMasterDataModel';

@Component({
  selector: 'app-exam-attendence-list',
  standalone: false,
  templateUrl: './exam-attendence-list.component.html',
  styleUrl: './exam-attendence-list.component.css'
})
export class ExamAttendenceListComponent {
  public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  public TimeTableList: any = [];
  public UserID: number = 0;
  searchText: string = '';
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
  public searchRequest = new SetExamAttendanceSearchModel();
  public requestInvigilatorSSOID = new DDL_InvigilatorSSOID_DataModel()
  public request = new TimeTableDataModels();
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

  constructor(
    private streamService: StreamMasterService,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private TimeTableService: SetExamAttendanceService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.InvigilatorFormGroup = this.formBuilder.group({
      InvigilatorID: ['', [DropdownValidators]],
    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("sSOLoginDataModel", this.sSOLoginDataModel)
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetTimeTableList();
    await this.GetStreamMasterList()
    await this.GetExamShift()
    await this.GetSubjectList()
    await this.GetSemesterList()
    await this.getMasterData()
    await this.GetDateConfig();
  }
  get _InvigilatorFormGroup() { return this.InvigilatorFormGroup.controls; }

  async ViewandUpdate(content: any, id: number) {
    this.TimeTableID = id
    await this.GetTimeTableByID(id)
    if (this.sSOLoginDataModel.RoleID == 7) {
      /*await this.GetInvigilatorByID(id)*/
    }
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
  }

  async GetStreamMasterList() {
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
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
      await this.commonMasterService.SemesterMaster()
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
    this.searchRequest = new SetExamAttendanceSearchModel()
    this.GetTimeTableList();
  }

  async GetTimeTableList() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.InvigilatorAppointmentID = this.sSOLoginDataModel.UserID
    try {
      //if (this.sSOLoginDataModel.RoleID == 7) {
      //  this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      //}
      this.loaderService.requestStarted();
      await this.TimeTableService.GetExamAttendence(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TimeTableList = data['Data'];
          this.SearchTimeTableList = [...data['Data']];
          console.log("TimeTableList", this.TimeTableList)
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

    //this.Swal2.Confirmation("Are you sure you want to delete this ?",
    //  async (result: any) => {
    //    if (result.isConfirmed) {
    //      try {
    //        this.loaderService.requestStarted();

    //        await this.TimeTableService.DeleteDataByID(InstitudeID, this.UserID, this.sSOLoginDataModel.DepartmentID)
    //          .then(async (data: any) => {
    //            data = JSON.parse(JSON.stringify(data));
    //            console.log(data);

    //            this.State = data['State'];
    //            this.Message = data['Message'];
    //            this.ErrorMessage = data['ErrorMessage'];

    //            if (this.State = EnumStatus.Success) {
    //              this.toastr.success(this.Message)
    //              this.GetTimeTableList()
    //            }
    //            else {
    //              this.toastr.error(this.ErrorMessage)
    //            }

    //          }, (error: any) => console.error(error)
    //          );
    //      }
    //      catch (ex) {
    //        console.log(ex);
    //      }
    //      finally {
    //        setTimeout(() => {
    //          this.loaderService.requestEnded();
    //        }, 200);
    //      }
    //    }
    //  });
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
    //try {
    //  this.loaderService.requestStarted();
    //  await this.TimeTableService.GetTimeTableByID(id)
    //    .then((data: any) => {
    //      data = JSON.parse(JSON.stringify(data));
    //      this.TimeTableBranchSubList = data.Data

    //      console.log("TimeTableBranchSubList", this.TimeTableBranchSubList)

    //    }, (error: any) => console.error(error));
    //}
    //catch (Ex) {
    //  console.log(Ex);
    //}
    //finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}
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
}
