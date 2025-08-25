import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../../../Services/Home/home.service';
import { EnumDepartment, GlobalConstants } from '../../../Common/GlobalConstants';

import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ITICampusDetailsWebSearchModel } from '../../../Models/ITI/ITICampusDetailsWebDataModel';
import { ITIHomeService } from '../../../Services/ITI/ITIHome/itihome.service';
import { ValueFromArray } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-all-post',
  templateUrl: './iti-all-post.component.html',
  styleUrls: ['./iti-all-post.component.css'],
  standalone: false
})
export class ITIAllPostComponent implements OnInit {
  public _GlobalConstants: any = GlobalConstants;
  public PostId: number = 0;
  public CampusPostList: any[] = [];
  public PlacementCompanyList: any[] = [];
  public searchRequest = new ITICampusDetailsWebSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public TradeList: any[] = [];
  searchForm: FormGroup | any;

  constructor(private commonMasterService: CommonFunctionService, private itihomeService: ITIHomeService, private toastr: ToastrService, private loaderService: LoaderService, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {

  }

  async ngOnInit() {
    this.searchForm = new FormGroup({
      BranchId: new FormControl('0'),
      StartDate: new FormControl(''),
      EndDate: new FormControl(''),
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetITIAllData();
    //await this.GetAllPlacementCompany();
    this.itihomeService.GetITITradeList().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.TradeList = data['Data'];
      // console.log(data);

    }, (error: any) => console.error(error));
  }

  // get all data
  async GetITIAllData() {
    try {

      this.loaderService.requestStarted();
      await this.itihomeService.GetITIAllPostwithSearch(this.PostId, EnumDepartment.ITI, this.searchForm.value)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CampusPostList = data['Data'];
          console.log(this.CampusPostList, "CampusPostList")
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
    this.searchRequest.DepartmentID = EnumDepartment.BTER
    try {
      this.loaderService.requestStarted();
      await this.itihomeService.GetAllPlacementCompany(this.searchRequest)
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

  async PerformSearch() {
    console.log(this.searchForm.value);
    await this.GetITIAllData();
  }
}
