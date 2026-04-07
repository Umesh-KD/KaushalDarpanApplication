import { Component } from '@angular/core';
import { OfficeVacancyModel, OfficeVacancySearchModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
  selector: 'app-dte-office-vacancy-list',
  standalone: false,
  templateUrl: './dte-office-vacancy-list.component.html',
  styleUrl: './dte-office-vacancy-list.component.css'
})
export class DTEOfficeVacancyListComponent {
  public SearchData = new OfficeVacancySearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public formData = new OfficeVacancyModel();
  public deleteRequest = new OfficeVacancyModel();

  public OfficeList: any[] = [];
  public OfficeVacancyList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public StaffTypeList: any[] = [];
  public PostList: any[] = [];
  OfficeVacancy: OfficeVacancyModel[] = [];
  public StreamMasterDDLList: any[] = [];

  constructor(
    private commonMasterService: CommonFunctionService, 
    private BTER_EstablishManagementService: BTEREstablishManagementService, 
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder, 
    private activatedRoute: ActivatedRoute, 
    private routers: Router, 
    private modalService: NgbModal, 
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.LoadBasicData();
    await this.OfficeVacancyDataList();
  }

  async LoadBasicData(){

    await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
    .then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.OfficeList = data['Data'];
    }, error => console.error(error));

    await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDLList = data.Data;
    })


    await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
      debugger;
      data = JSON.parse(JSON.stringify(data));
      this.StaffTypeList = data.Data;
    });


    await this.commonMasterService.GetDesignationAndPostMaster().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.PostList = data['Data'];
    });

    await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.StreamMasterDDLList = data.Data;
    })
  }

  async OfficeVacancyDataList() {
    try {
      this.loaderService.requestStarted();
      this.SearchData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.SearchData.EndTermID = this.sSOLoginDataModel.EndTermID;
      console.log(this.SearchData.StaffTypeID);
      console.log(this.SearchData.OfficeID);
      await this.BTER_EstablishManagementService.OfficeVacancyList(this.SearchData)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeVacancyList = data['Data'];
          
         
        }, error => console.error(error));

      console.log(this.OfficeVacancyList, "leaves data")
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

  async ClearSearchData(){
    this.SearchData = new OfficeVacancySearchModel();
    await this.OfficeVacancyDataList();
  }

  async OfficeVacancyActiveDeActive(ID: number, IsActive: boolean) {
    if (ID != 0) {
      this.formData.ID = ID;
      this.formData.ActiveStatus = IsActive;
      this.formData.ModifyBy = this.sSOLoginDataModel.UserID;
      await this.BTER_EstablishManagementService.OfficeVacancyActiveDeActive(this.formData).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.OfficeVacancyDataList();
          this.formData = new OfficeVacancyModel();
          // Clear array after successful save
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      });
    }
  }

  async removeVacancy(ID: number) {
    try {
      this.deleteRequest.ID = ID;
      this.deleteRequest.ModifyBy = this.sSOLoginDataModel.UserID;
      await this.BTER_EstablishManagementService.DeleteOfficeVacancy(this.deleteRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          await this.OfficeVacancyDataList();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    }    
  }
}
