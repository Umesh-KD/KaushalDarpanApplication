import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointExaminerSearchModel, AppointmentExaminerDataModel } from '../../Models/AppointExaminerDataModel';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { AppointExaminerService } from '../../Services/AppointExaminer/AppointExaminer.service';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { EnumStatus } from '../../Common/GlobalConstants';



@Component({
    selector: 'app-appoint-examiner',
    templateUrl: './appoint-examiner.component.html',
    styleUrls: ['./appoint-examiner.component.css'],
    standalone: false
})
export class AppointExaminerComponent implements OnInit {
  public AppointExaminerFromGroup!: FormGroup;

  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public request = new AppointmentExaminerDataModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RoleMasterList: any[] = [];
  public DesignationMasterList: any[] = [];
  public StaffMasterList: any[] = []
  public sSOLoginDataModel = new SSOLoginDataModel();
  public SubjectMasterDDL: any = []
  public SemesterMasterDDL: any = []
  public CourseMasterDDL: any = []
  public ExaminerSsoidDDL: any = []
  public AppointExamierList: any = []
  public searchRequest = new AppointExaminerSearchModel();
  constructor(
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Appointexamierservice: AppointExaminerService,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.AppointExaminerFromGroup = this.formBuilder.group({
   
      ddlSSOID: ['', [DropdownValidators]],
      txtRollNumberFrom: ['', [Validators.required]],
      txtRollNumberTo: ['', [Validators.required]],
  

    });

    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    await this.getMasterData()
    await this.GetAppointExaminerList()

  }

  get _AppointExaminerFromGroup() { return this.AppointExaminerFromGroup.controls; }

  async getMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectMasterDDL(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
      }, error => console.error(error))

      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      }, error => console.error(error))

      await this.commonMasterService.Examiner_SSOID(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExaminerSsoidDDL = data.Data;
      }, error => console.error(error))

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        this.CourseMasterDDL = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async SaveData() {

    try {
      this.isFormSubmitted = true;
      if (this.AppointExaminerFromGroup.invalid) {
        return
      }
      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID

      //save
      await this.Appointexamierservice.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.GetAppointExaminerList()
            this.ResetControls();
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
  async GetAppointExaminerList() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    try {
      this.loaderService.requestStarted();
      await this.Appointexamierservice.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.AppointExamierList = data['Data'];
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


  async ResetControls() {
    this.isFormSubmitted = false
    this.AppointExaminerFromGroup.reset()
    this.request = new AppointmentExaminerDataModel()
  }

  async btnEdit_OnClick(ID: number) {
    this.isFormSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.Appointexamierservice.GetById(ID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data']
          this.request.SubjectID = data['Data']["SubjectID"]
          this.request.ActiveStatus = data['Data']["ActiveStatus"];
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

  async btnDelete_OnClick(AppointExaminerID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.Appointexamierservice.DeleteById(AppointExaminerID, this.request.ModifyBy)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)

                }
                else {
                  this.toastr.error(this.ErrorMessage)
                }
                this.GetAppointExaminerList()

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


}


