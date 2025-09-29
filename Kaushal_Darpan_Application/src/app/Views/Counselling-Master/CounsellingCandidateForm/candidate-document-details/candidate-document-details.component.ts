import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { Counselling_DocumentDetailsModel } from '../../../../Models/DocumentDetailsModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EncryptionService } from '../../../ITI/idffund-details/idffund-details.component';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { UploadCounsellingFileModel } from '../../../../Models/UploadFileModel';
import { DeleteDocumentDetailsModel_Counselling } from '../../../../Models/DeleteDocumentDetailsModel';

@Component({
  selector: 'app-candidate-document-details',
  standalone: false,
  templateUrl: './candidate-document-details.component.html',
  styleUrl: './candidate-document-details.component.css'
})
export class CandidateDocumentDetailsComponent {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public deleteRequest = new Counselling_DocumentDetailsModel()
  public _GlobalConstants: any = GlobalConstants;

  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();

  public documentDetails: Counselling_DocumentDetailsModel[] = []  

  constructor(
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private documentDetailsService: DocumentDetailsService,
    private encryptionService: EncryptionService,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() { 
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  async UploadDocument(event: any, item: any) {
    try {
      //upload model
      let uploadModel: UploadCounsellingFileModel = {
        CandidateID: this.SSOLoginDataModel.ApplicationID.toString() ?? "0",
        AcademicYear: this.SSOLoginDataModel.FinancialYearID.toString() ?? "0",
        DepartmentID: this.SSOLoginDataModel.DepartmentID.toString() ?? "0",
        EndTermID: this.SSOLoginDataModel.EndTermID.toString() ?? "0",
        Eng_NonEng: this.SSOLoginDataModel.Eng_NonEng.toString() ?? "0",
        FileName: item.ColumnName ?? "",
        FileExtention: item.FileExtention ?? "",
        MinFileSize: item.MinFileSize ?? "",
        MaxFileSize: item.MaxFileSize ?? "",
        FolderName: item.FolderName ?? ""
      }
     
      //call
      await this.documentDetailsService.Counselling_UploadDocument(event, uploadModel)
        .then((data: any) => {
          
          if (data.State == EnumStatus.Success) {
            //add/update document in js list
            const index = this.documentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.documentDetails[index].FileName = data.Data[0].FileName;
              this.documentDetails[index].Dis_FileName = data.Data[0].Dis_FileName;
            }
            //reset file type
            event.target.value = null;
          }
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.ErrorMessage)
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async DeleteDocument(item: any) {

    try {
      // delete from server folder
      debugger
      let deleteModel = new DeleteDocumentDetailsModel_Counselling()

      deleteModel.FolderName = item.FolderName ?? "";
      deleteModel.FileName = item.FileName;
      //call
      await this.documentDetailsService.Counselling_DeleteDocument(deleteModel)
        .then(async (data: any) => {
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.documentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.documentDetails[index].FileName = '';
              this.documentDetails[index].Dis_FileName = '';
            }

            // await this.DeleteApplicationDocument_FromTable(item);
          }
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  // async DeleteApplicationDocument_FromTable(item: any) {

  //   try {
  //     this.deleteRequest.CandidateID = item.CandidateID;
  //     this.deleteRequest.CandidateDocumentID = item.CandidateDocumentID;
  //     this.deleteRequest.ModifyBy = this.SSOLoginDataModel.UserID;

  //     this.loaderService.requestStarted();
  //     await this.ApplicationService.DeleteDocumentById(this.deleteRequest)
  //       .then((data: any) => {
  //         if (data.State == EnumStatus.Success) {
  //           this.toastr.success(data.Message)
  //         } 
  //         // else {
  //         //   this.toastr.error(data.ErrorMessage)
  //         // }
  //       });
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   } finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200)
  //   }
  // }
}
