import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../../../Services/Home/home.service';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CampusDetailsWebSearchModel } from '../../../Models/CampusDetailsWebDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';


@Component({
    selector: 'app-single-post',
    templateUrl: './single-post.component.html',
    styleUrls: ['./single-post.component.css'],
    standalone: false
})
export class SinglePostComponent implements OnInit {
  public _GlobalConstants: any = GlobalConstants;
  public PostId: number = 0;
  public CampusPostDetail: any = null;
  public PlacementCompanyList: any[] = [];
  public searchRequest = new CampusDetailsWebSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private commonMasterService: CommonFunctionService,
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
    }
    //await this.GetAllPlacementCompany();
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
}
