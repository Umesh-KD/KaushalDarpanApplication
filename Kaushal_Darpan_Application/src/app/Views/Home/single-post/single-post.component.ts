import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../../../Services/Home/home.service';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CampusDetailsWebSearchModel } from '../../../Models/CampusDetailsWebDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CampusPostService } from '../../../Services/CampusPost/campus-post.service';
import { SignedCopyOfResultSearchModel } from '../../../Models/CompanyMasterDataModel';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
    selector: 'app-single-post',
    templateUrl: './single-post.component.html',
    styleUrls: ['./single-post.component.css'],
    standalone: false
})
export class SinglePostComponent implements OnInit {
  public _GlobalConstants: any = GlobalConstants;
  public requestSearch = new SignedCopyOfResultSearchModel()

  dataSource1!:MatTableDataSource<any>;
   @ViewChild('paginator1') paginator1!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
  public PostId: number = 0;
  public routeId: number = 0;
  public CampusPostDetail: any = null;
  public PlacementCompanyList: any[] = [];
  public GetAllSignedCopyList: any = [];
  public searchRequest = new CampusDetailsWebSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();

  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  modalRef1: NgbModalRef | null = null;
    displayedColumns1: string[] = [
    'SNo',
    'FileType',
    'CampusVenueName',
    'CompanyName',
    'actions'
  ];
  totalRecord1:number=0;

  constructor(private commonMasterService: CommonFunctionService,private CampusPostService:CampusPostService,
    private homeService: HomeService, private toastr: ToastrService,
    private loaderService: LoaderService, private activatedRoute: ActivatedRoute,
    private routers: Router, private modalService: NgbModal,
    public appsettingConfig: AppsettingService) {

  }

  async ngOnInit() {
    this.PostId = Number(this.activatedRoute.snapshot.queryParamMap.get('post')?.toString());
  //  this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));.
    this.sSOLoginDataModel.DepartmentID = 1;
    //edit
    if (this.PostId > 0) {
      await this.GetAllPost();
      //await this.GetUnsignedDocList();
    }
    // this.routeId=Number(this.activatedRoute.snapshot.paramMap.get('post'));
    this.requestSearch.CampusPostID=this.PostId;
    //await this.GetAllPlacementCompany();
  }

   initTable1(data: any) {
    this.dataSource1 = new MatTableDataSource(data);
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort;
  }


  ngAfterViewInit() {
    // if (this.dataSource) this.dataSource.paginator = this.paginator;
    if (this.dataSource1) this.dataSource1.paginator = this.paginator1;
    // if (this.dataSource2) this.dataSource2.paginator = this.paginator2;
  }


  // get detail by id
  async GetAllPost() {
    
    try {
      this.loaderService.requestStarted();
      await this.homeService.GetAllPost(this.PostId,1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data['Data'].length > 0) {
            this.CampusPostDetail = data['Data'][0];
          }
          console.log(this.CampusPostDetail,"CampusPostDetail");
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

  // get detail by id
  async GetUnsignedDocList() {
    
    debugger
    try {
      this.loaderService.requestStarted();
      this.requestSearch.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestSearch.RoleID = 6;
      // this.requestSearch.CreatedBy = this.sSOLoginDataModel.UserID;
      this.requestSearch.CampusPostID = this.PostId;

      await this.CampusPostService.GetAllSignedCopyData(this.requestSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.GetAllSignedCopyList = data['Data'];
          this.totalRecord1=data['Data'].length;
          this.initTable1(this.GetAllSignedCopyList);
          console.log('data check',this.GetAllSignedCopyList);
        }, error => console.error(error));
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

  getSanitizedUrl(url: string): string {
    if (!url) return '#';

    // Agar already http ya https laga ho to use waisa ka waisa return karo
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Nahi to https laga ke return karo
    return 'https://' + url;
  }

  


  // get all data
  async GetAllPlacementCompany() {
    this.searchRequest.DepartmentID = 1
    try {
      this.loaderService.requestStarted();
      await this.homeService.GetAllPlacementCompany(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.PlacementCompanyList = data['Data'];
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


  // async openModalUnsignedDocList(content: any, PostID: number) {
  //   debugger
  //   this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  //   // this.GetAllstudent(PostID)
  // }


  //private getDismissReason(reason: any): string {
  //    if (reason === ModalDismissReasons.ESC) {
  //      return 'by pressing ESC';
  //    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //      return 'by clicking on a backdrop';
  //    } else {
  //      return `with: ${reason}`;
  //    }
  //  }

  //  CloseModalPopup() {
  //  this.modalService.dismissAll();
  //}


    //async openModalUnsignedDocList(content: any, rowData?: any) {
   
    //debugger
    // Open only once, store reference
    //this.modalRef1 = this.modalService.open(content, {
    //  size: 'xl',
    //  ariaLabelledBy: 'modal-basic-title',
    //  backdrop: 'static'
    //});

    // Handle result or dismissal
    //this.modalRef1.result.then(
    //  (result) => {
    //    this.closeResult = `Closed with: ${result}`;
    //  },
    //  (reason: any) => {
    //    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //  }
    //);
    
  //}

  //CloseModal1() {
  //  debugger
  //  if (this.modalRef1) {
  //    this.modalRef1.dismiss();
  //    this.modalRef1 = null;
  //    // this.isSubmitted = false;
  //  }
  //}
}
