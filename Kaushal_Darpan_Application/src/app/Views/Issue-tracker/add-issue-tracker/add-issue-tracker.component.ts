import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { ReactiveFormsModule } from '@angular/forms';
import { IssueTrackerMasterService } from '../../../Services/IssueTracker/IssueTracker-master.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { IssueTrackerDataModels } from '../../../Models/IssueTrackerDataModels';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ITI_PlanningCollegesModel, ItiAffiliationList, ItiMembersModel, ItiVerificationModel } from '../../../Models/ItiPlanningDataModel';
import { EnumDepartment, EnumRole, EnumStatus, EnumStatusOfStaff, GlobalConstants } from '../../../Common/GlobalConstants';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { IssueFile } from '../../../Models/IssueTrackerDataModels';





@Component({
  selector: 'app-add-issue-tracker',
  standalone: false,
  templateUrl: './add-issue-tracker.component.html',
  styleUrl: './add-issue-tracker.component.css'
})
export class AddIssueTrackerComponent {


  IssueTrackerFormGroup!: FormGroup;
  selectedFiles: File[] = [];
  selectedFileNames: string[] = [];
 
  Issue!: [''];
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  _IssueTrackerFormGroup!: FormGroup;
  public RoleMasterList: any = [];
  _EnumRole = EnumRole;
  public RoleNameEnglish: string = '';

  isSubmitted  = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public isUpdate: boolean = false;
  public StreamID: number | null = null;
  public IssueID: number | null = null;
  public AddRequest = new IssueFile()
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public issueDate: string = '';
  public resolvedDate: string = '';
  public request = new IssueTrackerDataModels()
  private appsettingConfig = inject(AppsettingService)
  /*public StatusTypeList: any = [];*/
  searchText: string = '';
  filteredItems: any[] = [];
 
  
  //file
  public RegFileName?: string = '';
  public RegDisFileName?: string = '';
  public addmore = new ItiAffiliationList();
  public ItiAffiliationList: ItiAffiliationList[] = [];
  public Type: number = 0;
  public isDisabled: boolean = false;



  //onFilesChange(event: any): void {
  //  if (event.target.files && event.target.files.length > 0) {
  //    this.selectedFiles = Array.from(event.target.files);
  //    this.selectedFileNames = this.selectedFiles.map(file => file.name);
  //  } else {
  //    this.selectedFiles = [];
  //    this.selectedFileNames = [];
  //  }
  //}

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private streamService: StreamMasterService,
    private Issuetrackerservice: IssueTrackerMasterService,
    private issueService: IssueTrackerMasterService,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private staffMasterService: StaffMasterService,

  ) {

  }


  //  // other properties as needed
  //};


  StatusTypeList = [
    { StatusID: 1, Status: 'Open' },
    { StatusID: 2, Status: 'In Progress' },
    { StatusID: 3, Status: 'Closed' }
  ];

  PriorityTypeList = [
    { PriorityID: 1, Priority: 'High' },
    { PriorityID: 2, Priority: 'Medium' },
    { PriorityID: 3, Priority: 'Low' }
  ];

  IssueTypeList = [
    { IssueTypeID: 1, IssueType: 'Mobile' },
    { IssueTypeID: 2, IssueType: 'Web Development' },

  ];

  IssueTypeDescription = [
    { IssueTypeDescriptionID: 1, TypeDescription: 'Error' },
    { IssueTypeDescriptionID: 2, TypeDescription: 'Functionality' },
    { IssueTypeDescriptionID: 3, TypeDescription: 'Designer' },
    { IssueTypeDescriptionID: 4, TypeDescription: 'UI/UX' },

  ];

 async ngOnInit() {
    this._IssueTrackerFormGroup = this.fb.group({
      //txtProjectName: ['', Validators.required],
      txtProjectName: [{ value: 'Kausal Darpan', disabled: true }, Validators.required],
      txtDescription: ['', Validators.required],

      StatusTypeID: ['', [DropdownValidators]],
      //PriorityTypeID: ['', [DropdownValidators]],
      txtComment: [''],
      IssueTypeID: ['', [DropdownValidators]],
      IssueTypeDescriptionID: ['', [DropdownValidators]],
      Issue: ['', Validators.required],
      RoleID: ['', [DropdownValidators]], 


    
      // add other controls as needed
    });
   this.StreamID = Number(this.route.snapshot.paramMap.get('id')?.toString());
   this.IssueID = Number(this.activatedRoute.snapshot.queryParamMap.get('IssueID')?.toString());
   this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());

    //this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    const data = localStorage.getItem('SSOLoginUser');
    if (data) {
      this.sSOLoginDataModel = JSON.parse(data);
   }
   this.GetRoleMasterData()
 /*   this.request.UserID = this.sSOLoginDataModel.UserID;*/
  }

  async GetRoleMasterData() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetRoleMasterDDL(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.RoleMasterList = data.Data;
        console.log("RoleMasterList", this.RoleMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  onFilesChange(event: any): void {

    if (event.target.files && event.target.files.length > 0) {

      this.selectedFiles = Array.from(event.target.files);

      this.selectedFileNames = this.selectedFiles.map(file => file.name);

    } else {

      this.selectedFiles = [];

      this.selectedFileNames = [];

    }

  }

  async saveData() {

    try {
      this.isSubmitted = true;
      
      if (this._IssueTrackerFormGroup.invalid) {
        return
      }
      this.isLoading = true;
      this.loaderService.requestStarted();
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.CreatedBy = this.sSOLoginDataModel.UserID
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      
      //save
      await this.Issuetrackerservice.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.router.navigate(['/IssueTracker']);

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
   
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



  //ResetControls() {

  //  this.request.StatusTypeID = 0
  //  this.request.SemesterID = 0
  //  this.request.Amount = null
  //  this.request.TotalStudent = null
  //  this.request.Category = 0
  //  //this.multiSelect.toggleSelectAll();
  //}


  //async GetByID(IssueID: number) {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.streamService.GetByID(IssueID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.request.Issue = data['Data']["Issue"];
  //        this.request.StatusTypeID = data['Data']["StatusTypeID"];
  //        this.request.PriorityTypeID = data['Data']["PriorityTypeID"];
  //        this.request.UserID = data['Data']["UserID"];
  //        this.request.Discription = data['Data']["Discription"];
  //        this.request.Comment = data['Data']["Comment"];
  //        this.request.fileStudentPhoto = data['Data']["StreamTypeID"];
  //        //this.request.Qualifications = data['Data']["Qualifications"];
  //        this.request.CreatedBy = data['Data']["CreatedBy"];
  //        this.request.ModifyBy = data['Data']["ModifyBy"];
  //        const saveData = document.getElementById('btnSave');
  //        if (saveData) saveData.innerHTML = "Update";
  //        const btnReset = document.getElementById('btnReset');
  //        if (btnReset) btnReset.innerHTML = "Cancel";

  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //}


  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      debugger
      this.file = event.target.files[0];
      if (this.file) {

        if (['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(this.file.type)) {
          // Size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else {
          this.toastr.error('Select Only jpeg/jpg/png file');
          return;
        }

        // Upload to server folder
        this.loaderService.requestStarted();
        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log("photo data", data);
            if (data.State === EnumStatus.Success) {

              debugger

              switch (Type) {
                case "RegFileName":

                  this.AddRequest.RegFileName = data['Data'][0]["FileName"];
                  this.AddRequest.RegDisFileName = data['Data'][0]["Dis_FileName"];


                  break;
                case "FileName":
                  this.addmore.FileName = data['Data'][0]["FileName"];
                  this.addmore.Dis_Filename = data['Data'][0]["FileName"];


                  break;
                default:
                  break;
              }
            }
            event.target.value = null;
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


 
  async Reset() {
    this.isSubmitted = false;

    this.request = new IssueTrackerDataModels();
    this.IssueTrackerFormGroup.reset();
    // Reset form values if necessary
    this.IssueTrackerFormGroup.patchValue({
      HostelName: ''
    });
  }

  AddChoice() {

    if (!this.request.IssueFile) {
      this.request.IssueFile = [];
    }

    if (this.AddRequest.RegFileName == '') {
      this.toastr.error("Please Upload File")
      return
    }


    this.request.IssueFile.push({

      RegDisFileName: this.AddRequest.RegDisFileName,
      RegFileName: this.AddRequest.RegFileName
    });


    this.AddRequest.RegFileName = ''
    this.AddRequest.RegDisFileName = ''

  }

}


