import { Component, OnInit } from '@angular/core';
import { StudentRequestDataModal, StudentRequestDataSearchModal } from '../../../Models/Hostel-Management/StudentRequestDataModal';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumRole, EnumStatus, EnumHostelStatus } from '../../../Common/GlobalConstants';
import { RoomAllotmentDataModel } from '../../../Models/Hostel-Management/RoomAllotmentDataModel';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import * as XLSX from 'xlsx';
import * as CryptoJS from 'crypto-js';
import { EditHostelStudentSearchModel, HostelStudentSearchModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
const secretKey = 'your-secret-key';

@Component({
  selector: 'app-HostelMerit-list',
  standalone: false,
  
  templateUrl: './HostelMerit-list.component.html',
  styleUrl: './HostelMerit-list.component.css'
})
export class HostelMeritlistComponent implements OnInit {
  public Searchrequest = new StudentRequestDataModal();
  public SearchrequestData = new StudentRequestDataSearchModal()

  public ViewRequest: any = {};
  public Request: any;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public ReqId: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public SearchRequestFormGroup!: FormGroup;
  public RequestFormGroup!: FormGroup;
  public CancelRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = "";
  public StudentReqListList: any = [];
  public SemesterDDLList: any = [];
  public BrachDDLList: any = [];
  public MarksDetailsList: any = [];
  public EditHostelDetailsList: any = [];
  public Allotmentrequest = new RoomAllotmentDataModel();
  public titleDDLBranchTrade: string = ''
  meritMultiSelected: boolean = false;
  HostelDetails = new HostelStudentSearchModel();
  EditHostelDetails = new EditHostelStudentSearchModel();
  _EnumRole = EnumRole;
  _EnumHostelStatus = EnumHostelStatus;
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public paginatedInTableData: any[] = [];
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  pageSize: any = 50;
  pageNo: any = 1;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  public AllStatus = [
    
    { ID: 1, Name: 'Total Applicant' },
    { ID: 2, Name: 'Wating Applicant' },
    //{ ID: 3, Name: 'GetAllHostelStudentReport' },
    //{ ID: 4, Name: 'GetAllAffidavitApprovedReport' },
    { ID: 5, Name: 'Objection Applicant' },
    { ID: 6, Name: 'Allotted Applicant' }
  ];

  constructor(
    private toastr: ToastrService,
    private studentRequestService: StudentRequestService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private _HostelManagmentService: HostelManagmentService) { }


  async ngOnInit() {
    

    this.ReqId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    
    if (this.sSOLoginDataModel.DepartmentID == 1) {
      this.titleDDLBranchTrade='Branch'
    }
    else if (this.sSOLoginDataModel.DepartmentID == 2) {
      this.titleDDLBranchTrade = 'Trade'
    }




    this.RequestFormGroup = this.formBuilder.group({
      StudentName: [''], 
      ClassPercentage: [''], 
      StreamName: [''] 
    });

    this.CancelRequestFormGroup = this.formBuilder.group({
      remark: ['', Validators.required],
    });

    await this.GetAllDataStatus();
    await this.GetBranchMaster();
    await this.GetSemesterMaster();
    
  }
  get _RequestFormGroup() { return this.RequestFormGroup.controls; }
  get _CancelRequestFormGroup() { return this.CancelRequestFormGroup.controls; }

  async GetAllDataStatus() {
    
    try {
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.HostelID = this.sSOLoginDataModel.HostelID;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      if (this.Searchrequest.AllotmentStatus == 1) {
        this.Searchrequest.Action = "GetAllStudentHostelApplyReport";
      } else if (this.Searchrequest.AllotmentStatus == 2) {
        this.Searchrequest.Action = "GetAllGenerateProvisionalReport";
      } else if (this.Searchrequest.AllotmentStatus == 3) {
        this.Searchrequest.Action = "GetAllHostelStudentReport";
      } else if (this.Searchrequest.AllotmentStatus == 4) {
        this.Searchrequest.Action = "GetAllAffidavitApprovedReport";
      } else if (this.Searchrequest.AllotmentStatus == 5) {
        this.Searchrequest.Action = "GetAllAffidavitApprovedObjectionReport";
      } else if (this.Searchrequest.AllotmentStatus == 6) {
        this.Searchrequest.Action = "GetAllFinalListReport";
      } else {
        this.Searchrequest.Action = "GetAllStudentHostelApplyReport"; 
      }

      this.loaderService.requestStarted();
      await this.studentRequestService.GetAllDataStatus(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentReqListList = data['Data'];

          this.StudentReqListList.forEach((item: any) => {
            item.selected = false;
          });

          console.log('Student List ==>',this.StudentReqListList)
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  exportToExcel(): void {
    const unwantedColumns = ['InstituteId', 'InstituteId', 'ApplicationId', 'StudentId', 'SemesterId', 'AllotmentStatus', 'BrachId', 'AllotmentStatus1', 'EndTermID'];
    const filteredData = this.StudentReqListList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'StudentApplyHostelReportData.xlsx');
  }


  async GetBranchMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.StreamMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BrachDDLList = data['Data'];
          console.log(this.BrachDDLList)
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

  async GetSemesterMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterDDLList = data['Data'];
          console.log(this.SemesterDDLList)
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

  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequest = new StudentRequestDataModal();
    this.RequestFormGroup.reset();
  }
  

  async onView(model: any, studentData: any) {
    this.ViewRequest = {}
    try {
      this.ViewRequest = { ...studentData };
      console.log('show data ==>',this.ViewRequest)
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
  }


  async btnUserApprove_OnClick(ReqId: number) {
    
    this.Swal2.Confirmation("Are you sure you want to Approve this  ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();
            await this.studentRequestService.ApprovedReq(ReqId, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetAllDataStatus()
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
 

  async onCancelAllotment(model: any, userData: any) {
    
    try {
      this.Request = { ...userData };
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async AllotmentCancelData() {
    
    console.log("remark value is", this.Allotmentrequest.Remark)
    this.Allotmentrequest.ReqId = this.Request.ReqId;
    this.Allotmentrequest.AllotmentStatus = 5;
    this.isSubmitted = true;
    if (this.RequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (this.ReqId) {
        this.Allotmentrequest.ReqId = this.ReqId
        this.Allotmentrequest.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.Allotmentrequest.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      await this.studentRequestService.AllotmentCancelData(this.Allotmentrequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.CloseModal();
            this.GetAllDataStatus();
          }
          else if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage);
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
  

  selectAllItems() {
    for (let item of this.StudentReqListList) {
      item.selected = this.meritMultiSelected;
    }
  }

  getSelectedItems(): any[] {
    return this.StudentReqListList.filter((item: any) => item.selected);
  }
  
  onGenerateMeritList() {
    const selected = this.getSelectedItems();

    if (selected.length === 0) {
      this.toastr.warning("Please select at least one student.");
      return;
    }

    const selectedIds = selected.map(item => item.ReqId).join(',');
    const encrypted = CryptoJS.AES.encrypt(selectedIds, secretKey).toString();
    this.routers.navigate(['/HostelMeritlist/HostelGenerateMeritlist'], {
      queryParams: { ids: encodeURIComponent(encrypted) }
    });
  }


  onApplyForHostel(content: any = '', item:any) {
    this.routers.navigate(['/ApplyForHostel'], {
      queryParams: {
        id: item.ReqId
      }
    });
    this.GetAllData();
  }


  async GetAllData() {
    try {

      this.EditHostelDetails.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.EditHostelDetails.HostelID = this.sSOLoginDataModel.HostelID;
      this.EditHostelDetails.RoleId = this.sSOLoginDataModel.RoleID;
      this.EditHostelDetails.ReqId = this.ReqId;
      this.EditHostelDetails.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();

      await this._HostelManagmentService.EditAllotedHostelDetails(this.EditHostelDetails)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.EditHostelDetailsList = data['Data'];

          console.log(this.EditHostelDetailsList)
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



  async onSearch(i: any) {
    debugger
    console.log("i", i);
    if (i == 1) {
      this.pageNo = 1;
    } else if (i == 2) {
      this.pageNo++;
    } else if (i == 3) {
      if (this.pageNo > 1) {
        this.pageNo--;
      }
    } else {
      this.pageNo = i;
    }


    try {
      this.SearchrequestData.PageNumber = this.pageNo
      this.SearchrequestData.PageSize = this.pageSize

      if (this.SearchrequestData.AllotmentStatus == 1) {
        this.SearchrequestData.Action = "GetAllStudentHostelApplyReport";
      } else if (this.SearchrequestData.AllotmentStatus == 2) {
        this.SearchrequestData.Action = "GetAllGenerateProvisionalReport";
      } else if (this.SearchrequestData.AllotmentStatus == 3) {
        this.SearchrequestData.Action = "GetAllHostelStudentReport";
      } else if (this.SearchrequestData.AllotmentStatus == 4) {
        this.SearchrequestData.Action = "GetAllAffidavitApprovedReport";
      } else if (this.SearchrequestData.AllotmentStatus == 5) {
        this.SearchrequestData.Action = "GetAllAffidavitApprovedObjectionReport";
      } else if (this.SearchrequestData.AllotmentStatus == 6) {
        this.SearchrequestData.Action = "GetAllFinalListReport";
      } else {
        this.SearchrequestData.Action = "GetAllStudentHostelApplyReport";
      }

     // this.SearchrequestData.Action = "LIST";

      this.loaderService.requestStarted();
      await this.studentRequestService.GetAllDataStatus(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentReqListList = data.Data;
          debugger
          this.totalRecord = this.StudentReqListList[0]?.TotalRecords;
          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
          console.log('list of search student data==>', this.totalRecord)
          console.log('list of search student data==>', this.TotalPages)
        }, (error: any) => console.error(error))
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


  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }

  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.StudentReqListList].slice(this.startInTableIndex, this.endInTableIndex);
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

  resetInTableValiable() {
    this.paginatedInTableData = [];
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.StudentReqListList.length;
  }



  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.onSearch(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.StudentReqListList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.onSearch(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.onSearch(3)
    }
  }


}
