import { Component } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { window } from "rxjs";
import { SweetAlert2 } from "../../../Common/SweetAlert2";
import { CollegeHostelDetailsDataModel, CollegeHostelDetailsSearchModel } from "../../../Models/Hostel-Management/HostelManagmentDataModel";
import { SSOLoginDataModel } from "../../../Models/SSOLoginDataModel";
import { CommonFunctionService } from "../../../Services/CommonFunction/common-function.service";
import { HostelManagmentService } from "../../../Services/HostelManagment/HostelManagment.service";
import { LoaderService } from "../../../Services/Loader/loader.service";


@Component({
    selector: 'app-college-hostel-details',
    templateUrl: './college-hostel-details.component.html',
    styleUrls: ['./college-hostel-details.component.css'],
    standalone: false
})
export class CollegeHostelDetailsComponent {
    groupForm!: FormGroup;
    public HFID: number | null = null;
    public isUpdate: boolean = false;
    sSOLoginDataModel = new SSOLoginDataModel();
    public Table_SearchText: string = "";
    public tbl_txtSearch: string = '';
    public State: number = -1;
    public Message: any = [];
    public ErrorMessage: any = [];
    public isLoading: boolean = false;
    public isSubmitted: boolean = false;
    request = new CollegeHostelDetailsDataModel();
    public searchRequest = new CollegeHostelDetailsSearchModel();
  public CollegeHostelList: any = [];
  public CollegeHostelFacilityList: any = [];
  public CollegeHostelFeeList: any = [];
  public HostelTotalDetails: any = [];
  public StudentDetailsList: any = [];

    constructor(
        private fb: FormBuilder,
        private commonMasterService: CommonFunctionService,
        private _HostelManagmentService: HostelManagmentService,
        private route: ActivatedRoute,
        private router: Router,
        private routers: ActivatedRoute,
        private toastr: ToastrService,
        private loaderService: LoaderService,
        private Swal2: SweetAlert2,
        private modalService: NgbModal
    ) { }


    async ngOnInit() {
        this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

        this.groupForm = this.fb.group({
            //ddlWaterCooler: ['',],
            //ddlRoWater: ['',],
            //ddlNearbyMarket: ['',],
            //txtMarketDistance: ['', Validators.required],
            //ddlPlayGround: ['',],
            //txtPlayGroundDistance: ['', Validators.required]
        });
        await this.CollegeHostelDetailsList();
      await this.GetStudentDetailsForApply();

    }
  //async CollegeHostelDetailsList() {
  //  try {
  //    this.loaderService.requestStarted();
  //    this.searchRequest.UserID = this.sSOLoginDataModel.StudentID;
  //    await this._HostelManagmentService.CollegeHostelDetailsList(this.searchRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (data && data['Data']) {
  //          this.CollegeHostelList = data['Data'].Table ; // Hostel Data
  //          this.CollegeHostelFacilityList = data['Data'].Table1 ; // Facility Data
  //          this.CollegeHostelFeeList = data['Data'].Table2; // Fee Data

  //          this.HostelTotalDetails = this.CollegeHostelList.filter((item: any) => {
  //            this.CollegeHostelFacilityList.map((i: any) => {
  //              i.HostelID = item.HostelID
  //            })
  //          })
  //          console.log(" this.HostelTotalDetails", this.HostelTotalDetails)

  //        }

  //        console.log(this.CollegeHostelList, 'CollegeHostelList');
  //        console.log(this.CollegeHostelFacilityList, 'CollegeHostelFacilityList');
  //        console.log(this.CollegeHostelFeeList, 'CollegeHostelFeeList');
  //      }, error => {
  //        console.error(error);
  //      });
  //  } catch (Ex) {
  //    console.log(Ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async GetStudentDetailsForApply() {
    //alert(this.sSOLoginDataModel.StudentID);
    try {
      let obj = {
        StudentID: this.sSOLoginDataModel.StudentID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Action: "_StudentDetails"
      }
      await this._HostelManagmentService.GetStudentDetailsForApply(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentDetailsList = data['Data'];
          if (this.StudentDetailsList[0].AllotmentStatus > 0) {
            this.router.navigateByUrl('/ApplyForHostel?id=' + this.StudentDetailsList[0].HostelID)
          }

          console.log(this.StudentDetailsList, "lo")
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async CollegeHostelDetailsList() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.UserID = this.sSOLoginDataModel.StudentID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;

      // Call the service to fetch the data
      await this._HostelManagmentService.CollegeHostelDetailsList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data)); // Ensure proper parsing

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data && data['Data']) {
            this.CollegeHostelList = data['Data'].Table;
            this.CollegeHostelFacilityList = data['Data'].Table1;
            this.CollegeHostelFeeList = data['Data'].Table2;
            this.HostelTotalDetails = this.CollegeHostelList.map((hostel: any) => {
              const facilities = this.CollegeHostelFacilityList.filter((facility: any) => facility.HostelID === hostel.HostelID);
              const fees = this.CollegeHostelFeeList.filter((fee: any) => fee.HostelID === hostel.HostelID);
              return {
                ...hostel,
                Facilities: facilities,
                Fees: fees
              };
            });
            console.log("Hostel Total Details", this.HostelTotalDetails); 
          }
          //console.log(this.CollegeHostelList, 'CollegeHostelList');
          //console.log(this.CollegeHostelFacilityList, 'CollegeHostelFacilityList');
          //console.log(this.CollegeHostelFeeList, 'CollegeHostelFeeList');
        }, error => {
          console.error(error);
        });
    } catch (Ex) {
      console.log(Ex); 
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


}
