import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { EnumCasteCategory, EnumCourseType, EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ApplicationDatamodel, BterDocumentsDataModel, BterSearchmodel, DocumentDetailList } from '../../../Models/ApplicationFormDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { JanAadharMemberDetails } from '../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute } from '@angular/router';
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { group } from '@angular/animations';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { DocumentDetailsService } from '../../../Common/document-details';
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.css'],
  standalone: false
})
export class DocumentFormComponent implements OnInit {
  public testid: string = ''
  public SSOLoginDataModel = new SSOLoginDataModel()
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  public StateMasterList: any = []
  public DoocumentForm!: FormGroup;
  public request = new BterDocumentsDataModel()
  public isSubmitted: boolean = false
  public file!: File;
  public _GlobalConstants: any = GlobalConstants;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public searchrequest = new BterSearchmodel()
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public documentDetails: DocumentDetailsModel[] = []

  public ApplicationID: number = 0
  public PersonalDetailsData = new ApplicationDatamodel()

  constructor(
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private ApplicationService: BterApplicationForm,
    private activatedRoute: ActivatedRoute,
    private documentDetailsService: DocumentDetailsService,
    private encryptionService: EncryptionService,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.DoocumentForm = this.formBuilder.group(
      {
        //qualificationCheckBox: ['', Validators.required],
        //ddlState: ['', [DropdownValidators]],
        //txtBoardUniversity: ['', Validators.required],
        //txtSchoolCollege: ['', Validators.required],
        //txtHighestQualification: ['', Validators.required],
        //txtYearOfPassing: ['', Validators.required],
        //txtRollNumber: ['', Validators.required],
        //ddlMarksType: ['', [DropdownValidators]],
        //txtMaxMarks: ['', Validators.required],
        //txtMarksObatined: ['', Validators.required],
        //txtPercentage: ['', Validators.required],
      });


    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"))
    if (this.ApplicationID > 0) {
      this.searchrequest.ApplicationID = this.ApplicationID;
      this.request.ApplicationID = this.ApplicationID;
      this.GetPersonalDetailsById()
      this.GetById();

    }

  }

  get _DoocumentForm() { return this.DoocumentForm.controls; }

  ResetData() {
    this.documentDetails = [];
  }

  async SaveData() {
    this.Swal2.Confirmation("Are you sure you want to upload this document ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          try {
            //document required
            if (this.documentDetailsService.HasRequiredDocument(this.documentDetails)) {
              return;
            }
            if (this.PersonalDetailsData.CourseType == EnumCourseType.Lateral) {
              const IsLateral = this.documentDetails.find(e => e.ColumnName == 'HigherQualification' && e.FileName == '')
              if (IsLateral) {
                this.toastr.error("Please Upload Higher Qualification Documents")
                return
              }
            }
            this.request.ModifyBy = this.SSOLoginDataModel.UserID
            this.request.DepartmentID = EnumDepartment.BTER;
            //this.searchrequest.EndTermID = this.SSOLoginDataModel.EndTermID;
            //this.searchrequest.Eng_NonEng = this.SSOLoginDataModel.Eng_NonEng;

            this.documentDetails.forEach(e => {
              e.ModifyBy = this.SSOLoginDataModel.UserID;
              e.TransactionID = this.request.ApplicationID;
            })

            this.loaderService.requestStarted();
            await this.ApplicationService.SaveDocumentData(this.documentDetails).then((data: any) => {

              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (data.State == EnumStatus.Success) {

                this.toastr.success(data.Message);
                this.formSubmitSuccess.emit(true);
                this.tabChange.emit(5);
              }
              if (data.State === EnumStatus.Error) {
                this.toastr.error(data.ErrorMessage);
              } else if (data.State === EnumStatus.Warning) {
                this.toastr.warning(data.ErrorMessage);
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

  async GetById() {
    try {
      this.isSubmitted = false;

      this.searchrequest.SSOID = this.SSOLoginDataModel.SSOID
      this.searchrequest.DepartmentID = EnumDepartment.BTER;
      //this.searchrequest.EndTermID = this.SSOLoginDataModel.EndTermID;
      //this.searchrequest.Eng_NonEng = this.SSOLoginDataModel.Eng_NonEng;

      this.loaderService.requestStarted();
      await this.ApplicationService.GetDocumentDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'data ');
          this.request.ApplicationID = data['Data']['ApplicationID'];
          /*  alert(this.formData.ApplicationID)*/
          //if (data['Data'] != null) {

          //this.request = data['Data'];

          if (data['Data']['Dis_SignaturePhoto'] != null) {

            this.request.Dis_SignaturePhoto = data['Data']['Dis_SignaturePhoto'];
          }
          if (data['Data']['Dis_StudentPhoto'] != null) {

            this.request.Dis_StudentPhoto = data['Data']['Dis_StudentPhoto'];
          }
          if (data['Data']['Dis_PrefCategory'] != null) {

            this.request.Dis_PrefCategory = data['Data']['Dis_PrefCategory'];
          }
          if (data['Data']['Dis_AadharPhoto'] != null) {

            this.request.Dis_AadharPhoto = data['Data']['Dis_AadharPhoto'];
          }
          if (data['Data']['AadharPhoto'] != null) {

            this.request.AadharPhoto = data['Data']['AadharPhoto'];
          }
          if (data['Data']['Dis_Marksheet'] != null) {

            this.request.Dis_Marksheet = data['Data']['Dis_Marksheet'];
          }
          if (data['Data']['Dis_MotherDepCertificate'] != null) {

            this.request.Dis_MotherDepCertificate = data['Data']['Dis_MotherDepCertificate'];
          }
          if (data['Data']['StudentPhoto'] != null) {

            this.request.StudentPhoto = data['Data']['StudentPhoto'];
          }
          if (data['Data']['SignaturePhoto'] != null) {

            this.request.SignaturePhoto = data['Data']['SignaturePhoto'];
          }
          if (data['Data']['PrefCategory'] != null) {

            this.request.PrefCategory = data['Data']['PrefCategory'];
          }
          if (data['Data']['MotherDepCertificate'] != null) {

            this.request.MotherDepCertificate = data['Data']['MotherDepCertificate'];
          }
          if (data['Data']['Marksheet'] != null) {

            this.request.Marksheet = data['Data']['Marksheet'];
          }


          this.documentDetails = data['Data']['DocumentDetails']

          if (data['Data']['Dis_Minority'] != null) {
            this.request.Dis_Minority = data['Data']['Dis_Minority']

          }
          if (data['Data']['Minority'] != null) {
            this.request.Minority = data['Data']['Minority']

          }
          /* alert(this.request.IsSupplement)*/
          console.log(data['Data'], 'ffff');

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

  async Back() {
    this.tabChange.emit(3)
  }

  //filteredDocumentDetails(groupNo: number): any[] {
  //  if (groupNo == 2) {
  //    let filtered = this.documentDetails.filter((x) => x.GroupNo == groupNo);

  //    if (this.PersonalDetailsData.IsMinority == false) {
  //      filtered = filtered.filter((x: any) => x.ColumnName != "Minority");
  //    }
  //    if (this.PersonalDetailsData.CategoryE !== 1) {
  //      filtered = filtered.filter((x: any) => x.ColumnName != "MotherDepCertificate");
  //    }
  //    if (this.PersonalDetailsData.CourseType !== EnumCourseType.Lateral) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "HigherQualification");
  //    }
  //    if (this.PersonalDetailsData.CategoryA !== EnumCasteCategory.SC) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_SC");
  //    }
  //    if (this.PersonalDetailsData.CategoryA !== EnumCasteCategory.ST) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_ST");
  //    }
  //    if (this.PersonalDetailsData.CategoryA !== EnumCasteCategory.OBC) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_OBC");
  //    }
  //    if (this.PersonalDetailsData.CategoryA !== EnumCasteCategory.MBC) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_MBC");
  //    }
  //    if (this.PersonalDetailsData.CategoryB !== 1) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryB_11");
  //    }
  //    if (this.PersonalDetailsData.CategoryB !== 2) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryB_12");
  //    }
  //    if (this.PersonalDetailsData.CategoryB !== 3) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryB_13");
  //    }
  //    if (this.PersonalDetailsData.CategoryB !== 4) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryB_14");
  //    }
  //    if (this.PersonalDetailsData.CategoryB !== 5) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryB_15");
  //    }
  //    if (this.PersonalDetailsData.CategoryB !== 6) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryB_16");
  //    }
  //    if (this.PersonalDetailsData.CategoryB !== 7) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryB_17");
  //    }
  //    if (this.PersonalDetailsData.CategoryB !== 8) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryB_18");
  //    }
  //    if (this.PersonalDetailsData.CategoryB !== 9) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryB_19");
  //    }
  //    if (this.PersonalDetailsData.IsKM !== '1') {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryC_KM");
  //    }
  //    if (this.PersonalDetailsData.IsPH !== '1') {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryC_PH");
  //    }
  //    if (this.PersonalDetailsData.IsDevnarayan == 0) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "DevnarayanCertificate");
  //    }
  //    if (this.PersonalDetailsData.IsTSP == false) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "TSPAreaCertificatePhoto");
  //    }
  //    if (this.PersonalDetailsData.EWS == 0) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_EWS");
  //    }
  //    if (this.PersonalDetailsData.IsDevnarayan !== 1) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "DevnarayanCertificate");
  //    }
  //    if (this.PersonalDetailsData.Prefential != 2) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "PrefCategory_1");
  //    }
  //    if (this.PersonalDetailsData.Prefential != 5) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "PrefCategory_5");
  //    }
  //    if (this.PersonalDetailsData.Prefential != 7) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "PrefCategory_7");
  //    }
  //    if (this.PersonalDetailsData.Prefential != 6) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "PrefCategory_6");
  //    }

  //    if (this.PersonalDetailsData.CategoryA != 4) {
  //      filtered = filtered.filter((x: any) => x.ColumnName !== "AffidavitCertificate");
  //    }
  //    if (
  //      this.PersonalDetailsData.CategoryA == 4 &&
  //      this.PersonalDetailsData.CertificateGeneratDate
  //    ) {
  //      const certDate = new Date(this.PersonalDetailsData.CertificateGeneratDate);
  //      const oneYearAgo = new Date();
  //      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  //      if (certDate > oneYearAgo) {
  //        // Certificate is less than 1 year old → Include Affidavit
  //        // (Do nothing — keep Affidavit document)
  //        filtered = filtered.filter((x: any) => x.ColumnName !== 'CategoryA_OBC');
  //      } else {
  //        // Certificate is more than 1 year old → Remove Affidavit document
  //        filtered = filtered.filter((x: any) => x.ColumnName !== 'AffidavitCertificate');
  //      }



  //      return filtered;
  //    } else {
  //      return this.documentDetails.filter((x) => x.GroupNo == groupNo);
  //    }


  //  }
  //}


  filteredDocumentDetails(groupNo: number): any[] {
    if (groupNo !== 2) {
      return this.documentDetails.filter((x) => x.GroupNo === groupNo);
    }

    let filtered = this.documentDetails.filter((x) => x.GroupNo === groupNo);

    if (!this.PersonalDetailsData.IsMinority) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "Minority");
    }
    if (this.PersonalDetailsData.CategoryE !== 1) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "MotherDepCertificate");
    }
    if (this.PersonalDetailsData.CourseType !== EnumCourseType.Lateral) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "HigherQualification");
    }
    if (this.PersonalDetailsData.CategoryA !== EnumCasteCategory.SC) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_SC");
    }
    if (this.PersonalDetailsData.CategoryA !== EnumCasteCategory.ST) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_ST");
    }
    if (this.PersonalDetailsData.CategoryA !== EnumCasteCategory.MBC) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_MBC");
    }

    for (let i = 1; i <= 9; i++) {
      if (this.PersonalDetailsData.CategoryB !== i) {
        filtered = filtered.filter((x: any) => x.ColumnName !== `CategoryB_1${i}`);
      }
    }

    if (this.PersonalDetailsData.IsKM !== '1') {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryC_KM");
    }
    if (this.PersonalDetailsData.IsPH !== '1') {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryC_PH");
    }
    if (this.PersonalDetailsData.IsDevnarayan !== 1) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "DevnarayanCertificate");
    }
    if (!this.PersonalDetailsData.IsTSP) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "TSPAreaCertificatePhoto");
    }
    if (this.PersonalDetailsData.EWS === 0) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_EWS");
    }

    if (this.PersonalDetailsData.Prefential !== 2) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "PrefCategory_1");
    }
    if (this.PersonalDetailsData.Prefential !== 5) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "PrefCategory_5");
    }
    if (this.PersonalDetailsData.Prefential !== 6) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "PrefCategory_6");
    }
    if (this.PersonalDetailsData.Prefential !== 7) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "PrefCategory_7");
    }

    // OBC & Affidavit logic
  
    if (this.PersonalDetailsData.CategoryA != EnumCasteCategory.GENERAL) {
      const certDate = new Date(this.PersonalDetailsData.CertificateGeneratDate);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (certDate >= oneYearAgo) {
        // OBC certificate is valid → hide Affidavit
        filtered = filtered.filter((x: any) => x.ColumnName !== 'AffidavitCertificate');
      } else {
        // OBC certificate is old → show Affidavit, hide OBC
        filtered = filtered.filter((x: any) => x.ColumnName !== 'CategoryA_OBC');
  

        filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_MBC");
        filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_EWS");
      }
    } else {
      // Not OBC → hide both
      filtered = filtered.filter((x: any) =>
        x.ColumnName !== 'CategoryA_OBC'  && x.ColumnName !== 'CategoryA_EWS' && x.ColumnName !== 'CategoryA_MBC' && x.ColumnName !== 'AffidavitCertificate'
      );
    }

    return filtered;
  }




  //document
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
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
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
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)
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
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.documentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.documentDetails[index].FileName = '';
              this.documentDetails[index].Dis_FileName = '';
            }
            console.log(this.documentDetails)
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetPersonalDetailsById() {
    // const DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetApplicationDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {
            this.PersonalDetailsData = data['Data']
            const dateFields: (keyof ApplicationDatamodel)[] = [
              'CertificateGeneratDate'
            ];

            dateFields.forEach((field) => {
              const value = this.PersonalDetailsData[field];
              if (value) {
                const rawDate = new Date(value as string);
                const year = rawDate.getFullYear();
                const month = String(rawDate.getMonth() + 1).padStart(2, '0');
                const day = String(rawDate.getDate()).padStart(2, '0');
                (this.PersonalDetailsData as any)[field] = `${year}-${month}-${day}`;
              }
            });
            console.log("PersonalDetailsData", this.PersonalDetailsData);
          }
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }



  //end document
}



