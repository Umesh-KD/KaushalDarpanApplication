import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CollegeHostelDetailsDataModel, CollegeHostelDetailsSearchModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
import { window } from 'rxjs';
import { routes } from '../../../routes';
import * as CryptoJS from 'crypto-js';




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
  request = new CollegeHostelDetailsDataModel()
  public searchRequest = new CollegeHostelDetailsSearchModel();
  public CollegeHostelList: any = [];
  public CollegeHostelFacilityList: any = [];
  public CollegeHostelFeeList: any = [];

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

    // console.log(this.CollegeHostelList, 'CollegeHostelList')
  }

  async CollegeHostelDetailsList() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.UserID = this.sSOLoginDataModel.StudentID;
      await this._HostelManagmentService.CollegeHostelDetailsList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data)); // Make sure the data is parsed correctly

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          // Log entire data object to understand its structure
          console.log(data, 'Data Response');

          // Assign values to specific lists
          if (data && data['Data']) {
            this.CollegeHostelList = data['Data'].Table || []; // Ensure Table exists
            this.CollegeHostelFacilityList = data['Data'].Table1 || []; // Ensure Table1 exists
            this.CollegeHostelFeeList = data['Data'].Table2 || []; // Ensure Table2 exists
          }

          // Log after assignment
          console.log(this.CollegeHostelList, 'CollegeHostelList');
          console.log(this.CollegeHostelFacilityList, 'CollegeHostelFacilityList');
          console.log(this.CollegeHostelFeeList, 'CollegeHostelFeeList');
        }, error => {
          console.error(error);
        });
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

  encrypt(value: string): string {
    const secretKey = 'appl47hno6gyhostel';
    return CryptoJS.AES.encrypt(value, secretKey).toString();
  }

  goToEncryptedHostel(hostelId: number): void {
    const encryptedId = this.encrypt(hostelId.toString());
    this.router.navigate(['/ApplyForHostel'], { queryParams: { id: encryptedId } });
  }
 
}
