import { Component } from '@angular/core';
//import { FormBuilder } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { HostelStudentSearchModel, StudentDataModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { DownloadMarksheetSearchModel, HostelWardenSomeDetailsModel } from '../../../Models/DownloadMarksheetDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-apply-for-hostel',
  standalone: false,
  templateUrl: './apply-for-hostel.component.html',
  styleUrl: './apply-for-hostel.component.css'
})
export class ApplyForHostelComponent {
  groupForm!: FormGroup;
  groupFormAffidavit!: FormGroup;
  public HostelID: number= 0;
  public isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  searchrequest = new DownloadMarksheetSearchModel();
  HostelWardenSomeDetails = new HostelWardenSomeDetailsModel();
  HostelDetails = new HostelStudentSearchModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new StudentDataModel()
  public searchRequest: any;
  public DistrictMasterList: any = [];
  public StudentDetailsList: any = [];
  public HostelDetailsList: any = [];
  public RoomPartnerDetailsList: any = [];
  public MarksDetailsList: any = [];
  public GetLastEndTermFY: any = [];
  public GetLastFY: any = [];
  RequestForRoomPartner: boolean = false;
  SearchRoomPartner: boolean = false;
  file!: File;
  public StudentID: number = 0;
  public ReqId: number = 0;
  public LastTerm1: string = '';
  public LastTerm2: string = '';
  public LastFY: string = '';
  public allotedhostellastendterm: boolean = false;

  _EnumRole = EnumRole;
  public isEditMode: boolean = true;
  //AnyKnownNearByCollegeHostel: boolean = false;

  groupFormHostelWardenRecheck!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _HostelManagmentService: HostelManagmentService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    this.groupForm = this.fb.group({
      txtFatherContactNo: ['', Validators.required],
      txtLocalGuardianName: [''],
      txtLocalGuardianContactNo: [''],
      txtAllotedHostelLastEndTerm: ['2'],
      txtAllotedHostelInLastSessionRoomNo: [''],
      txtAllotedHostelInLastSessionFeeDetails: [''],
      txtAnyWorningForShortOfAttendance: ['2'],
      txtAnyWarningForInvovementAgainstDiscipline: ['2'],
      txtPartnerApplicationID: [''],
      txtRequestForRoomPartner: [this.RequestForRoomPartner],
    });
    this.groupFormAffidavit = this.fb.group({
      txtAffidavitDocument: ['', Validators.required],
    });

    this.groupFormHostelWardenRecheck = this.fb.group({
      txtWFatherContactNo: ['', Validators.required],
      txtWLocalGuardianName: [''],
      txtWLocalGuardianContactNo: [''],
    });

    this.HostelID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    // this.ReqId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    
    
    await this.GetStudentDetailsForApply();
    await this.GetMarksDetails();
    await this.GetLastFYEndTerm();
    await this.GetAllData();

    if(this.HostelID > 0) {
      if(this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
        await this.EditData();
      }
    }
    

    if (this.HostelID > 0) {
      if (this.sSOLoginDataModel.RoleID == EnumRole.HostelWarden) {
        await this.EditDataAtWarden();
      }
    }
  }

  isRequestForRoomPartner(content: any) {
    
    this.RequestForRoomPartner = content;
    if (content == false) {
      this.groupForm.value.txtPartnerApplicationID = [''];
      this.SearchRoomPartner = false;

    }
    else
    {
      this.groupForm.value.txtPartnerApplicationID = [''];
    }
  }
  //async EditData() {
  //  debugger
  //  try {
  //    let obj = {
  //      //StudentID: this.sSOLoginDataModel.StudentID,
  //      DepartmentID: this.sSOLoginDataModel.DepartmentID,
  //      ReqId: this.HostelID,
  //      Action: "_StudentDetails_AtPrinciple"
  //    }
  //    await this._HostelManagmentService.GetStudentDetailsForHostel_Principle(obj)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));

  //        this.StudentDetailsList = data['Data'];

  //        this.groupForm.get('txtFatherContactNo')?.setValue(this.StudentDetailsList[0].FatherContactNo);
  //        this.groupForm.get('txtLocalGuardianName')?.setValue(this.StudentDetailsList[0].LocalGuardianName);
  //        this.groupForm.get('txtLocalGuardianContactNo')?.setValue(this.StudentDetailsList[0].LocalGuardianContactNo);

  //        console.log('edit data ==>', this.StudentDetailsList)
  //      }, error => console.error(error));
  //    //this.EditMarksDetails();
  //  }

  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //}






  async EditData() {
    debugger;
    try {
      let obj = {
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        ReqId: this.HostelID,
        Action: "_StudentDetails_AtPrinciple"
      };

      await this._HostelManagmentService.GetStudentDetailsForHostel_Principle(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentDetailsList = data['Data'];

          //  Set edit mode here
          if (this.StudentDetailsList.length > 0 && this.StudentDetailsList[0].AllotmentStatus === 1) {
            this.isEditMode = false;
          } else {
           
            this.isEditMode = true;
          }

          this.groupFormHostelWardenRecheck.get('txtFatherContactNo')?.setValue(this.StudentDetailsList[0].FatherContactNo);
          this.groupFormHostelWardenRecheck.get('txtLocalGuardianName')?.setValue(this.StudentDetailsList[0].LocalGuardianName);
          this.groupFormHostelWardenRecheck.get('txtLocalGuardianContactNo')?.setValue(this.StudentDetailsList[0].LocalGuardianContactNo);

          console.log('edit data ==>', this.StudentDetailsList);
          console.log('isEditMode ==>', this.isEditMode);
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }



  async EditDataAtWarden() {
    debugger;
    try {
      let obj = {
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        ReqId: this.HostelID,
        Action: "_StudentDetails_AtPrinciple"
      };

      await this._HostelManagmentService.GetStudentDetailsForHostel_Principle(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentDetailsList = data['Data'];

          //  Set edit mode here
          if (this.StudentDetailsList.length > 0 && this.StudentDetailsList[0].AllotmentStatus === 10) {
            this.isEditMode = false;
          } else {

            this.isEditMode = true;
          }

          if (this.StudentDetailsList?.length > 0) {
            const student = this.StudentDetailsList[0];
            this.HostelWardenSomeDetails.txtWFatherContactNo = student.FatherContactNo;
            this.HostelWardenSomeDetails.txtWLocalGuardianName = student.LocalGuardianName;
            this.HostelWardenSomeDetails.txtWLocalGuardianContactNo = student.LocalGuardianContactNo;
          }

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }



  async isallotedhostellastendterm() {
    if (this.groupForm.value.txtAllotedHostelLastEndTerm == 1) {
      this.allotedhostellastendterm = true;
    }
    else {
      this.allotedhostellastendterm = false;
    }
  }


  //async GetStudentDetailsForApply() {

  //  try {
  //    let obj = {
  //      StudentID: this.sSOLoginDataModel.StudentID,
  //      DepartmentID: this.sSOLoginDataModel.DepartmentID,
  //      Action: "_StudentDetails"
  //    }
  //    await this._HostelManagmentService.GetStudentDetailsForApply(obj)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.StudentDetailsList = data['Data'];
  //        console.log(this.StudentDetailsList,"lo")
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //}



  async GetStudentDetailsForApply() {
    try {
      let obj = {
        StudentID: this.sSOLoginDataModel.StudentID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Action: "_StudentDetails"
      };
      await this._HostelManagmentService.GetStudentDetailsForApply(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentDetailsList = data['Data'];

          //  Detect edit mode here based on ReqId
          if (this.StudentDetailsList.length > 0 && this.StudentDetailsList[0].ReqId > 0) {
            this.isEditMode = true;
          } else {
            this.isEditMode = false;
          }

          console.log("StudentDetailsList =>", this.StudentDetailsList);
          console.log("isEditMode =>", this.isEditMode);
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async SearchPartner() {
    try {
      
      //alert(this.searchRequest.PartnerApplicationID);
      if (this.groupForm.value.txtPartnerApplicationID !== 0 && this.groupForm.value.txtPartnerApplicationID !== null && this.groupForm.value.txtPartnerApplicationID !== undefined) {
        let obj = {
          PartnerApplicationID: this.groupForm.value.txtPartnerApplicationID,
          DepartmentID: this.sSOLoginDataModel.DepartmentID,
          Action: "_SearchPartner"
        }
        await this._HostelManagmentService.GetStudentDetailsForApply(obj)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
           // if (data['Data'].len)
            if (data['Data'].length > 0) {
              this.RoomPartnerDetailsList = data['Data'];
              this.SearchRoomPartner = true;
            }
            else {
              this.Message = "Please correct Student ID/That student is not alloted hostel yet";
              this.toastr.error(this.Message)
              this.SearchRoomPartner = false;
            }
            console.log(this.RoomPartnerDetailsList, "RoomPartnerDetailsList")
          }, error => console.error(error));
      }
      else {
        this.Message = "Please Enter Room Partner Application ID";
        this.toastr.error(this.Message)
      }

    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetMarksDetails() {
    try {
      let obj = {
        StudentID: this.sSOLoginDataModel.StudentID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Action: "_MarksDetails"
      }
      await this._HostelManagmentService.GetStudentDetailsForApply(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.MarksDetailsList = data['Data'];
          console.log('Marks Details List',this.MarksDetailsList)
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetLastFYEndTerm() {
    try {
      let obj = {
        EndTermID: this.sSOLoginDataModel.EndTermID,
        Action: "_getLastFYEndTerm"
      }
      await this._HostelManagmentService.GetLastFYEndTerm(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          this.LastTerm1 = data['Data'].Table[0]
          this.LastTerm2 = data['Data'].Table[1]
          this.LastFY = data['Data'].Table1[0]


          console.log(data['Data'].Table1[0], "data")
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async CancelRoomPartner() {
    
    this.SearchRoomPartner = false;
    this.RequestForRoomPartner = false;
    this.RoomPartnerDetailsList = [];
    this.searchRequest.PartnerApplicationID = 0;
    
  }



  async updateData() {
    debugger
    this.request.ReqId = this.StudentDetailsList[0].ReqId;
    this.request.StudentID = this.StudentDetailsList[0].StudentID
    this.request.HostelID = this.HostelID;
    this.request.EndTermId = this.sSOLoginDataModel.EndTermID;
    this.request.FatherContactNo = this.groupForm.value.txtFatherContactNo;
    this.request.LocalGuardianName = this.groupForm.value.txtLocalGuardianName;
    this.request.LocalGuardianContactNo = this.groupForm.value.txtLocalGuardianContactNo;
    this.request.AllotedHostelLastEndTerm = this.groupForm.value.txtAllotedHostelLastEndTerm;
    this.request.AllotedHostelInLastSessionRoomNo = this.groupForm.value.txtAllotedHostelInLastSessionRoomNo;
    this.request.AllotedHostelInLastSessionFeeDetails = this.groupForm.value.txtAllotedHostelInLastSessionFeeDetails;
    this.request.AnyWorningForShortOfAttendance = this.groupForm.value.txtAnyWorningForShortOfAttendance;
    this.request.AnyWarningForInvovementAgainstDiscipline = this.groupForm.value.txtAnyWarningForInvovementAgainstDiscipline;
    this.request.TotalAvg = this.StudentDetailsList[0].TotalAvg;



    if (this.request.LocalGuardianName == '') {
      this.request.LocalGuardianName = 'No';
    }
    if (this.request.LocalGuardianContactNo == '') {
      this.request.LocalGuardianContactNo = 'No';
    }
    if (this.groupForm.value.txtAllotedHostelInLastSessionRoomNo == '') {
      this.request.AllotedHostelInLastSessionRoomNo = 0;
    }
    if (this.groupForm.value.txtAllotedHostelInLastSessionRoomNo == '') {
      this.request.AllotedHostelInLastSessionRoomNo = 0;
    }
    if (this.groupForm.value.txtAllotedHostelInLastSessionFeeDetails == '') {
      this.request.AllotedHostelInLastSessionFeeDetails = 0;
    }



    this.isSubmitted = true;

    if (this.groupForm.invalid) {
      return;
    }
    try {
      if (this.RequestForRoomPartner === true) {
        if (this.RoomPartnerDetailsList && this.RoomPartnerDetailsList.length > 0) {

          this.request.PartnerApplicationID = this.groupForm.value.txtPartnerApplicationID;
          this.request.RoomPartnerName = this.RoomPartnerDetailsList[0]?.StudentName;
          this.request.RoomPartnerBranch = this.RoomPartnerDetailsList[0]?.BranchName;
          this.request.RoomPartnerRegular = this.RoomPartnerDetailsList[0]?.Regular;
          this.request.RoomPartnerSFS = this.RoomPartnerDetailsList[0]?.SFS;
          this.request.RoomPartnerYear = this.RoomPartnerDetailsList[0]?.YearNo;
        }
        else {
          this.Message = "Please Enter Room Partner Application ID";
          this.toastr.error(this.Message);
          return;
        }
      }
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      //alert(this.request.DepartmentID)

      console.log(this.request, "Data Insert");
      debugger
      //return;
      await this._HostelManagmentService.EditStudentApplyHostel(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];


          if (this.State === EnumStatus.Success) {
            this.ResetControl();
            setTimeout(() => {
              this.toastr.success(this.Message);
              this.ResetControl();
              this.router.navigate(['/objectionwindow']);
              //window.location.reload()
            }, 200);
          } else if (this.State === EnumStatus.Warning) {
            this.toastr.warning(this.Message);
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        });


    } catch (ex) {
      console.log(ex);
    }
  }


  async HostelWardenupdateData() {
    debugger
    this.request.ReqId = this.StudentDetailsList[0].ReqId;
    this.request.StudentID = this.StudentDetailsList[0].StudentID
    this.request.HostelID = this.HostelID;
    this.request.EndTermId = this.sSOLoginDataModel.EndTermID;
    this.request.FatherContactNo = this.groupFormHostelWardenRecheck.value.txtWFatherContactNo;
    this.request.LocalGuardianName = this.groupFormHostelWardenRecheck.value.txtWLocalGuardianName;
    this.request.LocalGuardianContactNo = this.groupFormHostelWardenRecheck.value.txtWLocalGuardianContactNo;
    this.request.AllotedHostelLastEndTerm = this.groupFormHostelWardenRecheck.value.txtAllotedHostelLastEndTerm;
    

    if (this.request.LocalGuardianName == '') {
      this.request.LocalGuardianName = 'No';
    }
    if (this.request.LocalGuardianContactNo == '') {
      this.request.LocalGuardianContactNo = 'No';
    }
   
    this.isSubmitted = true;

    try {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      console.log(this.request, "Data Insert");
      debugger
      //return;
      await this._HostelManagmentService.HostelWardenupdateData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];


          if (this.State === EnumStatus.Success) {
            this.ResetControl();
            setTimeout(() => {
              this.toastr.success(this.Message);
              this.ResetControl();
              this.router.navigate(['/objectionwindow']);
              //window.location.reload()
            }, 200);
          } else if (this.State === EnumStatus.Warning) {
            this.toastr.warning(this.Message);
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        });


    } catch (ex) {
      console.log(ex);
    }
  }


  async saveData() {
    debugger
    this.request.StudentID = this.sSOLoginDataModel.StudentID;
    this.request.HostelID = this.HostelID;
    this.request.EndTermId = this.sSOLoginDataModel.EndTermID;
    this.request.FatherContactNo = this.groupForm.value.txtFatherContactNo;
    this.request.LocalGuardianName = this.groupForm.value.txtLocalGuardianName;
    this.request.LocalGuardianContactNo = this.groupForm.value.txtLocalGuardianContactNo;
    this.request.AllotedHostelLastEndTerm = this.groupForm.value.txtAllotedHostelLastEndTerm;
    this.request.AllotedHostelInLastSessionRoomNo = this.groupForm.value.txtAllotedHostelInLastSessionRoomNo;
    this.request.AllotedHostelInLastSessionFeeDetails = this.groupForm.value.txtAllotedHostelInLastSessionFeeDetails;
    this.request.AnyWorningForShortOfAttendance = this.groupForm.value.txtAnyWorningForShortOfAttendance;
    this.request.AnyWarningForInvovementAgainstDiscipline = this.groupForm.value.txtAnyWarningForInvovementAgainstDiscipline;
    this.request.TotalAvg = this.MarksDetailsList[0].TotalAvg;
    


    if (this.request.LocalGuardianName == '') {
      this.request.LocalGuardianName = 'No';
    }
    if (this.request.LocalGuardianContactNo == '') {
      this.request.LocalGuardianContactNo = 'No';
    }
    if (this.groupForm.value.txtAllotedHostelInLastSessionRoomNo == '') {
      this.request.AllotedHostelInLastSessionRoomNo = 0;
    }
    if (this.groupForm.value.txtAllotedHostelInLastSessionRoomNo == '') {
      this.request.AllotedHostelInLastSessionRoomNo = 0;
    }
    if (this.groupForm.value.txtAllotedHostelInLastSessionFeeDetails == '') {
      this.request.AllotedHostelInLastSessionFeeDetails = 0;
    }



    this.isSubmitted = true;

    if (this.groupForm.invalid) {
      return;
    }
    try {
      if (this.RequestForRoomPartner === true) {
        if (this.RoomPartnerDetailsList && this.RoomPartnerDetailsList.length > 0) {

          this.request.PartnerApplicationID = this.groupForm.value.txtPartnerApplicationID;
          this.request.RoomPartnerName = this.RoomPartnerDetailsList[0]?.StudentName;
          this.request.RoomPartnerBranch = this.RoomPartnerDetailsList[0]?.BranchName;
          this.request.RoomPartnerRegular = this.RoomPartnerDetailsList[0]?.Regular;
          this.request.RoomPartnerSFS = this.RoomPartnerDetailsList[0]?.SFS;
          this.request.RoomPartnerYear = this.RoomPartnerDetailsList[0]?.YearNo;
        }
        else {
          this.Message = "Please Enter Room Partner Application ID";
          this.toastr.error(this.Message);
          return;
        }
      }
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      //alert(this.request.DepartmentID)

      console.log(this.request, "Data Insert");
      //return;
      await this._HostelManagmentService.StudentApplyHostel(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State === EnumStatus.Success) {
            this.ResetControl();
            setTimeout(() => {
              this.toastr.success(this.Message);
              this.ResetControl();
              //this.router.navigate(['/ApplyForHostel']);
              window.location.reload()
            }, 200);
          } else if (this.State === EnumStatus.Warning) {
            this.toastr.warning(this.Message);
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        });

    } catch (ex) {
      console.log(ex);
    }
  }


  async ResetControl() {
    this.isSubmitted = false;
    this.request = new StudentDataModel
    this.groupForm.reset();
    this.groupForm.patchValue({

    });
  }


  //async onFilechange(event: any, Type: string) {
  //  try {

  //    this.file = event.target.files[0];
  //    if (this.file) {
  //      if (this.file.type == 'application/pdf') {
  //        //size validation
  //        if (this.file.size > 5000000) {
  //          this.toastr.error('Select less then 2MB File')
  //          return
  //        }
  //      }
  //      else {// type validation
  //        this.toastr.error('Select Only PDF file')
  //        return
  //      }

  //      await this.commonFunctionService.UploadDocument(this.file)
  //        .then((data: any) => {
  //          data = JSON.parse(JSON.stringify(data));

  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];
  //          debugger
  //          if (this.State == EnumStatus.Success) {
  //            if (Type == "Document") {
  //              this.request.dis_AffidavitDocument = data['Data'][0]["Dis_FileName"];
  //              this.request.AffidavitDocument = data['Data'][0]["FileName"];

  //            }
  //            if (Type == "SupportingDocument") {
  //              this.request.dis_SupportingDocument = data['Data'][0]["Dis_FileName"];
  //              this.request.SupportingDocument = data['Data'][0]["FileName"];

  //            }
  //            event.target.value = null;
  //          }
  //          if (this.State == EnumStatus.Error) {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //          else if (this.State == EnumStatus.Warning) {
  //            this.toastr.warning(this.ErrorMessage)
  //          }

  //        });
  //    }
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //}


  async onFilechange(event: any, Type: string) {
    try {
      debugger
      this.file = event.target.files[0];

      if (this.file) {
        if (this.file.size > 5 * 1024 * 1024) {
          this.toastr.error('Please select a file smaller than 5MB.');
          return;
        }

        const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
        const fileExtension = this.file.name?.split('.').pop()?.toLowerCase() || '';
        if (!allowedExtensions.includes(fileExtension)) {
          this.toastr.error('Invalid file type. Allowed: PDF, DOC, JPG, PNG, XLS, etc.');
          return;
        }

        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State === EnumStatus.Success) {
              if (Type === "Document") {
                this.request.dis_AffidavitDocument = data['Data'][0]["Dis_FileName"];
                this.request.AffidavitDocument = data['Data'][0]["FileName"];
              }

              if (Type === "SupportingDocument") {
                this.request.dis_SupportingDocument = data['Data'][0]["Dis_FileName"];
                this.request.SupportingDocument = data['Data'][0]["FileName"];
              }

              event.target.value = null;
            }

            if (this.State === EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage);
            } else if (this.State === EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.error(Ex);
    }
  }





  //onFilechange(event: any, type: string): void {
  //  const file = event.target.files[0];
  //  if (!file) return;

  //  const fileName = file.name;

  //  if (type === 'SupportingDocument') {
  //    this.request.SupportingDocument = fileName;
  //    this.request.dis_SupportingDocument = fileName;
  //  }

  //  if (type === 'AffidavitDocument') {
  //    this.request.AffidavitDocument = fileName;
  //    this.request.dis_AffidavitDocument = fileName;
  //  }

  //  console.log(`${type} file selected:`, fileName);
  //}





  async DeleteImage(FileName: any, Type: string) {
    try {
      // delete from server folder
      await this.commonFunctionService.DeleteDocument(FileName).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == "Document") {
            this.request.AffidavitDocument = '';
            this.request.dis_AffidavitDocument = '';
          }
          if (Type == "Document") {
            this.request.SupportingDocument = '';
            this.request.dis_SupportingDocument = '';
          }
          this.toastr.success(this.Message)
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async UpdateAffidavit() {
    this.request.StudentID = this.sSOLoginDataModel.StudentID;
    this.request.ReqId = this.StudentDetailsList[0]?.ReqId;
    this.isSubmitted = true;
    if (this.groupFormAffidavit.invalid) {
      return;
    }
    try {
      //return;
      await this._HostelManagmentService.StudentApplyHostel(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State === EnumStatus.Success) {
            this.ResetControl();
            setTimeout(() => {
              this.toastr.success(this.Message);
              this.GetStudentDetailsForApply();
              this.ResetControl();
              window.location.reload()
            }, 200);
          } else if (this.State === EnumStatus.Warning) {
            this.toastr.warning(this.Message);
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        });

    } catch (ex) {
      console.log(ex);
    }
  }



  async DownloadHostelForm(id: any) {
    try {

      this.loaderService.requestStarted();
      this.searchrequest.StudentID = this.sSOLoginDataModel.StudentID;
      this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchrequest.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng;
      await this.reportService.DownloadHostelAffidavit(this.searchrequest)
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

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  async GetAllData() {
    try {

      this.HostelDetails.InstituteID = this.sSOLoginDataModel.InstituteID;
      //this.Searchrequest.InstituteID = 9;
      //this.Searchrequest.HostelID = 2;
      this.HostelDetails.HostelID = this.sSOLoginDataModel.HostelID;
      this.HostelDetails.StudentID = this.sSOLoginDataModel.StudentID;
      this.HostelDetails.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();
      await this._HostelManagmentService.GetAllotedHostelDetails(this.HostelDetails)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HostelDetailsList = data['Data'];

          console.log('Hostel Dstudent Details List',this.HostelDetailsList)
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
}

