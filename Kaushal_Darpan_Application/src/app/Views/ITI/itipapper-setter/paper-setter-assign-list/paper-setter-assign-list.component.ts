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
  selector: 'app-paper-setter-assign-list',
  standalone: false,
  templateUrl: './paper-setter-assign-list.component.html',
  styleUrl: './paper-setter-assign-list.component.css'
})
export class PaperSetterAssignListComponent {
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
  public Table_SearchText: string = '';

  ProfesorList: any = [];
  AllAssignListDataArray: any[] = [];

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
    private Swal2: SweetAlert2,
    private sanitizer: DomSanitizer,
    private http: HttpClient


  ) { }


  async ngOnInit() {


    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.Createdby = this.SSOLoginDataModel.UserID;
    this.request.Roleid = this.SSOLoginDataModel.RoleID;
    this.request.Endtermid = this.SSOLoginDataModel.EndTermID;
    this.request.FYID = this.SSOLoginDataModel.FinancialYearID;

   
    //this.GetTradeAndColleges()
    this.GetAllPaperSeterAssignList();
    //console.log(this.PaperFormGroup.get('TraderSchemeId')?.value, "TraderSchemeId");
  }


  async GetTradeAndColleges() {

    this.tradeSearchRequest.action = '_getAllData'
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiTradeListAll = data.Data
        //this.request.yearTrade = 0;
        //this.request.yearTrade = 6;
        console.log(this.ItiTradeListAll, "ItiTradeListAll")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async ddlTradeChange() {

   
    try {
      this.loaderService.requestStarted();
      await this.PapperSetterService.GetSubjectListByTradeID(this.request.TradeID, this.request.ExamType).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectListAll = data.Data
        console.log(this.SubjectListAll, "SubjectListByTradeID")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetAllPaperSeterAssignList() {

    try {
      this.request.ActionName = 'GetAllPaperSetterAssignList';
     
      this.loaderService.requestStarted();
      await this.PapperSetterService.AllPaperSeterAssignList(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        this.AllAssignListDataArray = data.Data
       
        //this.AllAssignListDataArray[1].AssignprofessorListModel.forEach((prof: any) => {
        //  if (prof.IsAutoSelect === 1) {
        //    prof.ishighlight = true;
        //  }
        //});

        this.AllAssignListDataArray.forEach((prof: any) =>
        {
          prof.AssignprofessorListModel.forEach(((X: any) =>
          {
            if (X.IsAutoSelect === 1) {
              X.ishighlight = true;
            }
          }));


          
        });


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

  async Search()
  {
    
    try {
      this.request.ActionName = 'GetAllPaperSetterAssignList';
     // this.request.yearTrade = this.request.TradeID;
       

      this.loaderService.requestStarted();
      await this.PapperSetterService.AllPaperSeterAssignList(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        this.AllAssignListDataArray = data.Data
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

  async DDLYearTradeChange( )
  {
    this.request.TradeID = 0
    this.request.SubjectId = 0
    this.SubjectListAll = [];
    this.ItiTradeListAll = [];

    //try {
    //  this.loaderService.requestStarted();
    //  await this.PapperSetterService.GetSubjectListByTradeID(this.request.yearTrade , this.request.ExamType).then((data: any) => {
    //    data = JSON.parse(JSON.stringify(data));
    //    this.SubjectListAll = data.Data
    //    console.log(this.SubjectListAll, "SubjectListByTradeID")
    //  })
    //} catch (error) {
    //  console.error(error)
    //} finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}

    try {
      this.loaderService.requestStarted();
      await this.PapperSetterService.GetTradeListByYearTradeID(this.request.yearTrade, this.SSOLoginDataModel.Eng_NonEng ).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiTradeListAll = data.Data
        console.log(this.ItiTradeListAll, "TradeListALL")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }

  EditData(id: number) {
    //const encodedId = btoa(id.toString());
    //this.routers.navigate(['/papperSetAssign', encodedId]);

    sessionStorage.setItem('PaperSetterAssignEditId', id.toString());
    this.routers.navigate(['/papperSetAssign']);
    console.log(sessionStorage);
  }

  ViewData(id: number) {
    //const encodedId = btoa(id.toString());
    //this.routers.navigate(['/papperSetAssign', encodedId]);

    sessionStorage.setItem('PaperSetterAssignListViewId', id.toString());
    this.routers.navigate(['/PaperAutoSelect']);
    console.log(sessionStorage);
  }

  GoToPaperSetAssign() {
    this.routers.navigate(['/papperSetAssign']);
    sessionStorage.setItem('PaperSetterAssignEditId', '0');
  }

  Clear()
  {
    this.request.ExamType = 0;
    this.request.yearTrade = 0;
    this.request.TradeID = 0;
    this.request.SubjectId = 0
    this.SubjectListAll = [];
    this.ItiTradeListAll = [];
    this.GetAllPaperSeterAssignList();
  }

  //async DeleteByID(id: number) {
  //  try {
      
      
  //    this.loaderService.requestStarted();
  //    await this.PapperSetterService.PaperSetterAssignListRemoveByID(id, this.request.Createdby, this.SSOLoginDataModel.RoleID).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.GetAllPaperSeterAssignList();
         
  //    })
  //  } catch (error) {
  //    console.error(error)
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}



  async DeleteByID(id: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {


            this.loaderService.requestStarted();
            await this.PapperSetterService.PaperSetterAssignListRemoveByID(id, this.request.Createdby, this.SSOLoginDataModel.RoleID).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.GetAllPaperSeterAssignList();

            })
          } catch (error) {
            console.error(error)
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
  }



  DDLExamTypeChange()
  {
    this.request.TradeID = 0;
    this.SubjectListAll = [];
    this.request.SubjectId = 0;

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
