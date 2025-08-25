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
  selector: 'app-all-postlist',
  templateUrl: './all-postlist.component.html',
  styleUrls: ['./all-postlist.component.css'],
    standalone: false
})
export class AllPostlistComponent implements OnInit {
  public _GlobalConstants: any = GlobalConstants;
  public PostId: number = 0;
  public CampusPostList: any[] = [];
  public PlacementCompanyList: any[] = [];
  public FinancialYear: any = [];
  public CollegeList: any = [];
  public searchRequest = new CampusDetailsWebSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  minEndDate: string = '';

  searchModel = {
    startDate: '',
    endDate: ''
  };
  FilteredCampusPostList: any[] = [];
  CampusFromDate: string = '';
  CampusToDate: string = '';
  FinancialYearID: number = 0;
  InstituteID: number = 0;
  OriginalCampusPostList: any[] = []; // Store unfiltered data
  public BranchMasterList: any[] = [];
  StreamID: number = 0;

  constructor(
    private streamService: StreamMasterService,
    private commonMasterService: CommonFunctionService, private homeService: HomeService, private toastr: ToastrService, private loaderService: LoaderService, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private appsettingConfig: AppsettingService, private http: HttpClient,) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //await this.GetStreamMasterList();
    await this.GetAllData();
    //await this.GetAllPlacementCompany();
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


  // get all data
  async GetAllData() {
    try {
      
      this.loaderService.requestStarted();
      await this.homeService.GetAllPostExNonList(this.PostId, EnumDepartment.BTER, this.StreamID, this.CampusFromDate, this.CampusToDate, this.FinancialYearID, this.InstituteID)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CampusPostList = data['Data'];
          console.log(this.CampusPostList,"CampusPostList")
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


  updateEndDateMin() {
    this.minEndDate = this.searchModel.startDate;
    if (this.searchModel.endDate && this.searchModel.endDate < this.searchModel.startDate) {
      this.searchModel.endDate = '';
    }
  }

  async GetStreamMasterList() {
    debugger
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

  async DownloadFile(FileName: string){
    this.download(FileName); // Download using actual file path

    this.toastr.success("PDF Genetrated Successfully");

  }

  async download(fileName: string) {
    debugger;
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${fileName}`;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName; // Keep original name & extension
      link.click();

      // Clean up after download
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('File download failed:', error);
      this.toastr.error('Failed to download file.', 'Error');
    });
  }




  onSearch() {
    const fromDate = this.CampusFromDate ? this.stripTime(new Date(this.CampusFromDate)) : null;
    const toDate = this.CampusToDate ? this.stripTime(new Date(this.CampusToDate)) : null;

    this.CampusPostList = this.OriginalCampusPostList.filter(item => {
      const itemDate = this.stripTime(new Date(item.PostDate));

      // Date filter
      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;

      // Branch filter
      if (this.StreamID && this.StreamID !== 0 && item.StreamID !== this.StreamID) {
        return false;
      }

      return true;
    });
  }


  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }



}
