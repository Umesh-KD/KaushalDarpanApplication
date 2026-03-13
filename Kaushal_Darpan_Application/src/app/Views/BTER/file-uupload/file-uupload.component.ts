import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DeleteFileMasterModel, UploadFileMasterModel } from '../../../Models/CommonMasterDataModel';

@Component({
  selector: 'app-file-uupload',
  standalone: false,
  templateUrl: './file-uupload.component.html',
  styleUrl: './file-uupload.component.css'
})
export class FileUuploadComponent {

  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public enumStatus = EnumStatus;
  public uploadFileModel = new UploadFileMasterModel();
  public deleteFileModel = new DeleteFileMasterModel();
  public ForDelete: boolean = false;


  constructor(private commonMasterService: CommonFunctionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private swal2: SweetAlert2,
    private fileUploadService: FileUploadService,
    private router: Router) {
  }

  async ngOnInit() {
    const fullUrl = this.router.url; // e.g. "/file-delete?kufa=Kd@U4!06F!l9Ap0Pn"
    const routeName = fullUrl.split('?')[0].split('/')[1]; // split path, ignore query string

    if (routeName === "file-delete") {
      this.ForDelete = true;
    }

  }

  async UploadFile(fileInput: HTMLInputElement) {
    try {
      debugger
      let file = fileInput.files?.[0];
      if (file) {
        // confirmation
        let fileName = `${this.uploadFileModel.FolderName}/${file.name}`;
        let forPGMK = this.uploadFileModel.ForPGMK == true ? '<br />For Page Management' : '';
        await this.swal2.Confirmation(`Are you sure you want to upload the file? ${forPGMK}<br />'${fileName}'`, async (result: any) => {
          if (result.isConfirmed)
            // call
            await this.fileUploadService.UploadFile(file, this.uploadFileModel)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                // clear file input
                fileInput.value = '';
                this.resetFormFileUploadData();

                // response
                if (this.State == this.enumStatus.Success) {
                  this.toastr.success(this.Message)
                }
                else if (this.State == EnumStatus.Warning) {
                  this.toastr.warning(this.Message)
                }
                else {
                  this.toastr.error(this.Message);
                  console.log(this.ErrorMessage);
                }
              })
        });
      }
      else {
        this.toastr.warning("Please select a file to upload!");
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async DeleteFile() {
    try {
      debugger
      // confirmation
      let file = `${this.deleteFileModel.FolderName}/${this.deleteFileModel.FileName}`;
      let forPGMK = this.uploadFileModel.ForPGMK == true ? '<br />For Page Management' : '';
      await this.swal2.Confirmation(`Are you sure you want to delete the file? ${forPGMK}<br />'${file}'`, async (result: any) => {
        if (result.isConfirmed)
          // call
          await this.fileUploadService.DeleteFile(this.deleteFileModel)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              // clear form
              this.resetFormFileDeleteData();

              // response
              if (this.State == this.enumStatus.Success) {
                this.toastr.success(this.Message)
              }
              else if (this.State == EnumStatus.Warning) {
                this.toastr.warning(this.Message)
              }
              else {
                this.toastr.error(this.Message);
                console.log(this.ErrorMessage);
              }
            })
      });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  resetFormFileUploadData() {
    this.uploadFileModel = new UploadFileMasterModel();
  }
  resetFormFileDeleteData() {
    this.deleteFileModel = new DeleteFileMasterModel();
  }
}
