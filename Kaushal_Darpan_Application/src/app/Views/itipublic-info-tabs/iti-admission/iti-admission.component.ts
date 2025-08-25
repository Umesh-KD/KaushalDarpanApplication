import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import ApexCharts from 'apexcharts';
import * as Highcharts from 'highcharts';
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
  selector: 'app-iti-admission',
  standalone: false,
  templateUrl: './iti-admission.component.html',
  styleUrl: './iti-admission.component.css'
})
export class ItiAdmissionComponent {

  @Input() ApplicationID: number = 0;
  @Input() CourseTypeId: number = 0;
  @Input() DepartmentId: number = 1;
  @Input() CourseTypeName: string = '';
  @Input() CourseTypeNameHi: string = '';
  @Input() FinancialYearName: number = 0;
  @Input() TypeId: number = 0;


  public GlobalConstants = GlobalConstants;
  public ImportantLinksITI: any[] = [];
  public searchRequest = new DynamicUploadContentListsModal();
  public sSOLoginDataModel = new SSOLoginDataModel();



  constructor(private commonMasterService: CommonFunctionService,
    private home2Service: Home2Service, private toastr: ToastrService,
    private loaderService: LoaderService, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private appsettingConfig: AppsettingService,) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel.DepartmentID = 2;

    //await this.GetDynamicUploadContentNotificationBTER();
  }


  async GetDynamicUploadContentNotificationBTER() {
    try {
      this.searchRequest.DynamicUploadTypeID = 5; // Only Notifications List For Home Page (DTE,BTER, ITI)
      this.searchRequest.DepartmentSubID = 243;
      this.searchRequest.Key = 'DynamicUploadShortList';
      this.loaderService.requestStarted();
      await this.home2Service.GetDynamicUploadContent(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ImportantLinksITI = data.Data;
          console.log("BTERList", this.ImportantLinksITI);
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

