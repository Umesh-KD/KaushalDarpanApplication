import { Component } from '@angular/core';
import { AdminUserDetailModel, AdminUserSearchModel } from '../../../../Models/AdminUserDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { AdminUserService } from '../../../../Services/BTERAdminUser/admin-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ITIPapperSetterDataModel } from '../../../../Models/ITIPapperSetterDataModel';
import { ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { HomeService } from '../../../../Services/Home/home.service';
import { CampusDetailsWebSearchModel } from '../../../../Models/CampusDetailsWebDataModel';
import { Subscription } from 'rxjs';
import { ITIPapperSetterService } from '../../../../Services/ITI/ITIPapperSetter/itipapper-setter.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-paper-set-professor',
  standalone: false,
  templateUrl: './paper-set-professor.component.html',
  styleUrl: './paper-set-professor.component.css'
})
export class PaperSetProfessorComponent {

  public request = new ITIPapperSetterDataModel()
  public tradeSearchRequest = new ItiTradeSearchModel()
  public Table_SearchText: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  private userDataSubscription!: Subscription;
  public PaperFormGroup!: FormGroup;
  public DistrictMasterList: any = [];
  public AddProfessorList: any = [];
  public SSOLoginDataModel = new SSOLoginDataModel()
  AssignList: any = []
  isModalOpen: boolean = false;
  UploadedPaperFileName = '';
  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  imageSrc: string | null = null;
  isError: boolean = false;
  public Id: number  = 0;
  constructor(

    private commonFunctionService: CommonFunctionService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private PapperSetterService: ITIPapperSetterService,
    private appsettingConfig: AppsettingService,
    private routers: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient

  ) { }


  async ngOnInit() {

  
   

    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.Createdby = this.SSOLoginDataModel.UserID;
    this.request.Roleid = this.SSOLoginDataModel.RoleID;
    this.request.Endtermid = this.SSOLoginDataModel.EndTermID;
    this.request.FYID = this.SSOLoginDataModel.FinancialYearID;



    this.Id = Number(this.route.snapshot.paramMap.get('id')?.toString());

    if (this.Id)
    {
      this.GetSubjectListbyProfesorIDforPaperUpload(this.SSOLoginDataModel.UserID, this.SSOLoginDataModel.SSOID, this.SSOLoginDataModel.RoleID, this.Id);
    }
   // this.GetSubjectListbyProfesorIDforPaperUpload(this.SSOLoginDataModel.UserID, this.SSOLoginDataModel.SSOID, this.SSOLoginDataModel.RoleID, this.Id);
  }

  async GetSubjectListbyProfesorIDforPaperUpload(ProfessorID : number , SSOID : string , Roleid : number ,  TypeID: Number)
  {
    
    try {
      this.loaderService.requestStarted();
      await this.PapperSetterService.GetAllListForPaperUploadByprofesdorID(ProfessorID, SSOID, Roleid, TypeID ).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.AssignList = data.Data
         
        console.log(this.AssignList, "AssignList")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  //Upload Paper by Professor  
  public file!: File;

  async onFilechange(event: any) {
    try {


      this.file = event.target.files[0];
      if (this.file) {

        // Type validation
        if (['application/pdf'].includes(this.file.type)) {
          // Size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else {
          this.toastr.error('Select Only pdf file');
          //const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
          //if (fileInput) {
          // fileInput.value = '';  // clear FileInput
          //}
          this.UploadedPaperFileName = '';
          this.request.GuideLinesDocumentFile = '';
          event.target.value = null;
          return;
        }

        //upload model
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = this.file.type ?? "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "ITIPaperSetter/UploadedPaperPDF"; 

        //Upload to server folder
        await this.commonFunctionService.UploadDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success)
            {

              const fileName = data['Data'][0]["Dis_FileName"];
              const actualFile = data['Data'][0]["FileName"];

              this.UploadedPaperFileName = data['Data'][0]["FileName"];
              this.request.GuideLinesDocumentFile = this.UploadedPaperFileName;
             // this.router.navigate(['/dashboard']);

            }

            if (data.State === EnumStatus.Error)
            {
              this.toastr.error(data.ErrorMessage);

            } else if (data.State === EnumStatus.Warning)
            {
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

  async Update_UploadedPaperDetails() {
    try {

      const Remark = document.getElementById('txtRemark') as HTMLTextAreaElement;

      if (this.UploadedPaperFileName == '' && this.request.GuideLinesDocumentFile == '')
      {
        this.toastr.error('Please Upload Papper File');
        return;
      }

      if (Remark.value == '')
      {
        this.toastr.error('Please Enter Remark');
        return;
      }

      this.loaderService.requestStarted();
      await this.PapperSetterService.UploadedPaperDetails(this.request.GuideLinesDocumentFile, Remark.value, this.request.Createdby, this.request.PKID, this.SSOLoginDataModel.RoleID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0 && data.Data[0].msg =="Success")
        {
          this.toastr.success('Paper uploaded successfully.');
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.CloseModal();
             this.router.navigate(['/dashboard']);
            /*this.GetSubjectListbyProfesorIDforPaperUpload(this.SSOLoginDataModel.UserID, this.SSOLoginDataModel.SSOID, this.SSOLoginDataModel.RoleID, this.Id);*/
          }, 500);
        }

      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  async openModal(content: any, PKID : number ) {
    this.request.PKID = PKID;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //openModal() {
  //  this.isModalOpen = true;
  //}

  CloseModal() {
    this.request.PKID=0
    this.request.Remark = ''
    this.UploadedPaperFileName = '';
    this.request.GuideLinesDocumentFile=''
    this.modalService.dismissAll();
  }


  async openPdfModal(url: string): Promise<void> {
    const ext = url.split('.').pop()?.toLowerCase();
    this.isPdf = ext === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');

    this.safePdfUrl = null;
    this.imageSrc = '';
    this.pdfUrl = url;
    this.isError = false;

    try {
      const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.imageSrc = blobUrl;
      } else {
        throw new Error('Blob is undefined');
      }
    } catch (error) {
      console.error('File load failed, using dummy image.', error);
      this.isPdf = false;
      this.isImage = true;
      this.safePdfUrl = null;
      this.imageSrc = 'assets/images/dummyImg.jpg';
      this.isError = true;
    }

    this.showPdfModal = true;
  }


  ClosePopupAndGenerateAndViewPdf(): void {
    this.showPdfModal = false;
    this.safePdfUrl = null;
    this.pdfUrl = null;
    this.imageSrc = null;
    this.isPdf = false;
    this.isImage = false;
    this.isError = false;
  }

}
