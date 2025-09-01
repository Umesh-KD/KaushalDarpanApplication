import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ITINodalOfficerExminerReportService } from '../../../Services/ITI/ITINodalOfficerExminerReport/ITINodalOfficerExminerReport.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumRole, EnumStatus, EnumProfileStatus, EnumDepartment, EnumStatusOfStaff } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ITIInspectExaminationCenters, ITINodalOfficerExminerForm, ITINodalOfficerExminerSearch } from '../../../Models/ITI/ITINodalOfficerExminerReportModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { DocumentDetailsService } from '../../../Common/document-details';
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { DeferBlockBehavior } from '@angular/core/testing';




@Component({
  selector: 'app-nodal-officer-exminer-report',
  standalone: false,
  templateUrl: './nodal-officer-exminer-report.component.html',
  styleUrl: './nodal-officer-exminer-report.component.css'
})

export class NodalOfficerExminerReportComponent implements OnInit {
  public AddNodalOfficerExminerFromGroup!: FormGroup;
  public formData = new ITINodalOfficerExminerForm();
  public InspectExaminationCentersData = new ITIInspectExaminationCenters();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public isSubmitted: boolean = false;
  public isDetailsOfCoordinator: boolean = false;
  public isInspectTheExaminationCenters: boolean = false;
  public isAdditionalDetails: boolean = false;
  public ExamCenterList: any = [];
  public NameOfExaminationCentreList: any = [];
  public InspectExaminationCentersList: ITIInspectExaminationCenters[] = [];
  public CheckDate: string = '';
  public MaxDate: string = '';
  public MinDate: string = '';
 
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public DdlType: string = '';
  documentDetails: DocumentDetailsModel[] = [];
  UploadedPaperFileName = '';
  UploadedFileName = '';
  public searchRequest = new ITINodalOfficerExminerSearch();

  constructor(private commonMasterService: CommonFunctionService, private ITINodalOfficerExminerReportService: ITINodalOfficerExminerReportService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService, private documentDetailsService: DocumentDetailsService, private commonFunctionService: CommonFunctionService
  ) {

  }



  async ngOnInit() {

    this.AddNodalOfficerExminerFromGroup = this.formBuilder.group({


      //txtPincode: [{ value: '', disabled: true }],
      //ddlStateID: ['', [DropdownValidators]],

  /*    ddlExamCenterUnderYourAreaID: [''],*/
      /*   txtMediumQuestionPaperSent: [''],*/
      txtDate: ['', Validators.required],
      txtToDate: ['', Validators.required],
      RadioInspectTheExaminationCenters: [''],
      RadioCoordinatorReachOnTime: [''],
      RadioDetailsOfCoordinator: [''],
      txtCoordinatorNotReached: ['', [DropdownValidators]],
      ddlNameOfExaminationCentreID: ['' ],
      txtReason: ['', Validators.required],
      txtDateAndTimeOfInspection: ['' ],
      txtTotalNumberOfCandidatesEnrolled: [ Validators.pattern(/^\d*$/),  Validators.maxLength(10) ],
      txtCandidatesHadLeftAfterCompletingTheExam: [''],
      txtJobsCreated: [''],
      txtJobsBeingCreated: [''],
      RadioVivaConducted: [''],
      RadioLineDiagramPrepared: [''],
      RadioReadingTaken: [''],
      RadioAdditionalDetails: [''],
      RadioExamSmooth: [''],
      RadioDocumentsSubmitted: [''],
      RadioExamIncident: [''],
      txtExamRemarks: ['', Validators.required],
      txtFutureCentreRemarks: ['', Validators.required],
      txtFutureExamSuggestions: ['', Validators.required ],
      SUpload: [''],

      //SDfile: new FormControl('', [ ]) ,
      //UploadDocumentfile: new FormControl('', [ ])


    })

 
    this.isDetailsOfCoordinator = false;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    if (this.sSOLoginDataModel.RoleID != 224) {
      this.AddNodalOfficerExminerFromGroup.disable()
    }
    this.GetExamCenterList();
    this.GetDateTimeTable()



    this.CheckDate = this.activatedRoute.snapshot.queryParamMap.get('ExamDateTime') ?? '';
    this.searchRequest.ID = Number(this.activatedRoute.snapshot.queryParamMap.get('ExamDateTime') ?? 0);

    //if (this.CheckDate !='')
    //{
    await this.GetNodalCenter();
    if (this.searchRequest.ID > 0) {
      this.GetNodalReport(this.searchRequest.ID)
    }
 

/*    }*/

  }
  get _AddNodalOfficerExminerFromGroup() { return this.AddNodalOfficerExminerFromGroup.controls; }
  get SDfileControl() {
    return this.AddNodalOfficerExminerFromGroup.get('SDfile');
  }
  get UploadDocfileControl() {
    return this.AddNodalOfficerExminerFromGroup.get('UploadDocumentfile');
  }


  async GetExamCenterList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      this.DdlType = 'ExamCenterUnderYourArea';
      await this.commonMasterService.AllDDlCenterMaster(this.DdlType)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamCenterList = data['Data'];
          console.log(this.ExamCenterList, "ExamCenterList")
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



  //async GetNameOfExamCenterList() {

  //  try {
  //    this.loaderService.requestStarted();
  //    this.DdlType = 'NameOfExaminationCentre';
  //    await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.DdlType)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.NameOfExaminationCentreList = data['Data'];
  //        console.log(this.NameOfExaminationCentreList, "NameOfExaminationCentre")
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  async GetDateTimeTable() {

    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetCommonMasterData('TimeTableDate', this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger
          const ExamDate = new Date(data['Data'][0]['MaxDate']);
          const year = ExamDate.getFullYear();
          const month = String(ExamDate.getMonth() + 1).padStart(2, '0');
          const day = String(ExamDate.getDate()).padStart(2, '0');
          this.MaxDate = `${year}-${month}-${day}`;


          const MinDate = new Date(data['Data'][0]['MinDate']);
          const year1 = MinDate.getFullYear();
          const month1 = String(MinDate.getMonth() + 1).padStart(2, '0');
          const day1 = String(MinDate.getDate()).padStart(2, '0');
          this.MinDate = `${year1}-${month1}-${day1}`;

   
       
          console.log(this.MaxDate)
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


  async GetNodalCenter() {

    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetNodalExamCenterDistrict(this.sSOLoginDataModel.DistrictID, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.NameOfExaminationCentreList = data['Data'];
          console.log(this.NameOfExaminationCentreList)
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



  async GetNodalReport(Id:number) {


    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();  

      //this.searchRequest.ID = ID;
      this.searchRequest.ID = Id

      await this.ITINodalOfficerExminerReportService.ITINodalOfficerExminerReport_GetDataByID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          debugger
          this.formData.ExamCenterUnderYourAreaID = data['Data']['ITINodalOfficerExminerReports']['ExamCenterUnderYourAreaID'];
          this.formData.ID = data['Data']['ITINodalOfficerExminerReports']['ID'];
          this.formData.MediumQuestionPaperSent = data['Data']['ITINodalOfficerExminerReports']['MediumQuestionPaperSent'];
          this.formData.Date = data['Data']['ITINodalOfficerExminerReports']['Date'];
          this.formData.CoordinatorReachOnTime = data['Data']['ITINodalOfficerExminerReports']['CoordinatorReachOnTime'];
          this.formData.CoordinatorNotReached = data['Data']['ITINodalOfficerExminerReports']['CoordinatorNotReached'];
          this.formData.Reason = data['Data']['ITINodalOfficerExminerReports']['Reason'];
          this.formData.AdditionalDetails = data['Data']['ITINodalOfficerExminerReports']['AdditionalDetails'];
          this.formData.ExamSmooth = data['Data']['ITINodalOfficerExminerReports']['ExamSmooth'];
          this.formData.DocumentsSubmitted = data['Data']['ITINodalOfficerExminerReports']['DocumentsSubmitted'];
          this.formData.ExamIncident = data['Data']['ITINodalOfficerExminerReports']['ExamIncident'];
          this.formData.ExamRemarks = data['Data']['ITINodalOfficerExminerReports']['ExamRemarks'];
          this.formData.FutureCentreRemarks = data['Data']['ITINodalOfficerExminerReports']['FutureCentreRemarks'];
          this.formData.FutureExamSuggestions = data['Data']['ITINodalOfficerExminerReports']['FutureExamSuggestions'];
          this.formData.InspectTheExaminationCenters = data['Data']['ITINodalOfficerExminerReports']['InspectTheExaminationCenters'];
          this.formData.ToDate = data['Data']['ITINodalOfficerExminerReports']['ToDate'];

          if (this.formData.InspectTheExaminationCenters)
          {
            this.isInspectTheExaminationCenters = true;
          }

          if (!this.formData.CoordinatorReachOnTime) {
            this.isDetailsOfCoordinator = false;
          }
          if (this.formData.AdditionalDetails) {
            this.isAdditionalDetails = true;
          }
          this.UploadedPaperFileName = data['Data']['ITINodalOfficerExminerReports']['SupportingDocument_fileName'];
          this.UploadedFileName = data['Data']['ITINodalOfficerExminerReports']['UploadDocument_fileName'];
          this.formData.SupportingDocument_file = data['Data']['ITINodalOfficerExminerReports']['SupportingDocument_file'];
          this.formData.UploadDocument_file = data['Data']['ITINodalOfficerExminerReports']['UploadDocument_fileName'];
          this.InspectExaminationCentersList = data['Data']['InspectExaminationCentersList'];
          this.formData.SupportingDocument_file = data['Data']['ITINodalOfficerExminerReports']['SupportingDocument_file'];
          this.formData.UploadDocument_fileName = data['Data']['ITINodalOfficerExminerReports']['UploadDocument_fileName'];
        

      /*    this.GetNodalCenter()*/
          this.CoordinatorReachOnTimeCondition()
          //this.formData.DateofPostingEmp = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['DateofPostingEmp'])
             


          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async GetNodalReport1(Id: number) {


    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();

      //this.searchRequest.ID = ID;
      this.searchRequest.ID = Id

      await this.ITINodalOfficerExminerReportService.ITINodalOfficerExminerReport_GetDataByID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          debugger


          this.InspectExaminationCentersList = data['Data']['InspectExaminationCentersList'];

          //this.formData.DateofPostingEmp = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['DateofPostingEmp'])



          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }



  async GetNodalReportDetails(ID: number) {

    
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();

    

      await this.ITINodalOfficerExminerReportService.ITINodalOfficerExminerReportDetails_GetByID(ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.InspectExaminationCentersData.NameOfExaminationCentreID = data['Data']['NameOfExaminationCentreID'];
          this.InspectExaminationCentersData.DateAndTimeOfInspection = data['Data']['DateAndTimeOfInspection'];
          this.InspectExaminationCentersData.CandidatesHadLeftAfterCompletingTheExam = data['Data']['CandidatesHadLeftAfterCompletingTheExam'];
          this.InspectExaminationCentersData.JobsBeingCreated = data['Data']['JobsBeingCreated'];
          this.InspectExaminationCentersData.JobsCreated = data['Data']['JobsCreated'];
          this.InspectExaminationCentersData.LineDiagramPrepared = data['Data']['LineDiagramPrepared'];
          this.InspectExaminationCentersData.ReadingTaken = data['Data']['ReadingTaken'];
          this.InspectExaminationCentersData.TotalNumberOfCandidatesEnrolled = data['Data']['TotalNumberOfCandidatesEnrolled'];
          this.InspectExaminationCentersData.VivaConducted = data['Data']['VivaConducted'];   
          this.InspectExaminationCentersData.ID = data['Data']['ID'];  
       
          //this.formData.DateofPostingEmp = this.dateSetter(data['Data']['iTIGovtEMStaffPersonalDetails']['DateofPostingEmp'])



          const btnSave = document.getElementById('btnAdd')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }




  CoordinatorReachOnTimeCondition() {

    if (this.formData.CoordinatorReachOnTime) {
      this.isDetailsOfCoordinator = true;
    }
    else {
      this.isDetailsOfCoordinator = false;
    }
  }

  InspectTheExaminationCentersCondition() {
    if (this.formData.InspectTheExaminationCenters) {
      this.isInspectTheExaminationCenters = true;
    }
    else {
      this.isInspectTheExaminationCenters = false;
    }
  }
  AdditionalDetailsCondition() {
    debugger
    if (this.formData.AdditionalDetails) {
      this.isAdditionalDetails = true;
    }
    else {
      this.isAdditionalDetails = false;
    }
  }






  async AddInspectExaminationCenters() {
    debugger;

    this.isSubmitted = true;
    // If the form is invalid, return early
    //if (this.AddStaffBasicDetailFromGroup.invalid) {
    //  return;
    //}




    if (this.InspectExaminationCentersData.ID>0) {
      this.DetailsUpdateData();
      return;
    }





    if (this.InspectExaminationCentersData.NameOfExaminationCentreID === 0) {
      this.toastr.error('कृपया परीक्षा केन्द्र का नाम चुनें.');
      return;
    }

    if (this.InspectExaminationCentersData.DateAndTimeOfInspection === "") {
      this.toastr.error('कृपया निरीक्षण का दिनांक व समय भरें.');
      return;
    }
    if (String(this.InspectExaminationCentersData.TotalNumberOfCandidatesEnrolled) === "" || this.InspectExaminationCentersData.TotalNumberOfCandidatesEnrolled === null) {
      this.toastr.error('कृपया कुल कितने परीक्षार्थी नामांकित थे भरें.');
      return;
    }

    if (String(this.InspectExaminationCentersData.CandidatesHadLeftAfterCompletingTheExam) === "" || this.InspectExaminationCentersData.CandidatesHadLeftAfterCompletingTheExam === null) {
      this.toastr.error('कृपया निरीक्षण के समय कितने परीक्षार्थी परीक्षा देकर घर जा चुके थे भरें.');
      return;
    }

    if (String(this.InspectExaminationCentersData.JobsCreated) === "" || this.InspectExaminationCentersData.JobsCreated === null) {
      this.toastr.error('कृपया जॉब कितने बनाये गये थे भरें.');
      return;
    }

    if (String(this.InspectExaminationCentersData.JobsBeingCreated) === "" || this.InspectExaminationCentersData.JobsBeingCreated === null) {
      this.toastr.error('कृपया जॉब कितने बनाये जा रहे थे भरें.');
      return;
    }



    // Check for duplicate deployment dates in the AddedDeploymentList



    const isDuplicate = this.InspectExaminationCentersList.some((element: any) =>
      this.InspectExaminationCentersData.NameOfExaminationCentreID === element.NameOfExaminationCentreID
      //&&
      //this.promotionData.PostID === element.PostID &&
      //this.promotionData.Business === element.Business
    );

    if (isDuplicate) {
      this.toastr.error('परीक्षा केन्द्रों का निरीक्षण (नाम पहले से दर्ज है).');
      return;
    } else {
      // Adding office and post names from the respective lists
    
      this.InspectExaminationCentersData.NameOfExaminationCentre = this.NameOfExaminationCentreList.find((x: any) => x.ID == this.InspectExaminationCentersData.NameOfExaminationCentreID)?.Name;


      // Push the deployment data into the AddedDeploymentList
      this.InspectExaminationCentersList.push({ ...this.InspectExaminationCentersData });

      // Reset the deployment request object to clear the form fields
      this.InspectExaminationCentersData = new ITIInspectExaminationCenters();

      // After adding, reset some form values if needed
      this.isSubmitted = false;
    }
  }


  async DeleteRow(item: ITIInspectExaminationCenters) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          if (item.ID > 0) {
            try {
              //Show Loading
              this.InspectExaminationCentersData.ID = item.ID;
              this.InspectExaminationCentersData.ModifyBy = this.sSOLoginDataModel.UserID;
              this.loaderService.requestStarted();
              /*     alert(isParent)*/
              await this.ITINodalOfficerExminerReportService.ITINodalOfficerExminerReportDetailsDelete(this.InspectExaminationCentersData).then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State === EnumStatus.Success) {
                  this.toastr.success(data.Message);
                  this.InspectExaminationCentersData = new ITIInspectExaminationCenters();
                  this.GetNodalReport(this.searchRequest.ID);
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

          else {
            const index: number = this.InspectExaminationCentersList.indexOf(item);
            if (index != -1) {
              this.InspectExaminationCentersList.splice(index, 1)
              this.toastr.success("Deleted sucessfully")
            }
          }

        }

      });

  }

  










  dateSetter(date: any) {
    const Dateformat = new Date(date);
    const year = Dateformat.getFullYear();
    const month = String(Dateformat.getMonth() + 1).padStart(2, '0');
    const day = String(Dateformat.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }







  async SaveData() {


/*    this.formData.ID = this.CheckDate;*/
    this.formData.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.formData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.formData.CreatedBy = this.sSOLoginDataModel.UserID;
    this.formData.ExamCenterUnderYourAreaID = this.sSOLoginDataModel.DistrictID;
/*    this.formData.Date = this.CheckDate*/

    //if (this.InspectExaminationCentersList.length == 0) {
    //  this.toastr.error("कृपया परीक्षा केन्द्र का नाम चुनें.");
    //  return;
    //}

    //this.AddedZonalList.forEach((element: any) => {

    //  element.CreatedBy = this.sSOLoginDataModel.UserID;
    //  element.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    //  element.DepartmentID = this.sSOLoginDataModel.DepartmentID;

    //})
    this.RefereshValidators()
    try {
      this.isSubmitted = true;
      if (this.AddNodalOfficerExminerFromGroup.invalid) {
        return
      }
      this.loaderService.requestStarted();
      this.formData.InspectExaminationCentersList = this.InspectExaminationCentersList;
      await this.ITINodalOfficerExminerReportService.ITINodalOfficerExminerReportSave(this.formData).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.InspectExaminationCentersList = [];
          this.formData = new ITINodalOfficerExminerForm();
          this.UploadedFileName = '';
          this.UploadedPaperFileName = '';
          this.routers.navigate(['/nodal-officer-exminer-report-list']);
        }
        else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);

        }
        else {
          this.toastr.error(data.ErrorMessage);
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


  async DetailsUpdateData() {

    try {
      this.isSubmitted = true;
      this.InspectExaminationCentersData.ModifyBy = this.sSOLoginDataModel.UserID;
      //if (this.InspectExaminationCentersData.invalid) {
      //  return
      //}
      this.loaderService.requestStarted();
      this.formData.InspectExaminationCentersList = this.InspectExaminationCentersList;
      await this.ITINodalOfficerExminerReportService.ITINodalOfficerExminerReportDetailsUpdate(this.InspectExaminationCentersData).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);         
          this.InspectExaminationCentersData = new ITIInspectExaminationCenters();

          this.GetNodalReport1(this.searchRequest.ID)

 /*         this.GetNodalReport(this.CheckID);*/
          const btnSave = document.getElementById('btnAdd')
          if (btnSave) btnSave.innerHTML = "Add";
        }
        else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);

        }
        else {
          this.toastr.error(data.ErrorMessage);
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



  ResetControl() {
    this.isSubmitted = false;
    this.formData = new ITINodalOfficerExminerForm();
    this.InspectExaminationCentersList = [];
    this.UploadedFileName = '';
    this.UploadedPaperFileName = '';
    //this.GetExamCenterList();
  }


  //Upload Paper by Professor  
  public file!: File;

  async onFilechange(event: any) {
    try {


      this.file = event.target.files[0];
      if (this.file) {

        if (this.file.size > 2000000) {
          this.toastr.error('Select less than 2MB File');
          return;
        }
        // Type validation


        //upload model
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = this.file.type ?? "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "ITINodalOfficerExminerReport";

        //Upload to server folder
        await this.commonFunctionService.UploadDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {

              const fileName = data['Data'][0]["Dis_FileName"];
              const actualFile = data['Data'][0]["FileName"];

              this.formData.SupportingDocument_fileName = data['Data'][0]["FileName"];
              this.UploadedPaperFileName = this.formData.SupportingDocument_fileName;
              this.formData.SupportingDocument_file = fileName;
            }

            if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);

            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async onFilechangeUpload(event: any) {
    try {


      this.file = event.target.files[0];
      if (this.file) {

        if (this.file.size > 2000000) {
          this.toastr.error('Select less than 2MB File');
          return;
        }
        // Type validation


        //upload model
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = this.file.type ?? "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "ITINodalOfficerExminerReport";

        //Upload to server folder
        await this.commonFunctionService.UploadDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {

              const fileName = data['Data'][0]["Dis_FileName"];
              const actualFile = data['Data'][0]["FileName"];

              this.UploadedFileName = data['Data'][0]["FileName"];
              this.formData.UploadDocument_file = this.UploadedFileName;
              this.formData.UploadDocument_fileName = fileName;
            }

            if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);

            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }



  async RefereshValidators() {

    if (this.formData.CoordinatorReachOnTime == true) {
      this.AddNodalOfficerExminerFromGroup.controls['txtCoordinatorNotReached'].clearValidators()
      this.AddNodalOfficerExminerFromGroup.controls['txtReason'].clearValidators()

    } else {
      this.AddNodalOfficerExminerFromGroup.controls['txtCoordinatorNotReached'].setValidators([DropdownValidators])
      this.AddNodalOfficerExminerFromGroup.controls['txtReason'].setValidators(Validators.required)
    }

    //if (this.formData.AdditionalDetails == false) {
    //  this.AddNodalOfficerExminerFromGroup.controls['UploadDocumentfile'].clearValidators()
    //} else {
    //  this.AddNodalOfficerExminerFromGroup.controls['UploadDocumentfile'].setValidators(Validators.required)
    //}


    this.AddNodalOfficerExminerFromGroup.controls['txtCoordinatorNotReached'].updateValueAndValidity();
    this.AddNodalOfficerExminerFromGroup.controls['txtReason'].updateValueAndValidity();
/*    this.AddNodalOfficerExminerFromGroup.controls['UploadDocumentfile'].updateValueAndValidity();*/

    //if (this.request.UrbanRural == 76) {
    //  this.instituteForm.controls['Administrative'].clearValidators();
    //  this.instituteForm.controls['CantonmentBoard'].clearValidators();
    //  this.instituteForm.controls['CityID'].clearValidators();
    //  ;
    //} else {


    //  this.instituteForm.controls['CantonmentBoard'].setValidators(Validators.required);
    //  this.instituteForm.controls['CityID'].setValidators([DropdownValidators]);

    //}

    //this.instituteForm.controls['Administrative'].updateValueAndValidity();




  }

}
