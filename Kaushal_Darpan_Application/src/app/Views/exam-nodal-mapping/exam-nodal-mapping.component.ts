
import { Component, ElementRef, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CreateTpoAddEditModel, CreateTpoSearchModel } from '../../Models/CreateTPOModel';
import { CreateTpoService } from '../../Services/TPOMaster/create-tpo.service';
import { MatDialog } from '@angular/material/dialog';

import { EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { EditTpoComponent } from '../TPOMaster/details-tpo/edit-tpo/edit-tpo.component';
import { ITINodalOfficerExminerReportService } from '../../Services/ITI/ITINodalOfficerExminerReport/ITINodalOfficerExminerReport.service';
import { CommonVerifierApiDataModel } from '../../Models/PublicInfoDataModel';
@Component({
  selector: 'app-exam-nodal-mapping',
  standalone: false,
  templateUrl: './exam-nodal-mapping.component.html',
  styleUrl: './exam-nodal-mapping.component.css'
})
export class ExamNodalMappingComponent {
  public Isverifed:boolean=false
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: number = -1;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  public UserID: number = 0;
  public AllSelect: boolean = false;
  readonly dialog = inject(MatDialog);
  public DistrictMasterList: any[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new CreateTpoSearchModel();
  public CollegeMasterList: CreateTpoAddEditModel[] = []
  private commonMasterService = inject(CommonFunctionService)
  public requestSSoApi = new CommonVerifierApiDataModel();
  constructor(private createTpoService: ITINodalOfficerExminerReportService, private swat: SweetAlert2, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private fb: FormBuilder, private modalService: NgbModal) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetDistrictMasterList()
    await this.GetAllData()
  }

  async GetAllData() {

    let obj = {
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      DistrictID: this.searchRequest.DistrictID
    }
    try {
      this.loaderService.requestStarted();
      await this.createTpoService.GetAllData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CollegeMasterList = data['Data'];
          console.log(this.CollegeMasterList)
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

  openDialog(college: CreateTpoAddEditModel): void {
    const dialogRef = this.dialog.open(EditTpoComponent, {
      data: {
        InstituteID: college.InstituteID,
        SSOID: college.SSOID,
        Name: college.Name,
        Email: college.Email,
        EmailOfficial: college.EmailOfficial,
        InstituteNameEnglish: college.InstituteNameEnglish,
        MobileNumber: college.MobileNumber,
        UserID: college.UserID,
        DistrictNameEnglish: college.DistrictNameEnglish,
        InstituteNameHindi: college.InstituteNameHindi,
        Marked: true,
        ModifyBy: 0,
        IPAddress: college.IPAddress,
        DepartmentID: college.DepartmentID
      },
      width: '80%',  // Set custom width
      maxWidth: '90vw', // Max width (use vw or px for responsive design)
    });


    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        console.log('Form submission was successful:', result); // result will be the value of this.State
        this.GetAllData()
        // Handle success (e.g., refresh data or navigate)
      } else {
        console.log('Form submission failed or was canceled');
      }
    });
  }


  async GetDistrictMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DistrictMasterList = data['Data'];
          console.log(this.DistrictMasterList)
          // console.log(this.DivisionMasterList)
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

  async SaveAllData(row:any) {
    try {
      this.loaderService.requestStarted();

      let obj = {
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        DistrictID: row.DistrictID,
        SSOID: row.SSOID,
        UserName: row.UserName,
        MobileNumber: row.MobileNumber,
        Email: row.Email,
        ModifyBy: this.sSOLoginDataModel.UserID
      }


      //save
      await this.createTpoService.SaveAllData(obj)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.GetAllData();
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to create Tpo!');
        });
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

  async ClearSearchData() {
    this.AllSelect = false;
    this.searchRequest.DistrictID = 0;
    this.searchRequest = new CreateTpoSearchModel();
    await this.GetAllData()
  }

  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.CollegeMasterList) {
      item.Marked = this.AllSelect;

    }
  }


  async DeleteAllData() {
    //try {
    //  this.loaderService.requestStarted();

    //  this.CollegeMasterList.forEach(x => {
    //    x.ModifyBy = this.sSOLoginDataModel.UserID;
    //  });
    //  console.log(this.CollegeMasterList);

    //  this.swat.Confirmation("Are you sure you want to Delete this ?",
    //    async (result: any) => {
    //      if (result.isConfirmed) {

    //        //save
    //        await this.createTpoService.DeleteAllData(this.CollegeMasterList)
    //          .then(async (data: any) => {
    //            this.State = data['State'];
    //            this.Message = data['Message'];
    //            this.ErrorMessage = data['ErrorMessage'];
    //            if (this.State === EnumStatus.Success) {
    //              this.toastr.success(this.Message);
    //              await this.GetAllData();
    //            } else {
    //              this.toastr.error(this.ErrorMessage);
    //            }


    //          })

    //          .catch((error: any) => {
    //            console.error(error);
    //            this.toastr.error('Failed to create Tpo!');
    //          });
    //      }
    //    })
    //}
    //catch (ex) {
    //  console.log(ex);
    //}
    //finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}
  }


  async SSOIDGetSomeDetails(row:any): Promise<any> {
    row.Isverifed = false
    if (row.SSOID == "") {
      this.toastr.error("Please Enter SSOID");
  
      return;
    }

    const username = row.SSOID; // or hardcoded 'SIDDHA.AZAD'
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    /*const url = `https://ssotest.rajasthan.gov.in:4443/SSOREST/GetUserDetailJSON/${username}/${appName}/${password}`;*/

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;



    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {
            row.UserName   = parsedData.displayName;
            row.MobileNumber = parsedData.mobile;
            row.SSOID = parsedData.SSOID;
            row.Email = parsedData.mailPersonal;
            row.Isverifed = true

          }
          else {
            this.toastr.error("Record Not Found");
            row.UserName = ''
            row.MobileNumber = ''
            row.SSOID =''
            row.Email = ''
            return;
          }

          //alert("SSOID: " + parsedData.SSOID); // show SSOID in alert
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }
}
