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
  selector: 'app-single-iip-details',
    templateUrl: './single-iip-details.component.html',
    styleUrls: ['./single-iip-details.component.css'],
    standalone: false
})
export class SingleIIPDetailsComponent implements OnInit {
  public _GlobalConstants: any = GlobalConstants;
  public requestSearch = new SignedCopyOfResultSearchModel()

  dataSource1!:MatTableDataSource<any>;
   @ViewChild('paginator1') paginator1!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
  public CompanyID: number = 0;
  public routeId: number = 0;
  public EventDetail: any = null;
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
    let id = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.CompanyID = id;
  //  this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));.
    this.sSOLoginDataModel.DepartmentID = 1;
    //edit
    debugger
    if (this.CompanyID > 0) {
      await this.GetAllPost();
      //await this.GetUnsignedDocList();
    }
    // this.routeId=Number(this.activatedRoute.snapshot.paramMap.get('post'));
   // this.requestSearch.CampusPostID = this.CompanyID;
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
      debugger
      this.loaderService.requestStarted();
      await this.homeService.GetAllIIPEventDetailsForWeb(this.CompanyID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data['Data'].length > 0) {
            this.EventDetail = data['Data'];
          }
          console.log(this.EventDetail,"EventDetail");
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

}
