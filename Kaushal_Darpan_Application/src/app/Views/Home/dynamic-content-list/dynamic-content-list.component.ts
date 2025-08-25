import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { CampusDetailsWebSearchModel, DynamicUploadContentListsModal } from '../../../Models/CampusDetailsWebDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { Home2Service } from '../../../Services/Home2/home2.service';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-dynamic-content-list',
  standalone: false,
  templateUrl: './dynamic-content-list.component.html',
  styleUrl: './dynamic-content-list.component.css'
})
export class DynamicContentListComponent {
  public GlobalConstants = GlobalConstants;
  public duct_id: string | null = null;
  public ductid: any = 0;
  public dept_sub_id: string | null = null;
  public deptsubid: any;
  public DynamicUploadContentList: any[] = [];
  public searchRequest = new DynamicUploadContentListsModal();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public DUCTName: string = '';
  public DuptName: string = '';
  public Table_SearchText: string = '';

  constructor(
    private commonMasterService: CommonFunctionService,
    private home2Service: Home2Service,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,

  ) { }

  async ngOnInit() {

    this.ductid = this.activatedRoute.snapshot.paramMap.get('duct_id');
    this.deptsubid = this.activatedRoute.snapshot.paramMap.get('dept_sub_id');

    this.activatedRoute.paramMap.subscribe(params => {
      this.ductid = params.get('duct_id')
    });
    this.activatedRoute.paramMap.subscribe(params => {
      this.deptsubid = params.get('dept_sub_id')
    });


    //alert(this.duct_id + "A");
    //alert(this.dept_sub_id + "B");

    this.sSOLoginDataModel.DepartmentID = 1;

    await this.GetDynamicUploadContentList();

    
  }

  async GetDynamicUploadContentList() {
    try {
      this.searchRequest.DynamicUploadTypeID = this.ductid.toString(); // Only News List For Home Page (DTE,BTER, ITI)
      this.searchRequest.DepartmentSubID = this.deptsubid.toString();; // News for All Department
      this.searchRequest.Key = 'DynamicUpload';
      this.loaderService.requestStarted();
      await this.home2Service.GetDynamicUploadContent(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DynamicUploadContentList = data.Data;
          this.DUCTName = this.DynamicUploadContentList[0]["TypeName"];
          this.DuptName = this.DynamicUploadContentList[0]["subcategory"];
          console.log("News", this.DynamicUploadContentList);
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
