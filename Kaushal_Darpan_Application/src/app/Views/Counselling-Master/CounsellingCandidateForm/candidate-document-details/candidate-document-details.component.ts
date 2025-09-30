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
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { UploadCounsellingFileModel } from '../../../../Models/UploadFileModel';
import { DeleteDocumentDetailsModel_Counselling } from '../../../../Models/DeleteDocumentDetailsModel';
import { CounsellingApplicationSearchModel } from '../../../../Models/CounsellingApplicationFormDataModel';
import { CounsellingApplicationFormService } from '../../../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';

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
  public searchReq = new CounsellingApplicationSearchModel();

  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();

  public documentDetails: Counselling_DocumentDetailsModel[] = []  
  filteredDocumentsGroup1: any[] = [];
  filteredDocumentsGroup2: any[] = [];

  public isSubmitted: boolean = false;
  public CandidateID: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private documentDetailsService: DocumentDetailsService,
    private encryptionService: EncryptionService,
    private Swal2: SweetAlert2,
    private counsellingApplicationFormService: CounsellingApplicationFormService, 
  ) { }

  async ngOnInit() { 
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CandidateID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"))
    await this.GetById();
  }

  async GetById() {
    try {
      this.isSubmitted = false;

      this.searchReq.CandidateId = this.CandidateID  //this.SSOLoginDataModel.CandidateID

      this.loaderService.requestStarted();
      await this.counsellingApplicationFormService.GetDocumentDatabyID_Counselling(this.searchReq)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State === EnumStatus.Success) {
            this.documentDetails = data.Data.Counselling_DocumentDetails;
            debugger
            this.filteredDocumentsGroup1 = this.filteredDocumentDetails(1);
            this.filteredDocumentsGroup2 = this.filteredDocumentDetails(2);

            const btnSave = document.getElementById('btnSave')
            if (btnSave) btnSave.innerHTML = "Update";
            const btnReset = document.getElementById('btnReset')
            if (btnReset) btnReset.innerHTML = "Cancel";

          } else if(data.State == EnumStatus.Warning) {
            this.toastr.warning(data.Message)
          } else {
            this.toastr.error(data.ErrorMessage)
          }
          
        }, (error: any) => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  filteredDocumentDetails(groupNo: number): any[] {
    let filtered = this.documentDetails.filter((x) => x.GroupNo === groupNo);
    return filtered;
  }

  async UploadDocument(event: any, item: any) {
    try {
      //upload model
      let uploadModel: UploadCounsellingFileModel = {
        CandidateID: this.CandidateID.toString(),   //this.SSOLoginDataModel.ApplicationID.toString() ?? "0",
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

  async SaveData() {
    this.Swal2.Confirmation("Are you sure you want to upload this document ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            //document required
            if (this.documentDetailsService.HasRequiredDocument(this.documentDetails)) {
              return;
            }

            const filteredDocuments1 = this.filteredDocumentsGroup1.filter((e) => e.DocumentMasterID != 20)
            filteredDocuments1.forEach(e => e.IsMandatory = 1)

            const filteredDocuments2 = this.filteredDocumentsGroup2.filter((e) => e.DocumentMasterID != 20)
            filteredDocuments2.forEach(e => e.IsMandatory = 1)

            if (this.documentDetailsService.HasRequiredDocument(filteredDocuments1)) {
              return;
            }

            if (this.documentDetailsService.HasRequiredDocument(filteredDocuments2)) {
              return;
            }
            debugger

            this.documentDetails.forEach(e => {
              e.ModifyBy = this.SSOLoginDataModel.UserID;
              e.CandidateID = this.CandidateID    //this.request.ApplicationID;
            })

            this.loaderService.requestStarted();
            await this.counsellingApplicationFormService.SaveDocumentData_Counselling(this.documentDetails).then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));              
              if (data.State === EnumStatus.Success) {
                this.toastr.success(data.Message);
                this.formSubmitSuccess.emit(true);
                this.tabChange.emit(3);
              }else if (data.State === EnumStatus.Warning) {
                this.toastr.warning(data.ErrorMessage);
              } else {
                this.toastr.error(data.ErrorMessage);
              } 
            });
          } catch (Ex) {
            console.log(Ex);
          } finally {
            this.loaderService.requestEnded();
          }

        }
      });
  }

  async ResetData() {}

  async Back() {
    this.tabChange.emit(0)
  }
}
