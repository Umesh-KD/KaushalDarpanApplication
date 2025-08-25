import { Component, OnInit } from '@angular/core';
import { IItiCompanyMasterDataModel, ItiCompanyMasterSearchModel } from '../../../../Models/ITI/ItiCompanyMasterDataModels';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiCompanyMasterService } from '../../../../Services/ITI/ItiCompanyMaster/iticompany-master.service.ts';

@Component({
    selector: 'app-iticompany-master',
    templateUrl: './iticompany-master.component.html',
    styleUrls: ['./iticompany-master.component.css'],
    standalone: false
})
export class ItiCompanyMasterComponent implements OnInit {
  public CompanyMasterList: IItiCompanyMasterDataModel[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new ItiCompanyMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";

  constructor(private commonMasterService: CommonFunctionService, private companyMasterService: ItiCompanyMasterService,
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
      await this.companyMasterService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CompanyMasterList = data.Data;
        console.log(this.CompanyMasterList)
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
    this.searchRequest.Status = '';
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

            await this.companyMasterService.DeleteById(ID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (!data.State) {
                  this.toastr.success(data.Message)
                  await this.GetAllData();
                }
                else {
                  this.toastr.error(data.ErrorMessage)
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
        await this.GetAllData();
      }
    );
      
      
  }
}
