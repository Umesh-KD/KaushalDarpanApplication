import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus ,EnumDepartment} from '../../../Common/GlobalConstants';
import { CommonDDLCommonSubjectModel } from '../../../Models/CommonDDLCommonSubjectModel';
import { CommonDDLExaminerGroupCodeModel } from '../../../Models/CommonDDLExaminerGroupCodeModel';
import { ExaminerDataModel, TeacherForExaminerSearchModel } from '../../../Models/ExaminerDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ExaminerService } from '../../../Services/Examiner/examiner.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { ItiExaminerService } from '../../../Services/ItiExaminer/iti-examiner.service';
import { ItiAssignStudentExaminer, ItiExaminerDataModel, ITITeacherForExaminerSearchModel } from '../../../Models/ItiExaminerDataModel';
import { CommonDDLSubjectCodeMasterModel } from '../../../Models/CommonDDLSubjectMasterModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2'

@Component({
  selector: 'app-appoint-itiexaminer',
  templateUrl: './appoint-itiexaminer.component.html',
  styleUrl: './appoint-itiexaminer.component.css',
  standalone: false
})
export class AppointITIExaminerComponent {
  public HRManagerID: number = 0;
  public SemesterMasterDDLList: any[] = [];
  public filterSemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public StaffForExaminerList: ItiAssignStudentExaminer[] = [];
  public DesignationMasterList: any[] = [];
  public TradeTypeDDLList: any[] = [];
  public ExamList: any[] = [];
  public Table_SearchText: any = '';
  public AllSelect: boolean = false;
  // public request = new HrMasterDataModel()
  public ExaminerID:number=0

  public _enumDepartment = EnumDepartment
  public AppointExaminer = new ItiExaminerDataModel();
  public isSubmitted: boolean = false;
  public AppointExaminerFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITITeacherForExaminerSearchModel();
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public InstituteMasterDDLList: any = []
  public SubjectDDLList: any = []
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public SearchSubject = new CommonDDLSubjectCodeMasterModel()

  public commonDDLCommonSubjectModel = new CommonDDLCommonSubjectModel();
  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  constructor(
    private commonMasterService: CommonFunctionService,
    private examinerservice: ItiExaminerService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private staffMasterService: StaffMasterService,
    private Swal2: SweetAlert2

  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);
    this.searchRequest.SubjectType = Number(this.activatedRoute.snapshot.queryParamMap.get('SubjectType') ?? 0)
    this.ExaminerID = Number(this.activatedRoute.snapshot.queryParamMap.get('ExaminerID') ?? 0)
    this.searchRequest.ExaminerID = this.ExaminerID
    this.getSemesterMasterList();
/*    this.getStreamMasterList();*/

    this.getInstituteMasterList()
/*    this.getSubjectMasterList()*/
  /*  this.getExamMasterList()*//*  this.getExamMasterList()*/
    this.getTradeType()

  }
  get _AppointExaminerFormGroup() { return this.AppointExaminerFormGroup.controls; }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
        this.SemesterMasterDDLList = this.SemesterMasterDDLList.filter((e: any) => e.SemesterID != 5 && e.SemesterID != 6);

        console.log("filterSemesterMasterDDLList", this.filterSemesterMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getSubjectMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectMaster(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectDDLList = data.Data;
        console.log("SubjectDDLList", this.SubjectDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async getExamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamName().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamList = data.Data;
        console.log("ExamList", this.ExamList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async getInstituteMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetITICenterDDL( this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
        console.log("InstituteMasterDDLList", this.InstituteMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.searchRequest.TradeType, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
        console.log("StreamMasterDDLList", this.StreamMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getGroupCodeMasterList() {
    try {
      let model = new CommonDDLExaminerGroupCodeModel();
      model.SubjectID = this.AppointExaminer.SubjectID;
      model.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      model.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      model.EndTermID = this.sSOLoginDataModel.EndTermID;
      //call
      await this.commonMasterService.GetExaminerGroupCode(model).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GroupMasterDDLList = data.Data;

        console.log("GroupMasterDDLList", this.GroupMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    }
  }
  async getTradeType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTradeTypesList().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeTypeDDLList = data.Data;

        console.log("TradeTypeDDLList", this.TradeTypeDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async ddlStream_Change() {
    try {
      this.loaderService.requestStarted();
      this.SubjectMasterDDLList = []
      this.SearchSubject.StreamID = this.searchRequest.StreamID
      this.SearchSubject.SemesterID = this.searchRequest.SemesterID
      this.SearchSubject.SubjectType = this.searchRequest.SubjectType
      this
      await this.commonMasterService.GetITISubjectNameDDl(this.SearchSubject)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterDDLList = data.Data;
          console.log("SubjectMasterDDLList", this.SubjectMasterDDLList)
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

  async getStaffForExaminerData() {
    try {
      this.StaffForExaminerList = []
     /* this.searchRequest.CommonSubjectYesNo = this.CommonSubjectYesNo;*/
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      if (this.searchRequest.SubjectType == 1) {
        this.searchRequest.IsPractical = false
        this.searchRequest.IsTheory = true
      } else if (this.searchRequest.SubjectType == 2){
        this.searchRequest.IsPractical = true
        this.searchRequest.IsTheory = false
       }
      //
      await this.examinerservice.GetTeacherForExaminer(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        
        this.StaffForExaminerList = data.Data;
        
        console.log("this.StaffForExaminerList", this.StaffForExaminerList)
      })
    } catch (error) {
      console.error(error)
    }
  }

  async appointStaffAsExaminer(StaffID: number) {

    if (this.AppointExaminer.ExaminerCode == '') {
      this.toastr.error("Please Fill Examiner code")
      return
    }
    if (this.AppointExaminer.RollFrom == '') {
      this.toastr.error("Please Fill Roll No from")
      return
    }

    if (this.AppointExaminer.RollTo == '') {
      this.toastr.error("Please Fill Roll No To ")
      return
    }
    //const selectedStaff = this.StaffForExaminerList.find(staff => staff.StaffID === StaffID);
    //console.log("selectedStaff", selectedStaff);

    //// Check if the staff is found
    //if (selectedStaff) {
    //  if (selectedStaff.ExaminerID == null || selectedStaff.ExaminerID == 0) {
    //    this.AppointExaminer.ExaminerID = 0;
    //    this.AppointExaminer.CreatedBy = this.sSOLoginDataModel.UserID;
    //  } else {
    //    this.AppointExaminer.ExaminerID = selectedStaff.ExaminerID;
    //    this.AppointExaminer.ModifyBy = this.sSOLoginDataModel.UserID;
    //  }

    //  this.AppointExaminer.StaffID = selectedStaff.StaffID;
    //  this.AppointExaminer.Name = selectedStaff.Name;
    //  this.AppointExaminer.SSOID = selectedStaff.SSOID;
    //  this.AppointExaminer.InstituteID = selectedStaff.InstituteID;
    //  this.AppointExaminer.SubjectID = selectedStaff.SubjectID;
    //  // If only need the first StreamID
    //  if (selectedStaff.StreamID) {
    //    const streamIds = selectedStaff.StreamID.split(',').map((id: string) => parseInt(id.trim(), 10)); // Convert to numbers
    //    this.AppointExaminer.StreamID = streamIds[0]; // Use the first StreamID
    //  }
    //  // If need to handle multiple StreamIDs
    //  // if (selectedStaff.StreamID) {
    //  //   const streamIds = selectedStaff.StreamID.split(',').map((id: string) => parseInt(id.trim(), 10));
    //  //   this.AppointExaminer.StreamID = streamIds; // Store all StreamIDs
    //  // }
    //  this.AppointExaminer.SemesterID = this.searchRequest.SemesterID;

    this.AppointExaminer.IsAppointed = true;
    this.AppointExaminer.ActiveStatus = true;
    this.AppointExaminer.DeleteStatus = false;
    console.log("AppointExaminer:", this.AppointExaminer);
    this.AppointExaminer.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.AppointExaminer.ModifyBy = this.sSOLoginDataModel.UserID
    this.AppointExaminer.CourseType = this.sSOLoginDataModel.Eng_NonEng
    this.AppointExaminer.EndTermID = this.sSOLoginDataModel.EndTermID

    try {
      this.loaderService.requestStarted();
      await this.examinerservice.SaveExaminerData(this.AppointExaminer).then((data: any) => {
        /*data = JSON.parse(JSON.stringify(data));*/
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AppointExaminer = new ItiExaminerDataModel();
          this.getStaffForExaminerData();
          this.CloseModalPopup()
        } else if (this.State == EnumStatus.Warning) {
          this.toastr.error(this.ErrorMessage)
        }

        else {
          this.toastr.error(this.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  CloseModalPopup() {
    this.modalService.dismissAll();
    this.AppointExaminer = new ItiExaminerDataModel();
  }



  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new ITITeacherForExaminerSearchModel();
    this.AppointExaminer = new ItiExaminerDataModel();
    this.SubjectMasterDDLList = [];
    this.StaffForExaminerList = [];
  }

  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    /*  this.getSubjectMasterList()*/
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
  async ViewandUpdate(content: any, UserID: number, StaffSubjectId: number = 0) {

    //const initialState = {
    //  UserID: UserID,
    //  Type: "Admin",
    //};
    await this.GetByID(UserID, StaffSubjectId)
    /*  alert(  this.AppointExaminer.InstituteID)*/
    //try {
    //  await this.staffMasterService.GetByID(UserID)
    //    .then((data: any) => {
    //      data = JSON.parse(JSON.stringify(data));
    //      console.log(data);

    //      /*this.request.UserID = data['Data']["RoleID"];*/
    //      //this.request.UserID = data['Data']["UserID"];
    //      //this.request.SSOID = data['Data']["SSOID"];
    //    }, error => console.error(error));
    //}
    //catch (ex) { console.log(ex) }
    //finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}


    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
    /*  this.modalReference.componentInstance.initialState = initialState;*/

    //this.modalReference.shown(CampusPostComponent, { initialState });
    //this.modalReference.show(CampusPostComponent, { initialState });
  }



  async GetByID(id: number, StaffSubjectId: number) {
    try {
      
      this.loaderService.requestStarted();

      await this.examinerservice.GetByID(id, StaffSubjectId, this.sSOLoginDataModel.DepartmentID)
        .then(async (data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "data");
          this.AppointExaminer.StaffID = data['Data']["StaffID"];

          this.AppointExaminer.Name = data['Data']["Name"];
          this.AppointExaminer.SSOID = data['Data']["SSOID"];
          this.AppointExaminer.AssignGroupCode = data['Data']["AssignGroupCode"];
          this.AppointExaminer.ExaminerCode = data['Data']["ExaminerCode"];
          //this.AppointExaminer.IsAppointed;
          /*    this.AppointExaminer.SubjectID = data['Data']["SubjectID"];*/
          this.AppointExaminer.DesignationID = data['Data']['DesignationID']

          this.AppointExaminer.InstituteID = data['Data']['InstituteID']
          this.AppointExaminer.SubjectID = data['Data']['SubjectID']
          /*      console.log(this.AppointExaminer.InstituteID,"   this.AppointExaminer.InstituteID ")*/

          this.getGroupCodeMasterList()

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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

  async GetCommonSubjectDDL() {
    try {
      if (this.CommonSubjectYesNo == 1 || this.searchRequest.SemesterID == 0) {//no
        this.CommonSubjectDDLList = [];
        return;
      }
      this.commonDDLCommonSubjectModel.SemesterID = this.searchRequest.SemesterID;
      this.commonDDLCommonSubjectModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.commonDDLCommonSubjectModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.commonDDLCommonSubjectModel.EndTermID = this.sSOLoginDataModel.EndTermID;
      //get
      await this.commonMasterService.GetCommonSubjectDDL(this.commonDDLCommonSubjectModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CommonSubjectDDLList = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.StaffForExaminerList) {
      item.selected = isChecked;  // Set all checkboxes based on the parent checkbox state
    }
  }


  get totalInTableSelected(): number {
    return this.StaffForExaminerList.filter(x => x.selected)?.length;
  }



  async SaveStudent() {
    //validation    

    const isSelected = this.StaffForExaminerList.some(x => x.selected);
    if (!isSelected) {
      this.toastr.error("Please select at least one Item!");
      return;
    }
    // confirm
    this.Swal2.Confirmation("Are you sure to continue?", async (result: any) => {
      //confirmed
      if (result.isConfirmed) {
        try {
          this.isSubmitted = true;
          // Filter out only the selected students
          const selectedStudents = this.StaffForExaminerList.filter(x => x.selected);
          selectedStudents.forEach(e => {
            e.ExaminerID = this.ExaminerID;
            e.EndTermID = this.sSOLoginDataModel.EndTermID;
            e.DepartmentID = this.sSOLoginDataModel.DepartmentID;
            e.UserID = this.sSOLoginDataModel.UserID;

            if (this.searchRequest.SubjectType == 1) {
              e.IsPractical = false;
              e.IsTheory = true;
            } else if (this.searchRequest.SubjectType == 2) {
              e.IsPractical = true;
              e.IsTheory = false;
            }
          });

          // Call service to save student exam status
          await this.examinerservice.SaveStudent(selectedStudents)
            .then(async (data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              //
              if (this.State == EnumStatus.Success) {
                this.toastr.success(this.Message)
                this.getStaffForExaminerData()
       /*         await this.GetAllStudent();*/
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.ErrorMessage)
              }
            })
        } catch (ex) {
          console.log(ex);
        }
      }
    });
  }
}
