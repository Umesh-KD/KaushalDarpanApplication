import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExaminerDataModel, TeacherForExaminerSearchModel } from '../../../Models/ExaminerDataModel';
import { ExaminerService } from '../../../Services/Examiner/examiner.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { CommonDDLExaminerGroupCodeModel } from '../../../Models/CommonDDLExaminerGroupCodeModel';
import { CommonDDLCommonSubjectModel } from '../../../Models/CommonDDLCommonSubjectModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2'

@Component({
  selector: 'app-add-examiner',
  templateUrl: './add-examiner.component.html',
  styleUrls: ['./add-examiner.component.css'],
  standalone: false
})
export class AddExaminerComponent implements OnInit {
  public HRManagerID: number = 0;
  public SemesterMasterDDLList: any[] = [];
  public filteredSemesterList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public StaffForExaminerList: any[] = [];
  public DesignationMasterList: any[] = [];
  public ExamList: any[] = [];
  public Table_SearchText: any = '';
  // public request = new HrMasterDataModel()
  public _enumDepartment =EnumDepartment
  public AppointExaminer = new ExaminerDataModel();
  public isSubmitted: boolean = false;
  public AppointExaminerFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new TeacherForExaminerSearchModel();
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public InstituteMasterDDLList: any = []
  public SubjectDDLList: any = []
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];

  public commonDDLCommonSubjectModel = new CommonDDLCommonSubjectModel();
  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  constructor(
    private commonMasterService: CommonFunctionService,
    private examinerservice: ExaminerService,
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
    this.getSemesterMasterList();
    await this.ExaminationSchemeChange()
    this.getStreamMasterList();
    this.GetCommonSubjectDDL()
    this.getInstituteMasterList()
    this.getSubjectMasterList()
    this.getExamMasterList()
    this.getDesignationMasterList()

  }
  get _AppointExaminerFormGroup() { return this.AppointExaminerFormGroup.controls; }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
        console.log("SemesterMasterDDLList", this.SemesterMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  ExaminationSchemeChange() {
    this.searchRequest.SemesterID = 0
    if (this.searchRequest.IsYearly == 0) {
      this.filteredSemesterList = this.SemesterMasterDDLList.filter((item: any) => item.SemesterID <= 6);
    } else if (this.searchRequest.IsYearly == 1) {
      this.filteredSemesterList = this.SemesterMasterDDLList.filter((item: any) => item.SemesterID >= 7);
    } else {
      this.filteredSemesterList = this.SemesterMasterDDLList
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
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
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
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
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
  async getDesignationMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DesignationMasterList = data.Data;

        console.log("DesignationMasterList", this.DesignationMasterList);
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
      this.SubjectMasterDDLList=[]
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.searchRequest.StreamID, this.sSOLoginDataModel.DepartmentID, this.searchRequest.SemesterID,)
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
      this.StaffForExaminerList=[]
      this.searchRequest.CommonSubjectYesNo = this.CommonSubjectYesNo;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;

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
    if (!this.AppointExaminer.ExaminerCode) {
      this.toastr.error("Please Fill Examiner code");
      return;
    }

    if (this.sSOLoginDataModel.DepartmentID === EnumDepartment.BTER && this.AppointExaminer.GroupID === 0) {
      this.toastr.error("Please Select GroupCode");
      return;
    }

    // Set common values
    this.AppointExaminer.IsAppointed = true;
    this.AppointExaminer.ActiveStatus = true;
    this.AppointExaminer.DeleteStatus = false;
    this.AppointExaminer.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.AppointExaminer.ModifyBy = this.sSOLoginDataModel.UserID;
    this.AppointExaminer.CourseType = this.sSOLoginDataModel.Eng_NonEng;
    this.AppointExaminer.EndTermID = this.sSOLoginDataModel.EndTermID;

    const saveExaminer = async () => {
      try {
        this.loaderService.requestStarted();
        const data: any = await this.examinerservice.SaveExaminerData(this.AppointExaminer);
        this.State = data.State;
        this.Message = data.Message;
        this.ErrorMessage = data.ErrorMessage;

        if (this.State === EnumStatus.Success) {
          this.toastr.success(this.Message);
          this.AppointExaminer = new ExaminerDataModel();
          this.getStaffForExaminerData();
          this.CloseModalPopup();
        } else {
          this.toastr.error(this.ErrorMessage);
        }
      } catch (error) {
        console.error("Error saving examiner data:", error);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    };

    if (!this.AppointExaminer.AssignGroupCode || this.AppointExaminer.AssignGroupCode=='()') {
      await saveExaminer();
    } else {
      this.Swal2.Confirmation(`This teacher is already assigned this Group Code ${this.AppointExaminer.AssignGroupCode},Select Yes If You want to Assign more Group Code!`, async (result: any) => {
        if (result.isConfirmed) {
          await saveExaminer();
        }
      });
    }
  }



  CloseModalPopup() {
    this.modalService.dismissAll();
    this.AppointExaminer = new ExaminerDataModel();
  }



  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new TeacherForExaminerSearchModel();
    this.AppointExaminer = new ExaminerDataModel();
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
  async ViewandUpdate(content: any, UserID: number,StaffSubjectId:number=0) {

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



  async GetByID(id: number, StaffSubjectId:number) {
    try {
      
      this.loaderService.requestStarted();

      await this.examinerservice.GetByID(id, StaffSubjectId, this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.Eng_NonEng)
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




}
