import { Component, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ReturnDteItemDataModel } from '../../../../Models/DTEInventory/DTEIssuedItemDataModel';
import { ApprenticeReportServiceService } from '../../../../Services/ITI/ApprenticeReport/apprentice-report-service.service'
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { CommonFunctionService } from "../../../../Services/CommonFunction/common-function.service";

import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
 

import { ITI_ApprenticeshipDataModel } from '../../../../Models/ITI/ITI_ApprenticeshipDataModel';

@Component({
  selector: 'app-workshop-progress-report',
  standalone: false,
  templateUrl: './workshop-progress-report.component.html',
  styleUrl: './workshop-progress-report.component.css'
})
export class WorkshopProgressReportComponent {
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private routers: Router,
    private ApprenticeShipRPTService: ApprenticeReportServiceService,
    private CommonService: CommonFunctionService,
  ) { }

  WrokshopReportFormGroup!: FormGroup;
  public DistrictMasterList: any = [];
  public ALLDistrictMasterList: any = [];
  public RowAddedList: any = [];
  public UpdateRowRecordList: any = [];
  public IsUpdateCase: boolean = false;
  public UpdateEditID: number = 0;
  public IsDisable:boolean=false
  isAllSelected = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public request = new ITI_ApprenticeshipDataModel()
  public SSOLoginDataModel = new SSOLoginDataModel()

  ngOnInit(): void
  {
    this.WrokshopReportFormGroup = this.formBuilder.group({
      workshopDate: ['', Validators.required],
      OrganisedDistrictName: [0 , DropdownValidators] ,   
      SelectedDistrictList: [[], this.atLeastOneSelectedValidator()]  ,  
      establishmentName: ['', Validators.required]    ,
      establishmentAddress: ['', Validators.required],
      representativeName: ['', Validators.required],
      representativedesignation: ['', Validators.required],
      representativeMobile: ['', Validators.required ],
      Remars: ['', Validators.required],


    });

    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetDistrictMatserDDL();
    this.GetAllDistrictMatserDDL();


    const Editid = sessionStorage.getItem('WorkshopProgressReportPKID');
    if (Editid != undefined && parseInt(Editid) > 0) {
      this.IsDisable = true
      this.GetReportDatabyID(parseInt(Editid));
      this.WrokshopReportFormGroup.disable(); 
      console.log(Editid);
    }

    if (this.SSOLoginDataModel.RoleID != 97)
    {
      this.WrokshopReportFormGroup.disable(); // Disables all form controls
    }
    else
    {
/*      this.WrokshopReportFormGroup.enable(); // Disa*/
    }
  }

  //async onAddmoreSubmit()
  //{
  //  debugger
  //  let ORG_DistrictName = '';
  //  let ParticipatedDistrictListname = '';
  //  let ParticipatedDistrictIDS = '';
  //  const ddlDistrict = document.querySelector(`#ddlDistrict option[value='${this.WrokshopReportFormGroup.value.OrganisedDistrictName}']`);
  //  if (ddlDistrict) {
  //    ORG_DistrictName = ddlDistrict.textContent?.trim() || '';
  //  }

  //  if (this.WrokshopReportFormGroup.value.SelectedDistrictList.length > 0) {

  //    this.WrokshopReportFormGroup.value.SelectedDistrictList.forEach((districtId: string) => {
  //      const ParticipatedDistrictList = document.querySelector(`#ddlDistrict option[value='${districtId}']`);

  //      if (ParticipatedDistrictList) {
  //        const districtName = ParticipatedDistrictList.textContent?.trim() || '';
  //        if (districtName) {
  //          if (ParticipatedDistrictListname) {
  //            ParticipatedDistrictListname += ', ' + districtName;
  //            ParticipatedDistrictIDS += ',' + districtId;
  //          } else {
  //            ParticipatedDistrictListname = districtName;
  //            ParticipatedDistrictIDS = districtId;
  //          }
  //        }
  //      }
  //    });
  //  }
  //  else
  //  {
  //    this.toastr.warning("Please Fill All Required Fields !");
  //    return;
  //  }


  //  if (!this.RowAddedList) {
  //    this.RowAddedList = [];
  //  }


  //  this.RowAddedList.push({
  //    _workshopDate: this.WrokshopReportFormGroup.value.workshopDate,
  //    _OrganisedDistrictID: this.WrokshopReportFormGroup.value.OrganisedDistrictName,
  //    _SelectedDistrictListIDs: ParticipatedDistrictIDS,
  //    _establishmentName: this.WrokshopReportFormGroup.value.establishmentName,
  //    _establishmentNameAddress: this.WrokshopReportFormGroup.value.establishmentName + "/" + this.WrokshopReportFormGroup.value.establishmentAddress,
  //    _establishmentAddress: this.WrokshopReportFormGroup.value.establishmentAddress,
  //    _representativeName: this.WrokshopReportFormGroup.value.representativeName,
  //    _representativedesignation: this.WrokshopReportFormGroup.value.representativedesignation,
  //    _representativeMobile: this.WrokshopReportFormGroup.value.representativeMobile,
  //    _Remars: this.WrokshopReportFormGroup.value.Remars,
  //    _ORG_districtName: ORG_DistrictName ,

  //    _representativeNameAddressMobileno: this.WrokshopReportFormGroup.value.representativeName + "/" + this.WrokshopReportFormGroup.value.representativedesignation + "/" + this.WrokshopReportFormGroup.value.representativeMobile ,
  //    _ParticipatedDistrictListname: ParticipatedDistrictListname ,

  //    _EndTermID: this.SSOLoginDataModel.EndTermID,
  //    _DepartmentID: this.SSOLoginDataModel.DepartmentID,
  //    _RoleID: this.SSOLoginDataModel.RoleID,
  //    _Createdby: this.SSOLoginDataModel.UserID,
  //  });

  //  this.clearAllAfterAddMore();
  //  return;
  //}


  async onAddmoreSubmit() {
    debugger;
    let ORG_DistrictName = '';
    let ParticipatedDistrictListname = '';
    let ParticipatedDistrictIDS = '';

    // CHANGE 1
    const orgDistrictObj = this.DistrictMasterList.find(
      (d: any) => d.ID == this.WrokshopReportFormGroup.value.OrganisedDistrictName
    );
    if (orgDistrictObj) {
      ORG_DistrictName = orgDistrictObj.Name;
    }

    //  CHANGE 2
    if (this.WrokshopReportFormGroup.value.SelectedDistrictList.length > 0) {
      this.WrokshopReportFormGroup.value.SelectedDistrictList.forEach(
        (districtId: string) => {
          const districtObj = this.ALLDistrictMasterList.find(
            (d: any) => d.ID == districtId
          );

          if (districtObj) {
            if (ParticipatedDistrictListname) {
              ParticipatedDistrictListname += ', ' + districtObj.Name;
              ParticipatedDistrictIDS += ',' + districtId;
            } else {
              ParticipatedDistrictListname = districtObj.Name;
              ParticipatedDistrictIDS = districtId;
            }
          }
        }
      );
    } else {
      this.toastr.warning('Please Fill All Required Fields !');
      return;
    }

    if (!this.RowAddedList) {
      this.RowAddedList = [];
    }

    this.RowAddedList.push({
      _workshopDate: this.WrokshopReportFormGroup.value.workshopDate,
      _OrganisedDistrictID:
        this.WrokshopReportFormGroup.value.OrganisedDistrictName,
      _SelectedDistrictListIDs: ParticipatedDistrictIDS,
      _establishmentName: this.WrokshopReportFormGroup.value.establishmentName,
      _establishmentNameAddress:
        this.WrokshopReportFormGroup.value.establishmentName +
        '/' +
        this.WrokshopReportFormGroup.value.establishmentAddress,
      _establishmentAddress: this.WrokshopReportFormGroup.value.establishmentAddress,
      _representativeName: this.WrokshopReportFormGroup.value.representativeName,
      _representativedesignation:
        this.WrokshopReportFormGroup.value.representativedesignation,
      _representativeMobile:
        this.WrokshopReportFormGroup.value.representativeMobile,
      _Remars: this.WrokshopReportFormGroup.value.Remars,

      //  CHANGE 3
      _ORG_districtName: ORG_DistrictName,

      _representativeNameAddressMobileno:
        this.WrokshopReportFormGroup.value.representativeName +
        '/' +
        this.WrokshopReportFormGroup.value.representativedesignation +
        '/' +
        this.WrokshopReportFormGroup.value.representativeMobile,
      _ParticipatedDistrictListname: ParticipatedDistrictListname,

      _EndTermID: this.SSOLoginDataModel.EndTermID,
      _DepartmentID: this.SSOLoginDataModel.DepartmentID,
      _RoleID: this.SSOLoginDataModel.RoleID,
      _Createdby: this.SSOLoginDataModel.UserID,
    });

    this.clearAllAfterAddMore();
    return;
  }


  onSelectionChange(event: any) {
    const selected = event.value;
    const allIDs = this.ALLDistrictMasterList.map((item: { ID: any; }) => item.ID);

    if (selected.includes('ALL')) {
      if (this.isAllSelected) {
        // Unselect all
        this.WrokshopReportFormGroup.get('SelectedDistrictList')?.setValue([]);
        this.isAllSelected = false;
      } else {
        // Select all
        this.WrokshopReportFormGroup.get('SelectedDistrictList')?.setValue(allIDs);
        this.isAllSelected = true;
      }
    } else {
      this.isAllSelected = selected.length === allIDs.length;
    }
  }

  deleteRow(index: number) {
    this.RowAddedList.splice(index, 1);
  }

  async GetDistrictMatserDDL() {
   
    try {

      this.loaderService.requestStarted();
      if (this.SSOLoginDataModel.RoleID != 97) {
        await this.CommonService.GetCommonMasterData('DistrictHindi')
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictMasterList = data['Data'];
            console.log(this.DistrictMasterList)
          }, (error: any) => console.error(error)
          );
      } else {
        await this.CommonService.GetCommonMasterData('NodalDistrict', this.SSOLoginDataModel.InstituteID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictMasterList = data['Data'];
            console.log(this.DistrictMasterList)
          }, (error: any) => console.error(error)
          );
      }
   
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

  async GetAllDistrictMatserDDL() {

    try {

      this.loaderService.requestStarted();
     
        await this.CommonService.GetCommonMasterData('DistrictHindi')
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.ALLDistrictMasterList = data['Data'];
            console.log(this.ALLDistrictMasterList)
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

  clearAllAfterAddMore()
  {
    this.WrokshopReportFormGroup.reset();
    this.WrokshopReportFormGroup.patchValue({
      OrganisedDistrictName : 0
    });
  }
  ResetAll()
  {
    this.WrokshopReportFormGroup.reset();
    this.RowAddedList = [];
    this.WrokshopReportFormGroup.patchValue({
      OrganisedDistrictName: 0
    });
  }

  async atLeastOneSelectedValidator(): Promise<ValidatorFn> {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return Array.isArray(value) && value.length > 0 ? null : { required: true };
    };
  }

  async FinalSubmit() {

    try {
      this.loaderService.requestStarted();

      await this.ApprenticeShipRPTService.Save_WorkshopProgressRPT(this.RowAddedList)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0)
          {
            this.toastr.success(data.Data['0'].msg);
            setTimeout(() => {
              this.routers.navigate(['/Workshop-progressReport-List']);
            }, 1500);
             
          }
          
          //console.log(this.DataList)
        }, (error: any) => console.error(error)
        );

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }


  // Edit Record
  async GetReportDatabyID(ReportID: number) {

    try {
      this.loaderService.requestStarted();
      var UserID=0
      if (this.SSOLoginDataModel.RoleID == 97) {
        UserID = this.SSOLoginDataModel.UserID
      } else {
        UserID=0
      }

      let obj = {
        EndTermID: this.SSOLoginDataModel.EndTermID,
        DepartmentID: this.SSOLoginDataModel.DepartmentID,
        RoleID: this.SSOLoginDataModel.RoleID,
        Createdby: UserID,
        PKID: ReportID,  //  get Record by ID for Edit
      };



      await this.ApprenticeShipRPTService.Get_WorkshopProgressReportAllData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0)
          {

            this.WrokshopReportFormGroup.patchValue({
              workshopDate: data.Data['0'].workshopDate ,
              OrganisedDistrictName: data.Data['0'].OrganisedDistrictID, 
              SelectedDistrictList: data.Data['0'].ParticipatedDistrictListIDs.split(',').map(Number),
              establishmentName: data.Data['0'].establishmentName,
              establishmentAddress: data.Data['0'].establishmentAddress,
              representativeName: data.Data['0'].representativeName,
              representativedesignation: data.Data['0'].representativedesignation,
              representativeMobile: data.Data['0'].representativeMobile,
              Remars: data.Data['0'].Remars,

            })
            this.IsUpdateCase = true;
            this.UpdateEditID = ReportID;
          }
          else {
            // this.DataList = [];
          }

          //console.log(this.DataList)
        }, (error: any) => console.error(error)
        );

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


 async UpdateRecordbyID(UpdateEditID :number)
  {
    let ORG_DistrictName = '';
    let ParticipatedDistrictListname = '';
    let ParticipatedDistrictIDS = '';
    const ddlDistrict = document.querySelector(`#ddlDistrict option[value='${this.WrokshopReportFormGroup.value.OrganisedDistrictName}']`);
    if (ddlDistrict) {
      ORG_DistrictName = ddlDistrict.textContent?.trim() || '';
    }

    if (this.WrokshopReportFormGroup.value.SelectedDistrictList.length > 0) {

      this.WrokshopReportFormGroup.value.SelectedDistrictList.forEach((districtId: string) => {
        const ParticipatedDistrictList = document.querySelector(`#ddlDistrict option[value='${districtId}']`);

        if (ParticipatedDistrictList) {
          const districtName = ParticipatedDistrictList.textContent?.trim() || '';
          if (districtName) {
            if (ParticipatedDistrictListname) {
              ParticipatedDistrictListname += ', ' + districtName;
              ParticipatedDistrictIDS += ',' + districtId;
            } else {
              ParticipatedDistrictListname = districtName;
              ParticipatedDistrictIDS = districtId;
            }
          }
        }
      });
    }
    else {
      this.toastr.warning("Please Fill All Required Fields !");
      return;
    }


    if (!this.UpdateRowRecordList) {
      this.UpdateRowRecordList = [];
    }


    this.UpdateRowRecordList.push({
      _workshopDate: this.WrokshopReportFormGroup.value.workshopDate,
      _OrganisedDistrictID: this.WrokshopReportFormGroup.value.OrganisedDistrictName,
      _SelectedDistrictListIDs: ParticipatedDistrictIDS,
      _establishmentName: this.WrokshopReportFormGroup.value.establishmentName,
      _establishmentNameAddress: this.WrokshopReportFormGroup.value.establishmentName + "/" + this.WrokshopReportFormGroup.value.establishmentAddress,
      _establishmentAddress: this.WrokshopReportFormGroup.value.establishmentAddress,
      _representativeName: this.WrokshopReportFormGroup.value.representativeName,
      _representativedesignation: this.WrokshopReportFormGroup.value.representativedesignation,
      _representativeMobile: this.WrokshopReportFormGroup.value.representativeMobile,
      _Remars: this.WrokshopReportFormGroup.value.Remars,
      _ORG_districtName: ORG_DistrictName,

      _representativeNameAddressMobileno: this.WrokshopReportFormGroup.value.representativeName + "/" + this.WrokshopReportFormGroup.value.representativedesignation + "/" + this.WrokshopReportFormGroup.value.representativeMobile,
      _ParticipatedDistrictListname: ParticipatedDistrictListname,

      _EndTermID: this.SSOLoginDataModel.EndTermID,
      _DepartmentID: this.SSOLoginDataModel.DepartmentID,
      _RoleID: this.SSOLoginDataModel.RoleID,
      _Createdby: this.SSOLoginDataModel.UserID,
      PKID: UpdateEditID    // pass ID and Update Selected Record
    });

    try {
      this.loaderService.requestStarted();

      await this.ApprenticeShipRPTService.Save_WorkshopProgressRPT(this.UpdateRowRecordList)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            this.toastr.success(data.Data['0'].msg);
            sessionStorage.setItem('WorkshopProgressReportPKID','0');
            setTimeout(() => {
              this.routers.navigate(['/Workshop-progressReport-List']);
            }, 1500);

          }

        }, (error: any) => console.error(error)
        );

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }
}
