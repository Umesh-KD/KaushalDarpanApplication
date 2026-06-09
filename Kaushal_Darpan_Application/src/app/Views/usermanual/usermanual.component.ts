import { Component } from '@angular/core';
import { LoaderService } from '../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../Common/appsetting.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleMasterService } from '../../Services/RoleMaster/role-master.service';
import { RoleSearchModel } from '../../Models/RoleMasterDataModel';
import { EnumStatus } from '../../Common/GlobalConstants';
import { UploadFileModel } from '../../Models/UploadFileModel';

@Component({
  selector: 'app-usermanual',
  standalone: false,
  templateUrl: './usermanual.component.html',
  styleUrl: './usermanual.component.css'
})
export class UsermanualComponent {

  UserManualList: any[] = [];
  sSOLoginDataModel = new SSOLoginDataModel();
  UserManualForm!: FormGroup;
  isSubmitted = false;
  modalReference: any;
  public searchRequest = new RoleSearchModel();
   public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public RoleMasterList: any = [];
  public file!: File;

  public UserManualFileName = '';
  public UserManualDisplayFileName = '';


  constructor(
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private appsettingConfig: AppsettingService,
    private fb: FormBuilder, 
    private modalService: NgbModal, 
    private roleMasterService:RoleMasterService,
    
  ) { }
  async ngOnInit(){
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      await this.GetUserManualList();

    this.UserManualForm = this.fb.group({
  RoleId: [0, Validators.required],
  Title: ['', Validators.required],
  Description: [''],
  DisplayOrder: [1, Validators.required],
  FilePath: ['', Validators.required],
  Dis_FilePath: [''],
});

this.GetRoleMasterList();
  }

//   async GetUserManualList() {
//   try {
// debugger
//     this.loaderService.requestStarted();

//     await this.commonFunctionService
//       .GetUserManualByRoleId(this.sSOLoginDataModel.RoleID)
//       .then((data: any) => {

//         data = JSON.parse(JSON.stringify(data));

//         if (data.State === 0 || data.State === 'Success') {
//           this.UserManualList = data.Data;
//         } else {
//           this.UserManualList = [];
//         }
//       });

//   } catch (error) {
//     console.error(error);
//   } finally {
//     this.loaderService.requestEnded();
//   }
// }

async GetUserManualList() {
  try {

    this.loaderService.requestStarted();

    const request = {
            RoleId: this.sSOLoginDataModel.RoleID,
            CreatedBy: this.sSOLoginDataModel.UserID,
            Action: 'GetByRole'
          }
          const data: any = await this.commonFunctionService
            .GetUserManualByRoleId(request);
    // const data: any = await this.commonFunctionService
    //   .GetUserManualByRoleId(this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.UserID,'GetByRole');

    if (data.State === 1) { // Success

      this.UserManualList = data.Data || [];

      console.log('usermanual', this.UserManualList);
      if (this.UserManualList.length === 0) {
        this.toastr.warning(data.Message || 'No record found.');
      }
    }
    else if (data.State === 3) { // Warning

      this.UserManualList = [];
      this.toastr.warning(data.Message);
    }
    else if (data.State === 2) { // Error

      this.UserManualList = [];
      this.toastr.error(data.ErrorMessage || data.Message);
    }

  }
  catch (error) {

    this.UserManualList = [];
    this.toastr.error('Something went wrong.');

  }
  finally {

    this.loaderService.requestEnded();

  }
}

async openUserManualModal(content: any) {

  this.isSubmitted = false;


  this.UserManualFileName = '';
  this.UserManualDisplayFileName = '';

  this.UserManualForm.reset();

  this.UserManualForm.patchValue({
    RoleId: 0,
    Title: '',
    Description: '',
    DisplayOrder: 1,
    FilePath: ''
  });

  this.modalReference = this.modalService.open(content, {
    size: 'xl',
    backdrop: 'static'
  });

}

closeUserManualModal() {

  if (this.modalReference) {
    this.modalReference.close();
    this.modalReference = null;
  }

}

// async SaveUserManual() {

//   this.isSubmitted = true;

//   if (this.UserManualForm.invalid) {
//     return;
//   }

//   try {

//     if (!this.UserManualForm.value.FilePath) {

//   this.toastr.error('Please upload user manual PDF');

//   return;
// }
//     //const request = this.UserManualForm.value;
//     const request = {
//       ...this.UserManualForm.value,

//       CreatedBy: this.sSOLoginDataModel.UserID,
//       CreatedByRoleId: this.sSOLoginDataModel.RoleID
//     };

//     debugger
//     const data: any =
//       await this.commonFunctionService.InsertUserManual(request);

//     if (data.State === 1) {

//       this.toastr.success(data.Message);

//       this.closeUserManualModal();

//       await this.GetUserManualList();
//     }

//   }
//   catch (error) {

//     console.error(error);

//   }
// }


async SaveUserManual() {

  this.isSubmitted = true;

  if (this.UserManualForm.invalid) {
    return;
  }

  if (!this.UserManualForm.value.FilePath) {
    this.toastr.error('Please upload user manual PDF');
    return;
  }

  try {

    this.loaderService.requestStarted();

    const request = {
      ...this.UserManualForm.value,
      CreatedBy: this.sSOLoginDataModel.UserID,
      CreatedByRoleId: this.sSOLoginDataModel.RoleID
    };

    const data: any =
      await this.commonFunctionService.InsertUserManual(request);

    if (data.State === 1) { // Success

      this.toastr.success(data.Message);

      this.closeUserManualModal();

      this.UserManualForm.reset();

      this.UserManualFileName = '';
      this.UserManualDisplayFileName = '';

      await this.GetUserManualList();
    }
    else if (data.State === 3) { // Warning

      this.toastr.warning(data.Message);
    }
    else if (data.State === 2) { // Error

      this.toastr.error(
        data.ErrorMessage || data.Message || 'Something went wrong.'
      );
    }

  }
  catch (error) {

    console.error(error);

    this.toastr.error('Something went wrong.');

  }
  finally {

    this.loaderService.requestEnded();

  }
}
 async GetRoleMasterList() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = 2;
      this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      await this.roleMasterService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RoleMasterList = data['Data'];
          console.log('role list',this.RoleMasterList);
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

//   async onUserManualFileChange(event: any) {

//   try {

//     this.file = event.target.files[0];

//     if (!this.file) {
//       return;
//     }

//     if (this.file.type !== 'application/pdf') {

//       this.toastr.error('Select PDF file only');
//       return;
//     }

//     if (this.file.size > 2000000) {

//       this.toastr.error('Select less than 2 MB file');
//       return;
//     }

//     this.loaderService.requestStarted();

//     await this.commonFunctionService.UploadDocument(this.file)
//       .then((data: any) => {

//         data = JSON.parse(JSON.stringify(data));

//         this.State = data['State'];

//         if (this.State == EnumStatus.Success) {

//           this.UserManualFileName =
//             data['Data'][0]['FileName'];

//           this.UserManualDisplayFileName =
//             data['Data'][0]['Dis_FileName'];

//           this.UserManualForm.patchValue({
//             FilePath: this.UserManualFileName
//           });

//           event.target.value = null;
//         }

//       });

//   }
//   catch (ex) {

//     console.log(ex);

//   }
//   finally {

//     this.loaderService.requestEnded();

//   }

// }

async onUserManualFileChange(event: any) {

  try {

    this.file = event.target.files[0];

    if (!this.file) {
      return;
    }

    if (this.file.type !== 'application/pdf') {

      this.toastr.error('Select PDF file only');
      return;
    }

    if (this.file.size > 2000000) {

      this.toastr.error('Select less than 2 MB file');
      return;
    }

    const uploadModel = new UploadFileModel();

    uploadModel.FolderName = 'UserManual';
    uploadModel.FileExtention = '';
    uploadModel.MaxFileSize = '';

    this.loaderService.requestStarted();

    await this.commonFunctionService
      .UploadDocument(this.file, uploadModel)
      .then((data: any) => {

        data = JSON.parse(JSON.stringify(data));

        this.State = data['State'];

        if (this.State === EnumStatus.Success) {

          this.UserManualFileName =
            data['Data'][0]['FileName'];

          this.UserManualDisplayFileName =
            data['Data'][0]['Dis_FileName'];

          this.UserManualForm.patchValue({
            FilePath: this.UserManualFileName,
            Dis_FilePath: this.UserManualDisplayFileName
          });

          this.toastr.success('File uploaded successfully');
        }
      });

  }
  catch (ex) {

    console.log(ex);

  }
  finally {

    this.loaderService.requestEnded();

  }

}
}
