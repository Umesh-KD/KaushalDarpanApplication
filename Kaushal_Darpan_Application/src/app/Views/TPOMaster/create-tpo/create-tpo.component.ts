import { Component, inject, OnInit } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CreateTpoAddEditModel, CreateTpoSearchModel } from '../../../Models/CreateTPOModel';
import { CreateTpoService } from '../../../Services/TPOMaster/create-tpo.service';
import { MatDialog } from '@angular/material/dialog';
import { EditTpoComponent } from '../details-tpo/edit-tpo/edit-tpo.component';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
@Component({
    selector: 'app-create-tpo',
    templateUrl: './create-tpo.component.html',
    styleUrls: ['./create-tpo.component.css'],
    standalone: false
})
export class CreateTpoComponent implements OnInit {
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

  constructor(private createTpoService: CreateTpoService, private swat: SweetAlert2 ,private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private fb: FormBuilder, private modalService: NgbModal) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetDistrictMasterList()
    await this.GetAllData()
  } 

  async GetAllData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.createTpoService.GetAllData(this.searchRequest)
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

  async SaveAllData() {
    try {
      this.loaderService.requestStarted();

      this.CollegeMasterList.forEach(x => {
        x.ModifyBy = this.sSOLoginDataModel.UserID;
      });
      console.log(this.CollegeMasterList);


      //save
      await this.createTpoService.SaveAllData(this.CollegeMasterList)
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
    try {
      this.loaderService.requestStarted();

      this.CollegeMasterList.forEach(x => {
        x.ModifyBy = this.sSOLoginDataModel.UserID;
      });
      console.log(this.CollegeMasterList);

      this.swat.Confirmation("Are you sure you want to Delete this ?",
        async (result: any) => {
          if (result.isConfirmed) {

            //save
            await this.createTpoService.DeleteAllData(this.CollegeMasterList)
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
})
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



}
