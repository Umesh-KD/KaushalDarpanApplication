import { Component } from '@angular/core';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import { CampusDetailsWebSearchModel } from '../../../Models/CampusDetailsWebDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { HomeService } from '../../../Services/Home/home.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
    selector: 'app-upcoming-campus',
    templateUrl: './upcoming-campus.component.html',
    styleUrls: ['./upcoming-campus.component.css'],
    standalone: false
})
export class UpcomingCampusComponent {
  public _GlobalConstants: any = GlobalConstants;
  public PostId: number = 0;
  public CampusPostList: any[] = [];
  public PlacementCompanyList: any[] = [];
  public searchRequest = new CampusDetailsWebSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText:string=''
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public CampusPostDetail: any = [];
  constructor(private commonMasterService: CommonFunctionService, private homeService: HomeService, private toastr: ToastrService, private loaderService: LoaderService, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal
    ,private appsettingConfig: AppsettingService
  ) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel.DepartmentID = 1;
    await this.GetAllPost();

  }

  // get all data
  async GetAllPost() {
    try {
       
      // this.sSOLoginDataModel.DepartmentID = 1;
      this.loaderService.requestStarted();
      await this.homeService.GetAllPost(this.PostId, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          
          this.CampusPostList = data['Data'];

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
  //async GetAllPlacementCompany() {
  //  // this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //  this.searchRequest.DepartmentID = 1;
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.homeService.GetAllPlacementCompany(this.searchRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        console.log(data);
  //        this.PlacementCompanyList = data['Data'];
  //      }, (error: any) => console.error(error)
  //      );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  CloseModalPopup() {
    this.PostId = 0
    this.CampusPostList=[]
    this.GetAllPost()
    this.modalService.dismissAll();
   
    
  }

  async openModal(content: any, PostID: number) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.GetAllPostByid(PostID)
/*    this.GetAllPlacementCompany()*/
  }
  async GetAllPostByid(PostID: number) {
    try {


      this.loaderService.requestStarted();
      this.CampusPostList = this.CampusPostList.filter((e: any) => e.PostID == PostID)
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
