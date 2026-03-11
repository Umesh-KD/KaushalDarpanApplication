import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { FileUploadService } from '../../../Services/FileUpload/file-upload.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-file-uupload',
  standalone: false,
  templateUrl: './file-uupload.component.html',
  styleUrl: './file-uupload.component.css'
})
export class FileUuploadComponent {

  public file!: File;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public enumStatus = EnumStatus;

  constructor(private commonMasterService: CommonFunctionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private swal2: SweetAlert2,
    private fileUploadService: FileUploadService) {
  }

  async ngOnInit() {

  }

  async UploadFile(event: any) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            console.log(data, 'UploadDoc')
            if (this.State == this.enumStatus.Success) {
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
}
