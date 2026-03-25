import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../../../Services/Home/home.service';
import { EnumDepartment, GlobalConstants } from '../../../Common/GlobalConstants';

import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ITIAllPostSearchModel, ITICampusDetailsWebSearchModel } from '../../../Models/ITI/ITICampusDetailsWebDataModel';
import { ITIHomeService } from '../../../Services/ITI/ITIHome/itihome.service';
import { ValueFromArray } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


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
  public postSearch = new ITIAllPostSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public TradeList: any[] = [];
  searchForm: FormGroup | any;
  public settingsMultiselect: object = {};
  public SelectedTradeID : any = [];
  public DistrictMasterList:any=[];

  constructor(
    private commonMasterService: CommonFunctionService,
    private itihomeService: ITIHomeService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {

  }

  async ngOnInit() {
    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    // this.searchForm = new FormGroup({
    //   BranchId: new FormControl('0'),
    //   StartDate: new FormControl(''),
    //   EndDate: new FormControl(''),
    //   AppointmentLocation: new FormControl('')
    // });

    this.searchForm=this.formBuilder.group(
      {
        BranchId: ['0'],
        StartDate: [''],
        EndDate: [''],
        AppointmentLocation:['']
      })
  
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetOnLoadData();
    await this.GetITIAllData();
    //await this.GetAllPlacementCompany();
    this.itihomeService.GetITITradeList().then((data: any) => {
      debugger
      data = JSON.parse(JSON.stringify(data));
      this.TradeList = data['Data'];
      // console.log(data);

    }, (error: any) => console.error(error));
  }

  async GetOnLoadData() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // get all data
  async GetITIAllData() {
    debugger;
    try {
      console.log("selected trade ===> ",this.SelectedTradeID);
      this.postSearch.BranchId=this.SelectedTradeID.length>0?this.SelectedTradeID.map((item:any)=>item.ID).join(','):'0';
      console.log("selected search ==>",this.postSearch);
      this.loaderService.requestStarted();
      this.postSearch.DepartmentID=this.sSOLoginDataModel.DepartmentID;
      // this.searchForm.value
      await this.itihomeService.GetITIAllPostwithSearch(this.PostId, EnumDepartment.ITI,this.postSearch )
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

  

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }

  onSelectAll(event:any){
    console.log(event);
  }

  onItemSelect(evet:any) {
    console.log("on select", evet);
  }

onDeSelect(event:any) {
}

// onSelectAll(items: any[], centerID: number) {
// }

onDeSelectAll(event:any) {
}


}
