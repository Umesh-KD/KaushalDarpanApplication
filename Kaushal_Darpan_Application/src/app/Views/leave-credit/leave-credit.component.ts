import { Component } from '@angular/core';
import { LeaveMasterSearchModel } from '../../Models/LeaveMasterDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LeaveMasterService } from '../../Services/LeaveMaster/leave-master.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { EnumStatus } from '../../Common/GlobalConstants';
@Component({
  selector: 'app-leave-credit',
  standalone: false,
  templateUrl: './leave-credit.component.html',
  styleUrl: './leave-credit.component.css'
})
export class LeaveCreditComponent {
  public StaffLeaveTrnList: any = [];
  public CalenderYearList:any=[];

  public Table_SearchText: string = "";
  public searchRequest = new LeaveMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ApprovedStatus: string = "0";

  constructor(
    private commonMasterService: CommonFunctionService,
    private LeaveMasterService: LeaveMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2
  ) { }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // this.searchRequest.CalenderYearID=this.sSOLoginDataModel.CalenderYearID;

    // await this.GetCalenderYearList();

    await this.GetAllData();

   this.CalenderYearList = [
      { ID: 1, Name: '2022' },
      { ID: 2, Name: '2023' },
      { ID: 3, Name: '2024' },
      { ID: 4, Name: '2025' },
      { ID: 5, Name: '2026' }
    ];

    this.searchRequest.CalenderYearID=5;
  }

  async GetCalenderYearList() {
    try {
      this.loaderService.requestStarted();
      // await this.commonMasterService.PlacementCompanyMaster(this.sSOLoginDataModel.DepartmentID)
      //   .then((data: any) => {
      //     data = JSON.parse(JSON.stringify(data));
      //     console.log(data);
      //     this.StaffLeaveTrnList = data['Data'];

      //   }, (error: any) => console.error(error)
      //   );
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


  async onCalenderYearChange(){

  }

  maskMobileNumber(mobile: string): string {
    if (mobile && mobile.length > 4) {
      // Mask all but the last 4 digits
      const masked = mobile.slice(0, -4).replace(/\d/g, '*');
      return `${masked}${mobile.slice(-4)}`;
    }
    return mobile; // Return original if length is less than or equal to 4
  }


  async GetAllData() {
    debugger
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
      this.searchRequest.Action='GetLeaveCreditStaffData';
      this.loaderService.requestStarted();
      await this.LeaveMasterService.GetLeaveCreditStaffData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffLeaveTrnList = data['Data'];
          console.log(this.StaffLeaveTrnList, "lisssssttt")
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
  async ClearSearchData() {
    this.searchRequest.Name = '';
    this.searchRequest.Status = '';

    // await this.GetAllData();
  }

  // delete by id
  async DeleteById(PlacementCompanyID: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.LeaveMasterService.DeleteById(PlacementCompanyID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  await this.GetAllData();
                }
                else {
                  this.toastr.error(this.ErrorMessage)
                }

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
      });
  }
}
