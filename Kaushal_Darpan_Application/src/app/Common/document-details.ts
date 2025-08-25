import { Injectable, signal } from "@angular/core";
import { UploadBTERFileModel, UploadFileModel } from "../Models/UploadFileModel";
import { CommonFunctionService } from "../Services/CommonFunction/common-function.service";
import { ToastrService } from "ngx-toastr";
import { AppsettingService } from "./appsetting.service";
import { DeleteDocumentDetailsModel } from "../Models/DeleteDocumentDetailsModel";
import { EnumStatus } from "./GlobalConstants";


@Injectable({
  providedIn: 'root'
})

export class DocumentDetailsService {
  constructor(private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
  ) {
  }

  //document
  async UploadDocument(event: any, uploadModel: UploadFileModel) {
    try {
      const file: File = event.target.files[0];
      if (file)
      {
        let fileValue = event.target.value;
        // extention
        if (uploadModel?.FileExtention != null && uploadModel?.FileExtention != "") {
          var _validFileExtensions = uploadModel?.FileExtention?.toLowerCase()?.split(',');
          if (_validFileExtensions?.indexOf("." + fileValue.split('.').pop().toLowerCase()) == -1) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid extension, allowed only ${uploadModel?.FileExtention}`);
            return;
          }
        }

        // min size
        if (parseInt(uploadModel?.MinFileSize ?? "0") > 0) {
          let acceptMinFileSize = parseInt(uploadModel?.MinFileSize ?? "0");
          let fileSize = 0;
          if ((uploadModel?.MinFileSize ?? "0").toLowerCase().indexOf("mb") != -1) {
            fileSize = Math.round(file.size / 1024 / 1024);
          }
          else if ((uploadModel?.MinFileSize ?? "0").toLowerCase().indexOf("kb") != -1) {
            fileSize = Math.round(file.size / 1024);
          }
          if (fileSize < acceptMinFileSize) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid file size, Min allowed only ${uploadModel?.MinFileSize}`);
            return;
          }
        }

        // ṃax size
        if (parseInt(uploadModel?.MaxFileSize ?? "0") > 0) {
          let acceptMaxFileSize = parseInt(uploadModel?.MaxFileSize ?? "0");
          let fileSize = 0;
          if ((uploadModel?.MaxFileSize ?? "0").toLowerCase().indexOf("mb") != -1) {
            fileSize = Math.round(file.size / 1024 / 1024);
          }
          else if ((uploadModel?.MaxFileSize ?? "0").toLowerCase().indexOf("kb") != -1) {
            fileSize = Math.round(file.size / 1024);
          }
          if (fileSize > acceptMaxFileSize) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid file size, Max allowed only ${uploadModel?.MaxFileSize}`);
            return;
          }
        }

        // upload to server folder
        return await this.commonMasterService.UploadDocument(file, uploadModel)
          .then((data: any) => {
            return data;
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  //document
  async UploadBTERDocument(event: any, uploadModel: UploadBTERFileModel) {
    try {
      debugger
      const file: File = event.target.files[0];
      if (file) {
        let fileValue = event.target.value;
        // extention
        if (uploadModel?.FileExtention != null && uploadModel?.FileExtention != "") {
          var _validFileExtensions = uploadModel?.FileExtention?.toLowerCase()?.split(',');
          if (_validFileExtensions?.indexOf("." + fileValue.split('.').pop().toLowerCase()) == -1) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid extension, allowed only ${uploadModel?.FileExtention}`);
            return;
          }
        }

        // min size
        if (parseInt(uploadModel?.MinFileSize ?? "0") > 0) {
          let acceptMinFileSize = parseInt(uploadModel?.MinFileSize ?? "0");
          let fileSize = 0;
          if ((uploadModel?.MinFileSize ?? "0").toLowerCase().indexOf("mb") != -1) {
            fileSize = Math.round(file.size / 1024 / 1024);
          }
          else if ((uploadModel?.MinFileSize ?? "0").toLowerCase().indexOf("kb") != -1) {
            fileSize = Math.round(file.size / 1024);
          }
          if (fileSize < acceptMinFileSize) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid file size, Min allowed only ${uploadModel?.MinFileSize}`);
            return;
          }
        }

        // ṃax size
        if (parseInt(uploadModel?.MaxFileSize ?? "0") > 0) {
          let acceptMaxFileSize = parseInt(uploadModel?.MaxFileSize ?? "0");
          let fileSize = 0;
          if ((uploadModel?.MaxFileSize ?? "0").toLowerCase().indexOf("mb") != -1) {
            fileSize = Math.round(file.size / 1024 / 1024);
          }
          else if ((uploadModel?.MaxFileSize ?? "0").toLowerCase().indexOf("kb") != -1) {
            fileSize = Math.round(file.size / 1024);
          }
          if (fileSize > acceptMaxFileSize) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid file size, Max allowed only ${uploadModel?.MaxFileSize}`);
            return;
          }
        }

        // upload to server folder
        return await this.commonMasterService.UploadBTERDocument(file, uploadModel)
          .then((data: any) => {
            return data;
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async UploadBTEROriginalDocument(event: any, uploadModel: UploadBTERFileModel) {
    try {
      debugger
      const file: File = event.target.files[0];
      if (file) {
        let fileValue = event.target.value;
        // extention
        if (uploadModel?.FileExtention != null && uploadModel?.FileExtention != "") {
          var _validFileExtensions = uploadModel?.FileExtention?.toLowerCase()?.split(',');
          if (_validFileExtensions?.indexOf("." + fileValue.split('.').pop().toLowerCase()) == -1) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid extension, allowed only ${uploadModel?.FileExtention}`);
            return;
          }
        }

        // min size
        if (parseInt(uploadModel?.MinFileSize ?? "0") > 0) {
          let acceptMinFileSize = parseInt(uploadModel?.MinFileSize ?? "0");
          let fileSize = 0;
          if ((uploadModel?.MinFileSize ?? "0").toLowerCase().indexOf("mb") != -1) {
            fileSize = Math.round(file.size / 1024 / 1024);
          }
          else if ((uploadModel?.MinFileSize ?? "0").toLowerCase().indexOf("kb") != -1) {
            fileSize = Math.round(file.size / 1024);
          }
          if (fileSize < acceptMinFileSize) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid file size, Min allowed only ${uploadModel?.MinFileSize}`);
            return;
          }
        }

        // ṃax size
        if (parseInt(uploadModel?.MaxFileSize ?? "0") > 0) {
          let acceptMaxFileSize = parseInt(uploadModel?.MaxFileSize ?? "0");
          let fileSize = 0;
          if ((uploadModel?.MaxFileSize ?? "0").toLowerCase().indexOf("mb") != -1) {
            fileSize = Math.round(file.size / 1024 / 1024);
          }
          else if ((uploadModel?.MaxFileSize ?? "0").toLowerCase().indexOf("kb") != -1) {
            fileSize = Math.round(file.size / 1024);
          }
          if (fileSize > acceptMaxFileSize) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid file size, Max allowed only ${uploadModel?.MaxFileSize}`);
            return;
          }
        }

        // upload to server folder
        return await this.commonMasterService.UploadBTEROriginalDocument(file, uploadModel)
          .then((data: any) => {
            return data;
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async UploadFile(event: any, uploadModel: UploadFileModel) {
    try {
      const file: File = event.target.files[0];
      if (file) {
        let fileValue = event.target.value;

        // extention
        if (uploadModel?.FileExtention != null && uploadModel?.FileExtention != "") {
          var _validFileExtensions = uploadModel?.FileExtention?.toLowerCase()?.split(',');
          if (_validFileExtensions?.indexOf("." + fileValue.split('.').pop().toLowerCase()) == -1) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid extension, allowed only ${uploadModel?.FileExtention}`);
            return;
          }
        }

        // min size
        if (parseInt(uploadModel?.MinFileSize ?? "0") > 0) {
          let acceptMinFileSize = parseInt(uploadModel?.MinFileSize ?? "0");
          let fileSize = 0;
          if ((uploadModel?.MinFileSize ?? "0").toLowerCase().indexOf("mb") != -1) {
            fileSize = Math.round(file.size / 1024 / 1024);
          }
          else if ((uploadModel?.MinFileSize ?? "0").toLowerCase().indexOf("kb") != -1) {
            fileSize = Math.round(file.size / 1024);
          }
          if (fileSize < acceptMinFileSize) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid file size, Min allowed only ${uploadModel?.MinFileSize}`);
            return;
          }
        }

        // ṃax size
        if (parseInt(uploadModel?.MaxFileSize ?? "0") > 0) {
          let acceptMaxFileSize = parseInt(uploadModel?.MaxFileSize ?? "0");
          let fileSize = 0;
          if ((uploadModel?.MaxFileSize ?? "0").toLowerCase().indexOf("mb") != -1) {
            fileSize = Math.round(file.size / 1024 / 1024);
          }
          else if ((uploadModel?.MaxFileSize ?? "0").toLowerCase().indexOf("kb") != -1) {
            fileSize = Math.round(file.size / 1024);
          }
          if (fileSize > acceptMaxFileSize) {
            //reset file type
            fileValue = null;
            this.toastr.warning(`Invalid file size, Max allowed only ${uploadModel?.MaxFileSize}`);
            return;
          }
        }

        // upload to server folder
        return await this.commonMasterService.UploadFile(file, uploadModel)
          .then((data: any) => {
            return data;
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async DeleteDocument(deleteModel: DeleteDocumentDetailsModel) {
    try {
      // delete from server folder
      return await this.commonMasterService.DeleteDocumentNew(deleteModel)
        .then((data: any) => {
          return data;
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async DeleteBTERDocument(deleteModel: DeleteDocumentDetailsModel) {
    try {
      // delete from server folder
      return await this.commonMasterService.DeleteBTERDocument(deleteModel)
        .then((data: any) => {
          return data;
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  HasRequiredDocument(item: any[]): boolean {
    const rd = item.filter(x => x.IsMandatory == true && (x.FileName == null || x.FileName == '' || x.FileName == ' '))
    if (rd?.length > 0) {
      let r = rd.map(x => x.DisplayColumnNameEn)?.join(", ");
      this.toastr.error(`${r} is required!`);
      return true;
    }
    return false;
  }
  //end document

}
