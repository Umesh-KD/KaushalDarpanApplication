import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';

import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { EnumCasteCategory, EnumCourseType, EnumDepartment, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ApplicationDatamodel, BterDocumentsDataModel, BterOtherDetailsModel, BterSearchmodel, DocumentDetailList, QualificationDataModel } from '../../../../Models/ApplicationFormDataModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';
import { JanAadharMemberDetails } from '../../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute } from '@angular/router';
import { DocumentDetailsModel } from '../../../../Models/DocumentDetailsModel';
import { group } from '@angular/animations';
import { UploadBTERFileModel, UploadFileModel } from '../../../../Models/UploadFileModel';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { DeleteDocumentDetailsModel } from '../../../../Models/DeleteDocumentDetailsModel';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';

@Component({
  selector: 'app-direct-document-form',
  templateUrl: './direct-document-form.component.html',
  styleUrls: ['./direct-document-form.component.css'],
  standalone: false
})
export class DirectDocumentFormComponent implements OnInit {
  public testid: string = ''
  public SSOLoginDataModel = new SSOLoginDataModel()
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  public StateMasterList: any = []
  public DoocumentForm!: FormGroup;
  public request = new BterDocumentsDataModel()
  public Quali = new QualificationDataModel()
  public isSubmitted: boolean = false
  public file!: File;
  public _GlobalConstants: any = GlobalConstants;
  public formData = new BterOtherDetailsModel()
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public searchrequest = new BterSearchmodel()
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public documentDetails: DocumentDetailsModel[] = []
  public Is12Supp: boolean=false
  public Is10Supp: boolean=false
  public ApplicationID: number = 0
  public PersonalDetailsData = new ApplicationDatamodel()
  public Science_Vocational: boolean = false
  public senior_secondary: boolean = false
  public ItiMarksheet: boolean = false
  public NativeCertificate: boolean = false
  public Marksheet12: boolean = false
  public Graduation: boolean = false
  public PostGraduation: boolean = false
  public Diploma_Engineering: boolean = false
  public voc: boolean = false
  public deleteRequest = new DocumentDetailsModel()

  filteredDocumentsGroup1: any[] = [];
  filteredDocumentsGroup2: any[] = [];

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
    if (this.SSOLoginDataModel.ApplicationFinalSubmit == 2) {
      this.formSubmitSuccess.emit(true); // Notify parent of success
      this.tabChange.emit(6); // Move to the next tab (index 1)
    }
    this.ApplicationID = this.SSOLoginDataModel.ApplicationID;
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


    // this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"))
    if (this.SSOLoginDataModel.ApplicationID > 0) {
      this.searchrequest.ApplicationID = this.SSOLoginDataModel.ApplicationID;
      this.request.ApplicationID = this.SSOLoginDataModel.ApplicationID;
      await this.GetPersonalDetailsById()
      await this.GetByqualificationId()
      await this.GetOptionById()
      await this.GetById();
    }
    this.request.DepartmentID = 1;
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
            if (this.PersonalDetailsData.CourseType == 4) {
              const nonMandatoryIds = [76, 78, 79];

              this.filteredDocumentsGroup2.map((x: any) => {
                if (nonMandatoryIds.includes(x.DocumentMasterID)) {
                  x.IsMandatory = false;
                }
              });
            }

            if (this.PersonalDetailsData.CourseType == 5) {
              const nonMandatoryIds = [79];

              this.filteredDocumentsGroup2.map((x: any) => {
                if (nonMandatoryIds.includes(x.DocumentMasterID)) {
                  x.IsMandatory = false;
                }
              });
            }
            if (this.documentDetailsService.HasRequiredDocument(this.documentDetails)) {
              return;
            }

            const filteredDocuments1 = this.filteredDocumentsGroup1.filter((e) => e.DocumentMasterID != 20)
            filteredDocuments1.forEach(e => e.IsMandatory = 1)

            const filteredDocuments2 = this.filteredDocumentsGroup2.filter((e) => e.DocumentMasterID != 20)
            filteredDocuments2.forEach(e => e.IsMandatory = 1)

            if (this.PersonalDetailsData.CourseType == 4) {
              const nonMandatoryIds = [76, 78, 79];

              this.filteredDocumentsGroup2.map((x: any) => {
                if (nonMandatoryIds.includes(x.DocumentMasterID)) {
                  x.IsMandatory = false;
                }
              });
            }

            if (this.PersonalDetailsData.CourseType == 5) {
              const nonMandatoryIds = [79];

              this.filteredDocumentsGroup2.map((x: any) => {
                if (nonMandatoryIds.includes(x.DocumentMasterID)) {
                  x.IsMandatory = false;
                }
              });
            }

            if (this.documentDetailsService.HasRequiredDocument(filteredDocuments1)) {
              return;
            }

            if (this.documentDetailsService.HasRequiredDocument(filteredDocuments2)) {
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
                this.tabChange.emit(6);
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
          this.filteredDocumentsGroup1 = this.filteredDocumentDetails(1);
          this.filteredDocumentsGroup2 = this.filteredDocumentDetails(2);

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
    this.tabChange.emit(4)
  }

  filteredDocumentDetails(groupNo: number): any[] {
    if(this.PersonalDetailsData.CourseType == 4 || this.PersonalDetailsData.CourseType == 5){ 
      this.Marksheet12 = true
    }
    

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
    
    if (this.PersonalDetailsData.CategoryA !== EnumCasteCategory.SC) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_SC");
    }
    if (this.PersonalDetailsData.CategoryA !== EnumCasteCategory.ST) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_ST");
    }

    if (this.PersonalDetailsData.IsMBCCertificate != 1) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_MBC");
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
    if (this.PersonalDetailsData.CategoryA != EnumCasteCategory.EWS) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_EWS");
    }

    if (this.PersonalDetailsData.CategoryA !== EnumCasteCategory.OBC) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_OBC");
    }

    
    if (this.PersonalDetailsData.CategoryD == 179 || this.PersonalDetailsData.CategoryD == 0 ) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryD");
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
    if (this.Graduation == false) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "Graduation");
    }
    if (this.NativeCertificate == false) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "NativeCertificate");
    }
    if (this.Marksheet12 == false) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "Marksheet12");
    }
    if (this.PostGraduation == false) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "PostGraduation");
    }
    if (this.Diploma_Engineering == false) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "Diploma_Engineering");
    }
    if (this.Science_Vocational == false) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "10th_C_Voc");
    }
    if (this.ItiMarksheet == false) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "10th_2_Year_ITI");
    }
    if (this.senior_secondary == false) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "Senior_Secondary");
    }
    
    if (this.formData.ParentsIncome === 71) {
      if(this.formData.ApplyScheme !== 1) {
        filtered = filtered.filter((x: any) => x.ColumnName !== "IncomeCertificate");
      }
    } else {
      filtered = filtered.filter((x: any) => x.ColumnName !== "IncomeCertificate");
    }

    if (this.formData.IsSportsQuota !== true) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "SportsQuotaCertificate");
    }

    // if (this.formData.ApplyScheme !== 1 || this.PersonalDetailsData.CategoryA == EnumCasteCategory.EWS) {
    //   filtered = filtered.filter((x: any) => x.ColumnName !== "TFWSCertificate");
    // }

    if (this.Is10Supp==false) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "10thSupplementary");
    }

    if (this.Is12Supp == false) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "12thSupplementary");
    }
    
    if (this.voc == false) {
      filtered = filtered.filter((x: any) => x.ColumnName !== "D-Voc");
    }


    if (this.PersonalDetailsData.CategoryA == EnumCasteCategory.OBC || this.PersonalDetailsData.CategoryA == EnumCasteCategory.MBC || this.PersonalDetailsData.CategoryA == EnumCasteCategory.EWS) {
      const certDate = new Date(this.PersonalDetailsData.CertificateGeneratDate);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (certDate >= oneYearAgo) {
        // OBC certificate is valid → hide Affidavit
        filtered = filtered.filter((x: any) => x.ColumnName !== 'AffidavitCertificate');
      } else {
        // OBC certificate is old → show Affidavit, hide OBC
        //filtered = filtered.filter((x: any) => x.ColumnName !== 'CategoryA_OBC');
  
        //filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_MBC");
        //filtered = filtered.filter((x: any) => x.ColumnName !== "CategoryA_EWS");
      }
    } else {
      // Not OBC → hide both
      filtered = filtered.filter((x: any) =>
       x.ColumnName !== 'AffidavitCertificate'
      
      );
    }

    return filtered;
  }




  //document
  async UploadDocument(event: any, item: any) {
    try {
      //upload model
      let uploadModel: UploadBTERFileModel = {
        ApplicationID: this.SSOLoginDataModel.ApplicationID.toString() ?? "0",
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
      await this.documentDetailsService.UploadBTERDocument(event, uploadModel)
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
      debugger
      let deleteModel = new DeleteDocumentDetailsModel()

      deleteModel.FolderName = item.FolderName ?? "";
      deleteModel.FileName = item.FileName;
      //call
      await this.documentDetailsService.DeleteBTERDocument(deleteModel)
        .then(async (data: any) => {
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.documentDetails.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.documentDetails[index].FileName = '';
              this.documentDetails[index].Dis_FileName = '';
            }

            await this.DeleteApplicationDocument_FromTable(item);
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

  async DeleteApplicationDocument_FromTable(item: any) {

    try {
      this.deleteRequest.TransactionID = item.TransactionID;
      this.deleteRequest.DocumentDetailsID = item.DocumentDetailsID;
      this.deleteRequest.ModifyBy = this.SSOLoginDataModel.UserID;

      this.loaderService.requestStarted();
      await this.ApplicationService.DeleteDocumentById(this.deleteRequest)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
          } 
          // else {
          //   this.toastr.error(data.ErrorMessage)
          // }
        });
    }
    catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
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



  async GetByqualificationId() {
    this.isSubmitted = false;
    this.searchrequest.SSOID = this.SSOLoginDataModel.SSOID
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetQualificationDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {            
            this.Quali = data['Data']
            console.log("this.Quali",this.Quali);
            debugger
            if (this.PersonalDetailsData.CourseType != 4 ){
              if (this.Quali.HighestQualificationModel != null) {
                this.Quali.HighestQualificationModel.map((list: any) => {
                  if (list.HighestQualificationHigh == "12" || list.HighestQualificationHigh == "12Th") {
                    this.Marksheet12 = true
                  }
                  if (list.HighestQualificationHigh == "Graduation") {
                    this.Graduation = true
                  }
                  if (list.HighestQualificationHigh == "PostGraduation") {
                    this.PostGraduation = true
                  }
                  if (list.HighestQualificationHigh == "D-Voc") {
                    this.voc = true
                  }
                })
              }       
            }

            if (this.Quali.LateralEntryQualificationModel != null) {

              this.Quali.LateralEntryQualificationModel.map((list: any) => {
                if (list.Qualification == "Diploma") {
                  this.Diploma_Engineering = true
                }
                else if (list.Qualification == "10th + C.Voc") {
                  this.Science_Vocational = true
                }
                else if (list.Qualification == "12Th") {
                  this.Marksheet12 = true
                }
                
                else if (list.Qualification == "10th + ITI") {
                  this.ItiMarksheet = true
                }
                else if (list.Qualification == "10th + D.Voc") {
                  this.voc = true
                }
                else if (list.Qualification == "10th + ITI + English") {
                  this.ItiMarksheet = true
                }
              })
            }

            this.Quali.SupplementaryDataModel.find((list: any) => {
              if (list.EducationCategory == "12") {
                this.Is12Supp = true
              }
              if (list.EducationCategory == "10") {
                this.Is10Supp = true
              }
            })
            }

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
  //end document

  async GetOptionById() {
    this.isSubmitted = false;
    this.searchrequest.SSOID = this.SSOLoginDataModel.SSOID
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetOtherDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {
            this.formData=data['Data']
             }

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

}



