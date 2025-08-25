import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus, EnumDepartment} from '../../../Common/GlobalConstants';
import { CommonDDLCommonSubjectModel } from '../../../Models/CommonDDLCommonSubjectModel';
import { CommonDDLExaminerGroupCodeModel } from '../../../Models/CommonDDLExaminerGroupCodeModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { PaperSetterService } from '../../../Services/PaperSetter/paper-setter.service';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { AppointPaperSetterDataModel, PaperSetterDataModel, StaffForPaperSetterListDataModel, TeacherForPaperSetterSearchModel } from '../../../Models/PaperSetterDataModel';

@Component({
  selector: 'app-paper-setter',
  standalone: false,
  templateUrl: './paper-setter.component.html',
  styleUrl: './paper-setter.component.css'
})


export class PaperSetterComponent implements OnInit {
  public HRManagerID: number = 0;
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public StaffForPaperSetterList: StaffForPaperSetterListDataModel[] = [];
  public DesignationMasterList: any[] = [];
  public ExamList: any[] = [];
  public CommonSubjectDetailsList: any[] = [];
  public Table_SearchText: any = '';
  // public request = new HrMasterDataModel()
  public _enumDepartment = EnumDepartment
  public AppointExaminer = new PaperSetterDataModel();
  public isSubmitted: boolean = false;
  public AppointExaminerFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new TeacherForPaperSetterSearchModel();
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

  public appointRequest = new AppointPaperSetterDataModel();
  public PaperSetterID: number = 0;

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

  constructor(
    private commonMasterService: CommonFunctionService,
    private papersetterservice: PaperSetterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private staffMasterService: StaffMasterService,

  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);
    this.getSemesterMasterList();
    this.getStreamMasterList();
    this.GetCommonSubjectDDL()
    this.getInstituteMasterList()
    this.getSubjectMasterList()
    this.getExamMasterList()
    this.getDesignationMasterList()
    // this.getStaffForExaminerData() 

    this.PaperSetterID = this.activatedRoute.snapshot.queryParams['id'];
    if (this.PaperSetterID > 0) {
      this.GetByID();
    }
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
    
    
    if(this.searchRequest.CommonSubjectYesNo == 2){
      this.searchRequest.CommonSubjectID = 0
      this.CommonSubjectDDLList = [];
      await this.GetCommonSubjectDDL();
    }
    await this.getStaffForExaminerData();
    try {
      this.loaderService.requestStarted();
      this.SubjectMasterDDLList = []
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
      this.searchRequest.CommonSubjectYesNo = this.CommonSubjectYesNo;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;

      //
      await this.papersetterservice.GetTeacherForExaminer(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffForPaperSetterList = data.Data;
        console.log("this.StaffForPaperSetterList", this.StaffForPaperSetterList)
        this.loadInTable();
      })
    } catch (error) {
      console.error(error)
    }
  }

  async AppointPaperSetter() {
    const anyStaffSelected = this.StaffForPaperSetterList.some(staff => staff.Selected);
    if (!anyStaffSelected) {
      this.toastr.error("Please select at least one Staff!");
      return;
    }
    
    if(this.searchRequest.SemesterID == 0){
      this.toastr.error("Please Select Semester");
      return;
    } else {
      this.appointRequest.SemesterID = this.searchRequest.SemesterID;
    }

    if(this.CommonSubjectYesNo == 1) {
      if (this.searchRequest.StreamID == 0) {
        this.toastr.error("Please Select Stream");
        return;
      } else {
        this.appointRequest.StreamID = this.searchRequest.StreamID;
      }

      if(this.searchRequest.SubjectID == 0){
        this.toastr.error("Please Select Subject");
        return;
      } else {
        this.appointRequest.SubjectID = this.searchRequest.SubjectID;
      }
    }

    if(this.CommonSubjectYesNo == 2){
      if(this.searchRequest.CommonSubjectID == 0) {
        this.toastr.error("Please Select Common Subject");
        return;
      }

      if(this.searchRequest.CommonSubjectDetailID == 0) {
        this.toastr.error("Please Select Common Subject Detail");
        return;
      } else {
        this.appointRequest.SubjectID = this.searchRequest.CommonSubjectDetailID;
      }
    }

    this.appointRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.appointRequest.StaffDetails = this.StaffForPaperSetterList.filter(staff => staff.Selected);

    console.log("this.appointRequest", this.appointRequest);

    this.appointRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.appointRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.appointRequest.EndTermID = this.sSOLoginDataModel.EndTermID;

    
    try {
      this.loaderService.requestStarted();
      await this.papersetterservice.AppointPaperSetter(this.appointRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success){
          this.toastr.success(data.Message);
          this.routers.navigate(['/PaperSetterList']);
        } else {
          this.toastr.error(data.Message);
        }
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async appointStaffAsExaminer(StaffID: number) {
    

    //if (this.AppointExaminer.ExaminerCode == '') {
    //  this.toastr.error("Please Fill Examiner code")
    //  return
    //}

    //if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.BTER && this.AppointExaminer.GroupID == 0) {
    //  this.toastr.error("Please Select GroupCode")
    //}
    //const selectedStaff = this.StaffForPaperSetterList.find(staff => staff.StaffID === StaffID);
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
      await this.papersetterservice.SaveExaminerData(this.AppointExaminer).then((data: any) => {
        /*data = JSON.parse(JSON.stringify(data));*/
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.AppointExaminer = new PaperSetterDataModel();
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
    this.AppointExaminer = new PaperSetterDataModel();
  }



  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new TeacherForPaperSetterSearchModel();
    this.AppointExaminer = new PaperSetterDataModel();
    this.SubjectMasterDDLList = [];
    this.StaffForPaperSetterList = [];
    this.CommonSubjectYesNo=1
    this.searchRequest.CommonSubjectYesNo = 1
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
    // await this.GetByID(UserID, StaffSubjectId)
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



  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.papersetterservice.GetPaperSetterStaffDetails(this.PaperSetterID).then(async(data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("getbyid", data)
        if (data.State == EnumStatus.Success) {
          this.appointRequest = data.Data;
          this.searchRequest.SemesterID=this.appointRequest.SemesterID
          this.searchRequest.StreamID=this.appointRequest.StreamID
          await this.ddlStream_Change();
          this.searchRequest.SubjectID=this.appointRequest.SubjectID
          
          if(this.appointRequest.CommonSubjectYesNo == 2) {
            this.CommonSubjectYesNo = 2
            await this.GetCommonSubjectDDL();
            this.searchRequest.CommonSubjectID = this.appointRequest.CommonSubjectID
            await this.GetCommonSubjectDetailsDDL();
            this.searchRequest.CommonSubjectDetailID = this.appointRequest.SubjectID
          }
          await this.getStaffForExaminerData();
          this.appointRequest.StaffDetails.forEach(element => {
            const data = this.StaffForPaperSetterList.filter(x => x.StaffID == element.StaffID);
            data.forEach(x => {
              x.Selected = true;
            });
          })
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
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

  async GetCommonSubjectDetailsDDL() {
    await this.getStaffForExaminerData();
    try {
      // if (this.CommonSubjectYesNo == 1 || this.searchRequest.SemesterID == 0) {//no
      //   this.CommonSubjectDDLList = [];
      //   return;
      // }
      this.commonDDLCommonSubjectModel.SemesterID = this.searchRequest.SemesterID;
      this.commonDDLCommonSubjectModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.commonDDLCommonSubjectModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.commonDDLCommonSubjectModel.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.commonDDLCommonSubjectModel.CommonSubjectID = this.searchRequest.CommonSubjectID;
      //get
      
      await this.commonMasterService.GetCommonSubjectDetailsDDL(this.commonDDLCommonSubjectModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CommonSubjectDetailsList = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.StaffForPaperSetterList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.StaffForPaperSetterList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.StaffForPaperSetterList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.StaffForPaperSetterList.filter(x => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  selectInTableAllCheckbox() {
    this.StaffForPaperSetterList.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.StaffForPaperSetterList.filter(x => x.StaffID == item.StaffID);
    data.forEach(x => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.StaffForPaperSetterList.every(r => r.Selected);
  }
  // end table feature


}
