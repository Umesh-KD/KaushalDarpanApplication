import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { GroupDataModels } from '../../../Models/GroupDataModels';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { GroupService } from '../../../Services/Groups/groups.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SubjectMasterService } from '../../../Services/SubjectMaster/Subject-master.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ExaminerDataModel, TeacherForExaminerSearchModel } from '../../../Models/ExaminerDataModel';
import { SubjectSearchModel } from '../../../Models/SubjectMasterDataModel';

@Component({
    selector: 'app-add-groups',
    templateUrl: './add-groups.component.html',
    styleUrls: ['./add-groups.component.css'],
    standalone: false
})
export class AddGroupsComponent implements OnInit {
  groupForm!: FormGroup;
  public isUpdate: boolean = false;
  public GroupID: number | null = null;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  public State: number = -1;
  public DistrictMasterList: any = []
  public DivisionMasterList: any = []
  public TehsilMasterList: any = []
  public SubjectMasterList: any = [];
  public ExamList: any[] = [];
  public UserID: number = 0;
  public searchText: string = '';
  public tbl_txtSearch: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new TeacherForExaminerSearchModel();
  request = new GroupDataModels()
  public searchRequestSub = new SubjectSearchModel()


  constructor(
    private fb: FormBuilder,
    private SubjectMasterService: SubjectMasterService,
    private GroupService: GroupService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal
  ) {

  }


  async ngOnInit() {

    this.groupForm = this.fb.group({

      groupcode: ['', Validators.required],
      txtCenterCode: ['', Validators.required],
      ddlSubjectCode: ['', [DropdownValidators]],
      ddlExamName: ['', [DropdownValidators]]
    });
    this.GroupID = Number(this.route.snapshot.paramMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;
    await this.GetSubjectMasterList();
    this.getExamMasterList()


    if (this.GroupID) {
      await this.GetByID(this.GroupID)
      this.isUpdate = true
    }
  }

  get form() { return this.groupForm.controls; }

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.GroupService.GetByID(id, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.GroupCode = data['Data']["GroupCode"];
          this.request.CenterCode = data['Data']["CenterCode"];
          this.request.SubjectID = data['Data']["SubjectID"];
          this.request.ExamID = data['Data']["ExamID"];
          this.request.CreatedBy = data['Data']["CreatedBy"];
          this.request.ModifyBy = data['Data']["ModifyBy"];
          console.log(data)
          // console.log(this.DivisionMasterList)

          // Update UI elements if necessary
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

  async GetSubjectMasterList() {
    this.searchRequestSub.DepartmentID = this.sSOLoginDataModel.DepartmentID
    try {
      this.loaderService.requestStarted();
      await this.SubjectMasterService.GetAllData(this.searchRequestSub)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SubjectMasterList = data['Data'];
          console.log(this.SubjectMasterList, "CodeSubject")
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

  async saveData() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.GroupID) {
        this.request.GroupID = this.GroupID
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.GroupService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.ResetControl();
            this.router.navigate(['/groups']);
            this.toastr.success(this.Message)

          }
          else {
            this.toastr.error(this.ErrorMessage)
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


  async ResetControl() {
    this.isSubmitted = false;
    this.request = new GroupDataModels
    this.groupForm.reset();
    // Reset form values if necessary
    this.groupForm.patchValue({

      code: '',

    });
  }

  onCancel(): void {
    this.router.navigate(['/groups']);
  }

}
