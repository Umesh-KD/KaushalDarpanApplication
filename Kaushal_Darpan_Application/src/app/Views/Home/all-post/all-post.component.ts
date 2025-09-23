import { Component, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../../../Services/Home/home.service';
import { EnumDepartment, GlobalConstants } from '../../../Common/GlobalConstants';
import { CampusDetailsWebSearchModel } from '../../../Models/CampusDetailsWebDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-all-post',
    templateUrl: './all-post.component.html',
    styleUrls: ['./all-post.component.css'],
    standalone: false
})
export class AllPostComponent implements OnInit {
  public _GlobalConstants: any = GlobalConstants;
  public PostId: number = 0;
  public CampusPostList: any[] = [];
  public PlacementCompanyList: any[] = [];
  public searchRequest = new CampusDetailsWebSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public FinancialYear: any = [];
  public CollegeList: any = [];
   public settingsMultiselect: object = {};
   public settingsMultiselect2: object = {};

  minEndDate: string = '';

  searchModel = {
    startDate: '',
    endDate: ''
  };
  FilteredCampusPostList: any[] = [];
  CampusFromDate: string = '';
  CampusToDate: string = '';
  FinancialYearID: number = 9;
  InstituteID: string = '0';
  
  OriginalCampusPostList: any[] = []; // Store unfiltered data
  public BranchMasterList: any[] = [];
  StreamID: string = '0';
  public SelectedInstituteId : any = [];
  public SelectedStreamID : any = [];

 

  constructor(
    private streamService: StreamMasterService,
    private commonMasterService: CommonFunctionService,
    private homeService: HomeService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private http: HttpClient
  ) {}

  

  async ngOnInit() {
    console.log("In OnInit Method");
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.settingsMultiselect = {
        singleSelection: false,
        idField: 'StreamID',
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

      this.settingsMultiselect2 = {
        singleSelection: false,
        idField: 'InstituteID',
        textField: 'InstituteName',
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
    
    await this.GetAllData();
    await this.GetStreamMasterList();
    this.loadDropdownData('FinancialYears');
    this.loadDropdownData('PlacementInstitute');
   
  }


  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'FinancialYears':
          this.FinancialYear = data['Data'];
          break;
        case 'PlacementInstitute':
          this.CollegeList = data['Data'];
          break;
        default:
          break;
      }
    });
  }

  async GetAllData() {
    debugger
    console.log('Selected Stream ID ==>',this.SelectedStreamID);  
    console.log('Selected Institute ID ==>',this.SelectedInstituteId);  
    this.StreamID = this.SelectedStreamID.length > 0 ? this.SelectedStreamID.map((item: any) => item.StreamID).join(',') : 0;
    this.InstituteID = this.SelectedInstituteId.length > 0 ? this.SelectedInstituteId.map((item: any) => item.InstituteID).join(',') : 0;
    console.log('Stream ID ==>',this.StreamID);  
    console.log('Institute ID ==>',this.InstituteID);
    try {
      this.loaderService.requestStarted();
      await this.homeService.GetAllPostFilter(this.PostId, EnumDepartment.BTER, this.StreamID, this.CampusFromDate, this.CampusToDate, this.FinancialYearID, this.InstituteID)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.CampusPostList = data['Data'];
          console.log('Campus Post List ==>',this.CampusPostList)
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

  async GetAllPlacementCompany() {
    this.searchRequest.DepartmentID = EnumDepartment.BTER
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

  async GetStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.streamService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("data of BranchMasterList", data)
          this.BranchMasterList = data['Data'];

          console.log("Branch Master List ===>", this.BranchMasterList)
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


  updateEndDateMin() {
    this.minEndDate = this.searchModel.startDate;
    if (this.searchModel.endDate && this.searchModel.endDate < this.searchModel.startDate) {
      this.searchModel.endDate = '';
    }
  }
  
  

  onSearch() {
    const fromDate = this.CampusFromDate ? this.stripTime(new Date(this.CampusFromDate)) : null;
    const toDate = this.CampusToDate ? this.stripTime(new Date(this.CampusToDate)) : null;
    debugger;
    this.CampusPostList = this.OriginalCampusPostList.filter(item => {
      const itemDate = this.stripTime(new Date(item.PostDate));

      // Date filter
      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;

      // Branch filter
      if (this.StreamID && this.StreamID !== '0' && item.StreamID !== this.StreamID) {
        return false;
      }

      return true;
    });
  }


  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  async DownloadPdf(FileName: string) {
    debugger;
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    try {
      this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = "" + FileName + ".pdf"; // Set the desired file name
        downloadLink.click();
        // Clean up the object URL
        window.URL.revokeObjectURL(url);
      });
    }
    catch (error) {
      console.error('Error downloading file:', error);
      this.toastr.error('Failed to download file.', 'Error');
    }

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
