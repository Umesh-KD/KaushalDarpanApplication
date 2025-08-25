import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentDetailList, DocumentDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumCasteCategory, EnumCourseType, EnumDepartment, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { ItiApplicationSearchmodel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { ActivatedRoute } from '@angular/router';
import { DocumentDetailsModel } from '../../../../Models/DocumentDetailsModel';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { DeleteDocumentDetailsModel } from '../../../../Models/DeleteDocumentDetailsModel';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-iti-direct-document-form',
  standalone: false,
  templateUrl: './iti-direct-document-form.component.html',
  styleUrl: './iti-direct-document-form.component.css'
})
export class ITIDirectDocumentFormComponent {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public DocumentDetailsFormGroup!: FormGroup;
  public formData = new DocumentDetailsDataModel()
  public _GlobalConstants: any = GlobalConstants;
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public searchRequest = new ItiApplicationSearchmodel()
  public isSubmitted:boolean = false
  public QualificationDataList: any = []
  public box10thChecked:boolean = false
  public box8thChecked:boolean = false
  public box12thChecked:boolean = false
  public addrequest: DocumentDetailList[] = []
  public ApplicationID: number = 0;
  public PersonalDetailsData: any = []
  public documentDetails: DocumentDetailsModel[] = []
  groupedDocs: any = [];
  docsForUpload: any = [];
  _EnumRole = EnumRole

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    public appsettingConfig: AppsettingService,
    private ItiApplicationFormService: ItiApplicationFormService,
    private activatedRoute: ActivatedRoute,
    private documentDetailsService: DocumentDetailsService,
    private encryptionService: EncryptionService
  ) { }

  ngOnInit() {
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.DocumentDetailsFormGroup = this.formBuilder.group({

    });


    //set DepartmentID 
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0")) 
    if (this.ApplicationID > 0)
    {
      this.searchRequest.ApplicationID = this.ApplicationID;
      this.formData.ApplicationID = this.ApplicationID;
      this.GetById()
      this.QualificationDataById()
      this.GetPersonalDetailsById()
    }
   
  }
  public file!: File;

  async SaveDocumentDetails() {
    try {
      // if (this.documentDetailsService.HasRequiredDocument(this.documentDetails)) {
      //   return;
      // }
      
   

      if (this.documentDetailsService.HasRequiredDocument(this.documentDetails)) {
        return;
      }

      const filteredDocuments1 = this.filteredDocuments.filter((e) => e.DocumentMasterID != 20)
      filteredDocuments1.forEach(e => e.IsMandatory = 1)

      if (this.documentDetailsService.HasRequiredDocument(filteredDocuments1)) {
        return;
      }

      console.log(this.filteredDocuments)

      this.loaderService.requestStarted();

      this.formData.ModifyBy = this.SSOLoginDataModel.UserID;
      this.formData.SSOID = this.SSOLoginDataModel.SSOID;
      

      this.documentDetails.forEach(e => {
        e.ModifyBy = this.SSOLoginDataModel.UserID;
        e.TransactionID = this.formData.ApplicationID;
      })

      console.log("documentDetails at SaveDocumentDetails",this.documentDetails)

      await this.ItiApplicationFormService.SaveDocumentDetailsData(this.documentDetails)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.tabChange.emit(5)
          }
          else {
            this.toastr.error(data.ErrorMessage)
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

  filteredDocuments: any[] = [];
  filteredDocumentDetails(groupNo: number): any[] {

    if (groupNo == 2) {
      if (!this.filteredDocuments.length) {
        let filtered = this.documentDetails.filter((x) => x.GroupNo == groupNo);

        if (this.PersonalDetailsData.IsTSP == false) {
          filtered = filtered.filter((x: any) => x.ColumnName != "TSPAreaCertificatePhoto");
        }
        if (!this.box10thChecked) {
          filtered = filtered.filter((x: any) => x.ColumnName !== "Marksheet10");
        }
        if (!this.box8thChecked) {
          filtered = filtered.filter((x: any) => x.ColumnName !== "Marksheet8");
        }
        if (!this.box12thChecked) {
          filtered = filtered.filter((x: any) => x.ColumnName !== "Marksheet12");
        }
        if (this.PersonalDetailsData.CategoryC !== 69) {
          filtered = filtered.filter((x: any) => x.ColumnName != "PhysicallyHandicappedCertificatePhoto");
          filtered = filtered.filter((x: any) => x.ColumnName != "PH_Doc_For_Trade");
        }
        if (this.PersonalDetailsData.CategoryC !== 68) {
          filtered = filtered.filter((x: any) => x.ColumnName != "KashmiriMigrantsCertificatePhoto");
        }
        if (this.PersonalDetailsData.IsMinority == false) {
          filtered = filtered.filter((x: any) => x.ColumnName != "Minority");
        }
        if(this.PersonalDetailsData.IsDevnarayan == false) {
          filtered = filtered.filter((x: any) => x.ColumnName != "DevnarayanCertificate");
        }

        // ------------------------------Caste Category Filters------------------------------------------------
        if (this.PersonalDetailsData.CategoryA != EnumCasteCategory.ST) {
          filtered = filtered.filter((x: any) => x.ColumnName != "CategoryA_ST")
        }
        if (this.PersonalDetailsData.CategoryA != EnumCasteCategory.SC) {
          filtered = filtered.filter((x: any) => x.ColumnName != "CategoryA_SC")
        }
        if (this.PersonalDetailsData.CategoryA != EnumCasteCategory.OBC) {
          filtered = filtered.filter((x: any) => x.ColumnName != "CategoryA_OBC")
        }
        if (this.PersonalDetailsData.CategoryA != EnumCasteCategory.EWS) {
          filtered = filtered.filter((x: any) => x.ColumnName != "CategoryA_EWS")
        }
        if (this.PersonalDetailsData.CategoryA != EnumCasteCategory.MBC) {
          filtered = filtered.filter((x: any) => x.ColumnName != "CategoryA_MBC")
        }

        // ------------------------------Category B Filters------------------------------------------------
        if (this.PersonalDetailsData.CategoryB != 11) {
          filtered = filtered.filter((x: any) => x.ColumnName != "CategoryB_11")
        }
        if (this.PersonalDetailsData.CategoryB != 12) {
          filtered = filtered.filter((x: any) => x.ColumnName != "CategoryB_12")
        }
        if (this.PersonalDetailsData.CategoryB != 13) {
          filtered = filtered.filter((x: any) => x.ColumnName != "CategoryB_13")
        }
        if (this.PersonalDetailsData.CategoryB != 14) {
          filtered = filtered.filter((x: any) => x.ColumnName != "CategoryB_14")
        }
     

        setTimeout(() => {
          this.filteredDocuments = filtered;
        }, 200);

      }
      return this.filteredDocuments;

     
    } else {
      return this.documentDetails.filter((x) => x.GroupNo == groupNo);
    }    
  }

  async GetById() {
    this.isSubmitted = false;
    this.searchRequest.SSOID = this.SSOLoginDataModel.SSOID
    this.searchRequest.Eng_NonEng = EnumCourseType.Engineering
    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetDocumentDatabyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          // this.formData = data.Data
          console.log("formdata GetDocumentDatabyID", data.Data)

          //document
          this.documentDetails = data['Data']['DocumentDetails']

          console.log("documentDetails", this.documentDetails)

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

  async QualificationDataById() {
    this.isSubmitted = false;
    try {
      this.searchRequest.ApplicationID = this.ApplicationID
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetQualificationDatabyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.QualificationDataList = data.Data
          this.QualificationDataList.map((list: any) => {
            if(list.Qualification == "10") {
              this.box10thChecked = true
            }
            if (list.Qualification == "8") {
              this.box8thChecked = true
            }
            if (list.Qualification == "12") {
              this.box12thChecked = true
            }
          })
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async Back() {
    this.tabChange.emit(3)
  }

  async DeleteDocumentList(DocumentType: string) {
    try {
      const index = this.addrequest.findIndex((item: any) => item.ColumnName === DocumentType);
      if (index !== -1) {
        this.addrequest.splice(index, 1);
      }
      console.log(this.addrequest,"tawiejfkas dfjk");
    } catch (exc) {
      console.log(exc);
    }
  }

  async AddDocumentList(DocumentType: any) {
    try {
      this.addrequest.push(DocumentType);
    }
    catch (exc) {
      console.log(exc)
    }
  }

  ResetDocumentDetails() {
    this.formData.StudentPhoto = '';
    this.formData.SignaturePhoto = '';
    this.formData.Marksheet8thPhoto = '';
    this.formData.Marksheet10thPhoto = '';
    this.formData.AadharPhoto = '';
    this.formData.AffidavitPhoto = '';
    this.formData.WKA_CertificatePhoto = '';
    this.formData.Dis_StudentPhoto = '';
    this.formData.Dis_SignaturePhoto = '';
    this.formData.Dis_Marksheet8thPhoto = '';
    this.formData.Dis_Marksheet10thPhoto = '';
    this.formData.Dis_Marksheet12thPhoto = '';
    this.formData.Dis_AadharPhoto = '';
    this.formData.Dis_AffidavitPhoto = '';
    this.formData.Dis_WKA_CertificatePhoto = '';
    this.formData.PH_CertificatePhoto = '';
    this.formData.Dis_PH_CertificatePhoto = '';
    this.formData.Dis_KM_CertificatePhoto = '';
    this.formData.KM_CertificatePhoto = '';
    this.formData.Minority = ''
    this.formData.Dis_Minority=''
  }

  async GetPersonalDetailsById() {
    // const DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetApplicationDatabyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null){ 
            this.PersonalDetailsData = data['Data']
            console.log("PersonalDetailsData",this.PersonalDetailsData);
          }
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
    this.formData.Minority = ''
    this.formData.Dis_Minority = ''
  }

  async UploadDocument(event: any, item: any) {
    try {
      //upload model
      let uploadModel = new UploadFileModel();
      uploadModel.FileExtention = item.FileExtention ?? "";
      uploadModel.MinFileSize = item.MinFileSize ?? "";
      uploadModel.MaxFileSize = item.MaxFileSize ?? "";
      uploadModel.FolderName = item.FolderName ?? "";
      //call
      await this.documentDetailsService.UploadDocument(event, uploadModel)
        .then((data: any) => {
          
          if (data.State == EnumStatus.Success) {
            //add/update document in js list
            const index = this.documentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.documentDetails[index].FileName = data.Data[0].FileName;
              this.documentDetails[index].Dis_FileName = data.Data[0].Dis_FileName;
            }
            console.log(this.documentDetails)
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
      let deleteModel = new DeleteDocumentDetailsModel()
      deleteModel.FolderName = item.FolderName ?? "";
      deleteModel.FileName = item.FileName;
      //call
      await this.documentDetailsService.DeleteDocument(deleteModel)
        .then((data: any) => {
          
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.documentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.documentDetails[index].FileName = '';
              this.documentDetails[index].Dis_FileName = '';
            }
            console.log(this.documentDetails)
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
}
