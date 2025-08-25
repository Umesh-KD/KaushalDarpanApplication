import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { IndustryInstitutePartnershipMasterService } from '../../../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { IndustryInstitutePartnershipMasterSearchModel, IIndustryInstitutePartnershipMasterDataModel } from '../../../../Models/IndustryInstitutePartnershipMasterDataModel';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
  selector: 'app-iti-industry-institute-partnership-master',
  standalone: false,
  templateUrl: './iti-industry-institute-partnership-master.component.html',
  styleUrl: './iti-industry-institute-partnership-master.component.css'
})
export class ITIIndustryInstitutePartnershipMasterComponent {

  public IndustryInstitutePartnershipMasterList: IIndustryInstitutePartnershipMasterDataModel[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new IndustryInstitutePartnershipMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  constructor(private commonMasterService: CommonFunctionService, private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2) {

  }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();
  }

  async GetAllData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();
      await this.industryInstitutePartnershipMasterService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.IndustryInstitutePartnershipMasterList = data.Data;
        console.log(this.IndustryInstitutePartnershipMasterList)
      }, (error: any) => console.error(error))
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

    await this.GetAllData();
  }

  async DeleteById(ID: number) {
    
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.industryInstitutePartnershipMasterService.DeleteById(ID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                console.log(data);

                if (this.State == EnumStatus.Success) 
                  {
                    this.toastr.warning(this.Message)
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
