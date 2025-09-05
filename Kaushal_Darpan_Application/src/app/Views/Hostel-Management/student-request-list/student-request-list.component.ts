import { Component } from '@angular/core';
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
import { EnumStatus } from '../../../Common/GlobalConstants';
import { RoomAllotmentDataModel } from '../../../Models/Hostel-Management/RoomAllotmentDataModel';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-student-request-list',
  standalone: false,
  
  templateUrl: './student-request-list.component.html',
  styleUrl: './student-request-list.component.css'
})
export class StudentRequestListComponent {
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
  public Allotmentrequest = new RoomAllotmentDataModel();
  public titleDDLBranchTrade: string =''
  public status: number = 0


  constructor(
    private toastr: ToastrService,
    private studentRequestService: StudentRequestService,
    private commonFunctionService: CommonFunctionService,
    private _HostelManagmentService: HostelManagmentService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal) { }


  async ngOnInit() {
    this.ReqId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.status = Number(this.activatedRoute.snapshot.queryParamMap.get('status')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;

    if (this.sSOLoginDataModel.DepartmentID == 1) {
      this.titleDDLBranchTrade='Branch'
    }
    else if (this.sSOLoginDataModel.DepartmentID == 2) {
      this.titleDDLBranchTrade = 'Trade'
    }

    if(this.status) {
      this.Searchrequest.status = this.status
    }


    this.RequestFormGroup = this.formBuilder.group({
      StudentName: [''], 
      ClassPercentage: [''], 
      StreamName: [''] 
    });

    this.CancelRequestFormGroup = this.formBuilder.group({
      remark: ['', Validators.required],
    });

    await this.GetAllData();
    await this.GetBranchMaster();
    await this.GetSemesterMaster();
    await this.GetMarksDetails();
    
  }
  get _RequestFormGroup() { return this.RequestFormGroup.controls; }
  get _CancelRequestFormGroup() { return this.CancelRequestFormGroup.controls; }

  async GetAllData() {
    try {

      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      //this.Searchrequest.InstituteID = 9;
      //this.Searchrequest.HostelID = 2;
      this.Searchrequest.HostelID = this.sSOLoginDataModel.HostelID;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();
      await this.studentRequestService.GetAllData(this.Searchrequest)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentReqListList = data['Data'];

          console.log(this.StudentReqListList)
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
  

  async GetMarksDetails() {
    try {
      let obj = {
        StudentID: 7,
        Action: "_MarksDetails",
        DepartmentID: this.sSOLoginDataModel.DepartmentID
      }
      await this._HostelManagmentService.GetStudentDetailsForApply(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.MarksDetailsList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async onView(model: any, studentData: any) {
    try {
      this.ViewRequest = { ...studentData };
      this.RequestFormGroup.patchValue({
        StudentName: this.ViewRequest.StudentName,
        ClassPercentage: this.ViewRequest.ClassPercentage,
        StreamName: this.ViewRequest.StreamName
      });
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
                  this.GetAllData()
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
            this.GetAllData();
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


  exportToExcel(): void {
    const unwantedColumns = ['InstituteId', 'InstituteId',	'ApplicationId',	'StudentId'	,'SemesterId'	,'AllotmentStatus'	,'BrachId'	,'AllotmentStatus1'	,'EndTermID'
];
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
}
