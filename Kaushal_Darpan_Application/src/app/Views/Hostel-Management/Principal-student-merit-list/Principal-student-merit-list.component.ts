import { Component, OnInit } from '@angular/core';
import { StudentRequestDataModal } from '../../../Models/Hostel-Management/StudentRequestDataModal';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumRole, EnumStatus, HostelStatus } from '../../../Common/GlobalConstants';
import { RoomAllotmentDataModel } from '../../../Models/Hostel-Management/RoomAllotmentDataModel';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import * as XLSX from 'xlsx';
import * as CryptoJS from 'crypto-js';
import { EditHostelStudentSearchModel, HostelStudentSearchModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
const secretKey = 'your-secret-key';

@Component({
  selector: 'app-Principal-student-merit-list',
  standalone: false,
  
  templateUrl: './Principal-student-merit-list.component.html',
  styleUrl: './Principal-student-merit-list.component.css'
})
export class PrincipalstudentmeritlistComponent implements OnInit {
  public Searchrequest = new StudentRequestDataModal()
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
  public GenderList: any = []
  public HostelStatusList: any = []
  public Allotmentrequest = new RoomAllotmentDataModel();
  public titleDDLBranchTrade: string = ''
  meritMultiSelected: boolean = false;

  HostelDetails = new HostelStudentSearchModel();
  EditHostelDetails = new EditHostelStudentSearchModel();
  _EnumRole = EnumRole;
  _HostelStatus = HostelStatus;
  public showRegenerateMerit: boolean = false;

  constructor(
    private toastr: ToastrService,
    private studentRequestService: StudentRequestService,
    private commonFunctionService: CommonFunctionService,
    //private _HostelManagmentService: HostelManagmentService,
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

    await this.GetHostelStatusDDL();
    await this.GetBranchMaster();
    await this.GetSemesterMaster();
    await this.GetGenderList();
    await this.GetAllPrincipalstudentmeritlist();
    //await this.GetMarksDetails();
   // await this.GetAllData();
  }
  get _RequestFormGroup() { return this.RequestFormGroup.controls; }
  get _CancelRequestFormGroup() { return this.CancelRequestFormGroup.controls; }

  async GetHostelStatusDDL() {
    try {
      await this.commonFunctionService.GetHostelStatusDDL().then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.HostelStatusList = data['Data'];
        this.HostelStatusList = this.HostelStatusList.filter((x: any) => x.StatusID == 1 || x.StatusID == 9 || x.StatusID == 15)
      })
    } catch (error) {
      console.error(error);
    }
  }
  async GetAllPrincipalstudentmeritlist() {
     
    try {
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.HostelID = this.sSOLoginDataModel.HostelID;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      if(this.Searchrequest.status != HostelStatus.Apply) {
        this.Searchrequest.Action ="AllHostelStudentMeritlistShowByPrinciple";
      }

      if (
        this.Searchrequest.status == HostelStatus.AffidavitApproved
        || this.Searchrequest.status == HostelStatus.PublishProvisionalMerit
        || this.Searchrequest.status == HostelStatus.ReGenerateProvisionalMerit
      ) {
        this.Searchrequest.Action ="HostelMeritList_Generated";
      }   

      this.loaderService.requestStarted();
      await this.studentRequestService.GetAllPrincipalstudentmeritlist(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentReqListList = data['Data'];

            this.StudentReqListList.forEach((item: any) => {
              item.selected = false;
            });

            this.showRegenerateMerit = this.StudentReqListList.some((x: any) => x.MeritType === 2)

            console.log('Student List ==>', this.StudentReqListList)
          } else {
            this.toastr.error(data.ErrorMessage)
          }
          
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //exportToExcel(): void {
  //  const unwantedColumns = ['InstituteId', 'InstituteId', 'ApplicationId', 'StudentId', 'SemesterId', 'AllotmentStatus',
  //    'BrachId', 'AllotmentStatus1', 'EndTermID', 'ReqId'

  //  ];
  //  const filteredData = this.StudentReqListList.map((item: any) => {
  //    const filteredItem: any = {};
  //    Object.keys(item).forEach(key => {
  //      if (!unwantedColumns.includes(key)) {
  //        filteredItem[key] = item[key];
  //      }
  //    });
  //    return filteredItem;
  //  });
  //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //  XLSX.writeFile(wb, 'StudentApplyHostelReportData.xlsx');
  //}


  //exportToExcel(): void {

  //  const columnMapping = {
  //    SrNo: 'Sr. No.',
  //    InstituteName: 'Institute Name',
  //    StudentName: 'Student Name',
  //    HostelRequestNo: 'Request No',
  //    StreamName: 'Branch',
  //    SemesterName: 'Semester',
  //    EndTermName: 'Session',
  //    TotalAvgPercentage: 'Percentage (%)'
  //  };

  //  const wantedColumns = Object.keys(columnMapping);


  //  const exportData = this.StudentReqListList.map((row: any, index: number) => {
  //    const filteredRow: any = {};
  //    wantedColumns.forEach(col => {
  //      filteredRow[col] = col === 'SrNo' ? index + 1 : row[col];
  //    });
  //    return filteredRow;
  //  });

  //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  //  const colWidths = wantedColumns.map(col => {
  //    const maxLength = Math.max(
  //      col.length,
  //      ...exportData.map((row: any) =>
  //        row[col] ? row[col].toString().length : 0
  //      )
  //    );
  //    return { wch: maxLength + 2 };
  //  });
  //  ws['!cols'] = colWidths;

  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //  const todayDate = new Date().toISOString().split('T')[0];

  //  const fileName = `Student_Apply_Hostel_Report_Data_${todayDate}.xlsx`;
  //  XLSX.writeFile(wb, fileName);
  //}


  //exportToExcel(): void {

  //  const columnMapping: any = {
  //    SrNo: 'Sr. No.',
  //    InstituteName: 'Institute Name',
  //    StudentName: 'Student Name',
  //    HostelRequestNo: 'Request No',
  //    StreamName: 'Branch',
  //    SemesterName: 'Semester',
  //    EndTermName: 'Session',
  //    TotalAvgPercentage: 'Percentage (%)'
  //  };

  //  const wantedColumns = Object.keys(columnMapping);

  //  const exportData = this.StudentReqListList.map((row: any, index: number) => {
  //    const formattedRow: any = {};

  //    wantedColumns.forEach(col => {
  //      const header = columnMapping[col];

  //      if (col === 'SrNo') {
  //        formattedRow[header] = index + 1;
  //      } else {
  //        formattedRow[header] = row[col];
  //      }
  //    });

  //    return formattedRow;
  //  });

  //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //  const todayDate = new Date().toISOString().split('T')[0];
  //  const fileName = `Student_Apply_Hostel_Report_Data_${todayDate}.xlsx`;

  //  XLSX.writeFile(wb, fileName);
  //}

  exportToExcel(): void {

    const columnMapping: any = {
      SrNo: 'Sr. No.',
      InstituteName: 'Institute Name',
      StudentName: 'Student Name',
      HostelRequestNo: 'Request No',
      StreamName: 'Branch',
      SemesterName: 'Semester',
      EndTermName: 'Session',
      TotalAvgPercentage: 'Percentage (%)'
    };

    const wantedColumns = Object.keys(columnMapping);

    const exportData = this.StudentReqListList.map((row: any, index: number) => {
      const formattedRow: any = {};

      wantedColumns.forEach(col => {
        const header = columnMapping[col];

        if (col === 'SrNo') {
          formattedRow[header] = index + 1;
        } else {
          formattedRow[header] = row[col];
        }
      });

      return formattedRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // ✅ Column Width Fix
    ws['!cols'] = [
      { wch: 8 },
      { wch: 40 },
      { wch: 25 },
      { wch: 18 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 }
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const todayDate = new Date().toISOString().split('T')[0];
    const fileName = `Student_Apply_Hostel_Report_Data_${todayDate}.xlsx`;

    XLSX.writeFile(wb, fileName);
  }


  async GetBranchMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
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

  async GetGenderList() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
        }, (error: any) => console.error(error)
      );
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
  

  //async GetMarksDetails() {
  //  try {
  //    let obj = {
  //      StudentID: 7,
  //      Action: "_MarksDetails"
  //    }
  //    await this._HostelManagmentService.GetStudentDetailsForApply(obj)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.MarksDetailsList = data['Data'];
  //      }, error => console.error(error));
  //    console.log('Marks Details ==>',this.MarksDetailsList)
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //}


  async onView(model: any, studentData: any) {
     
    this.ViewRequest = {}
    try {
      this.ViewRequest = { ...studentData };
      //this.RequestFormGroup.patchValue({
      //  ReqId: this.ViewRequest.ReqId,
      //  StudentName: this.ViewRequest.StudentName,
      //  ClassPercentage: this.ViewRequest.ClassPercentage,
      //  StreamName: this.ViewRequest.StreamName
      //});
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
                  this.GetAllPrincipalstudentmeritlist()
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
            this.GetAllPrincipalstudentmeritlist();
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

  async GenerateProvisionalMerit_Hostel() {
    if(this.Searchrequest.Gender == 0 || this.Searchrequest.Gender == undefined || this.Searchrequest.Gender == null){
      this.toastr.warning("Please select gender.");
      return;
    }
    let selected = this.getSelectedItems();
    if (selected.length === 0) {
      this.toastr.warning("Please select student.");
      return;
    }

    selected.forEach(item => {
      item.modifyby = this.sSOLoginDataModel.UserID;
    });
    
    try {
      await this.studentRequestService.GenerateProvisionalMerit_Hostel(this.Searchrequest.Gender, selected)
      .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success){
          this.toastr.success(data.Message);
          // const selectedIds = selected.map(item => item.ReqId).join(',');
          // const encrypted = CryptoJS.AES.encrypt(selectedIds, secretKey).toString();
          // this.routers.navigate(['/HostelMeritlist/HostelGenerateMeritlist'], {
          //   queryParams: { ids: encodeURIComponent(encrypted) }
          // });
          //this.routers.navigate(['/HostelMeritlist/HostelGenerateMeritlist'])
          window.location.reload();
        } else {
          this.toastr.error(data.ErrorMessage);
          this.toastr.warning(data.Message);
        }
      })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    console.log(selected);
  }

  async ReGenerateProvisionalMerit_Hostel() {
    if(this.Searchrequest.Gender == 0 || this.Searchrequest.Gender == undefined || this.Searchrequest.Gender == null){
      this.toastr.warning("Please select gender.");
      return;
    }
    let selected = this.getSelectedItems();
    if (selected.length === 0) {
      this.toastr.warning("Please select student.");
      return;
    }

    selected.forEach(item => {
      item.modifyby = this.sSOLoginDataModel.UserID;
    });
    
    try {
      await this.studentRequestService.ReGenerateProvisionalMerit_Hostel(this.Searchrequest.Gender, selected)
      .then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success){
          this.toastr.success(data.Message);
          const selectedIds = selected.map(item => item.ReqId).join(',');
          const encrypted = CryptoJS.AES.encrypt(selectedIds, secretKey).toString();
          // this.routers.navigate(['/HostelMeritlist/HostelGenerateMeritlist'], {
          //   queryParams: { ids: encodeURIComponent(encrypted) }
          // });
          //this.routers.navigate(['/HostelMeritlist/HostelGenerateMeritlist'])
          window.location.reload();
        } else {
          this.toastr.error(data.ErrorMessage);
          this.toastr.warning(data.Message);
        }
      })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    console.log(selected);
  }
}
