import { Component   } from '@angular/core';
import { AdminUserDetailModel, AdminUserSearchModel } from '../../../../Models/AdminUserDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-paper-auto-select',
  standalone: false,
  templateUrl: './paper-auto-select.component.html',
  styleUrl: './paper-auto-select.component.css'
})
export class PaperAutoSelectComponent {
  public request = new ITIPapperSetterDataModel()
  public tradeSearchRequest = new ItiTradeSearchModel()
  ItiTradeListAll: any = []
  ProfessorListAll: any = []
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  private userDataSubscription!: Subscription;
  public PaperFormGroup!: FormGroup;
  public DistrictMasterList: any = [];
  public AddProfessorList: any = [];
  public SSOLoginDataModel = new SSOLoginDataModel()
  Dis_AadharPhoto = '';
  GuideLineDoc = '';
  SubjectListAll: any = []
  DIVAutoselect: boolean = true;
  DIVTradeDtl: boolean = false;
  highlightedRow: string | null = null;
  ProfesorList: any = [];
  AllAssignListDataArray: any[] = [];
  IsAllPaperUpload: boolean = true;
  IsAnyPaperRevert: boolean = false;
  txtProfessorName: string = "";
  txtReason: string = "";
  txtDistrictName: string = "";
  txtyearTrade: string = "";

  txtTradename: string = "";
  txtSubjectNamee: string = "";
  txtpapperSubmitionLastDate: string = "";
  txtPapperCode_Name: string = "";
   

  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  imageSrc: string | null = null;
  isError: boolean = false;
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
    private http: HttpClient,


  ) { }

  async ngOnInit()
  {

    this.DIVAutoselect = true;
    this.DIVTradeDtl =false
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.Createdby = this.SSOLoginDataModel.UserID;
    this.request.Roleid = this.SSOLoginDataModel.RoleID;
    this.request.Endtermid = this.SSOLoginDataModel.EndTermID;
    this.request.FYID = this.SSOLoginDataModel.FinancialYearID;
     

    const ViewID = sessionStorage.getItem('PaperSetterAssignListViewId');
    if (ViewID != undefined && parseInt(ViewID) > 0) {
      this.GetPaperUploadedProfessorListBy_PKID(parseInt(ViewID));
      console.log(ViewID);
    }
    else
    {
      this.GoToPaperSetAssignListPage();
      return;
    }
  }

  async GetPaperUploadedProfessorListBy_PKID(ViewID: number) {
    try {
      this.request.ActionName = 'GetAllPaperSetterAssignList';
      this.request.PKID = ViewID;

      this.loaderService.requestStarted();
      await this.PapperSetterService.AllPaperSeterAssignList(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        if (data.Data.length > 0) {
          this.DIVTradeDtl = true;
          this.AllAssignListDataArray = data.Data
          this.txtyearTrade = this.AllAssignListDataArray[0].yearTrade;
          this.txtTradename = this.AllAssignListDataArray[0].Tradename;
          this.txtSubjectNamee = this.AllAssignListDataArray[0].SubjectName;
          this.txtpapperSubmitionLastDate = this.AllAssignListDataArray[0].papperSubmitionLastDate;
          this.txtPapperCode_Name = this.AllAssignListDataArray[0].PapperCode_Name;
          if (this.AllAssignListDataArray[0].IsAutoSelectComplete == 1) {
            this.DIVAutoselect = false;
            //this.AllAssignListDataArray[0].AssignprofessorListModel.forEach((prof: any) => {
            // // prof.ishighlight = false;
            //});


            this.AllAssignListDataArray[0].AssignprofessorListModel.forEach((prof: any) => {
              if (prof.IsAutoSelect === 1) {
                prof.ishighlight = true;
              }
            });

          }
          console.log("AssigListData", this.AllAssignListDataArray);
        }
        else
        {
          this.DIVAutoselect = false;
          this.DIVTradeDtl = false;
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

  AutoSelect()
  {
    //this.AllAssignListDataArray[0].AssignprofessorListModel.forEach((prof: any) => {
    //  prof.ishighlight = false;
    //});
    
    this.AllAssignListDataArray[0].AssignprofessorListModel.forEach((X: any) => {
      if (X.UploadedPaperDocument == '')
      {
        this.IsAllPaperUpload = false;
      }
    })

    this.AllAssignListDataArray[0].AssignprofessorListModel.forEach((X: any) => {
      if (X.Status == 'Revert Paper') {
        this.IsAnyPaperRevert = true;
      }
    })

    if (!this.IsAllPaperUpload)
    {
      this.toastr.error('Kindly upload all papers first before using the Auto-select option.');
      return;
    }

    if (this.IsAnyPaperRevert) {
      this.toastr.error('Reverted paper has not been uploaded by the professor. Please upload the reverted paper before using the auto-select option. ');
      return;
    }
    

    // Pick random index
    const randomIndex = Math.floor(Math.random() * this.AllAssignListDataArray[0].AssignprofessorListModel.length);
    this.AllAssignListDataArray[0].AssignprofessorListModel[randomIndex].ishighlight = true;
    const SelectedProfessorid = this.AllAssignListDataArray[0].AssignprofessorListModel[randomIndex].ProfessorId 
    const PKID = this.AllAssignListDataArray[0].id
 
    this.UpdateAutoSelectDetail(SelectedProfessorid, PKID)

  }

  async UpdateAutoSelectDetail(SelectedProfessorID: number, PKID : number )
  {
    try {
 
      this.loaderService.requestStarted();
      await this.PapperSetterService.UpdateSelectedProfessorPaperDetail(SelectedProfessorID, PKID, this.request.Createdby, this.request.Roleid, this.SSOLoginDataModel.SSOID ).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0 && data.Data[0].msg == "Success") {
          this.toastr.success('Auto Select Successfully');
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.GetPaperUploadedProfessorListBy_PKID(PKID);
            this.DIVAutoselect = false; 
          }, 200);
        }
       // this.AllAssignListDataArray = data.Data
        console.log("AssigListData", this.AllAssignListDataArray);

      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async OpenRevertModalPopUp(content: any, PKID: number, ProfessorId: number, professorName: string, DistrictName : string) {
    this.request.PKID = PKID;
    this.request.ProfessorId = ProfessorId;
    this.txtProfessorName = professorName
    this.txtDistrictName = DistrictName

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


  async RevertProfessorPaper()
  {
    

    const Reason = document.getElementById('txtReason') as HTMLTextAreaElement;
    if (this.txtReason == "")
    {
      this.toastr.error('Please Enter Reason of Revert');
      return;
    }

    try {

      this.loaderService.requestStarted();
      await this.PapperSetterService.RevertPaperByExaminer(this.request.ProfessorId, this.request.PKID, this.request.Createdby, this.request.Roleid, this.SSOLoginDataModel.SSOID, this.txtReason).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0 && data.Data[0].msg == "Success") {
          this.toastr.success('Paper Reverted Successfully to Selected Professor');
          setTimeout(() => {
            this.loaderService.requestEnded();
            this.GetPaperUploadedProfessorListBy_PKID(this.request.PKID);
            this.CloseModal();
            //this.DIVAutoselect = false;
          }, 200);
        }
        // this.AllAssignListDataArray = data.Data
        //console.log("AssigListData", this.AllAssignListDataArray);

      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


   
  }
 
  CloseModal() {
    this.request.PKID = 0
    this.request.Remark = '';
    //this.request.GuideLinesDocumentFile = ''
    this.txtProfessorName = '';
    this.txtReason = '';
    this.modalService.dismissAll();
  }

  GoToPaperSetAssignListPage() {
    this.routers.navigate(['/PaperSetAssignList']);
    sessionStorage.setItem('PaperSetterAssignListViewId', '0');
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
