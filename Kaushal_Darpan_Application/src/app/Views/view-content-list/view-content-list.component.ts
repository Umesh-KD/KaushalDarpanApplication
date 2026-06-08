import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { ToastrService } from 'ngx-toastr';
import { WebsiteSettingDataModel } from '../../Models/BTER/WebsiteSettingsDataModel';
import { WebsiteSettingsService } from '../../Services/BTER/WebsiteSettings/website-settings.service';
import { EnumDepartment, EnumRole, EnumStatus, EnumWS_DepartmentSub } from '../../Common/GlobalConstants';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { RequestBaseModel } from '../../Models/RequestBaseModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-view-content-list',
  standalone: false,
  templateUrl: './view-content-list.component.html',
  styleUrl: './view-content-list.component.css'
})
export class ViewContentListComponent {
  HighlightsFromGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  isFormSubmitted: boolean = false
  request = new WebsiteSettingDataModel();
  Searchrequest = new WebsiteSettingDataModel();
  public todayDate: any;
  requestBaseModel = new RequestBaseModel();
  GetDynamicUploadTypeDDL_Data: any = []
  ViewTypeDDL: any = []
  PostList: any = []
  _EnumWS_DepartmentSub = EnumWS_DepartmentSub;
  _EnumDepartment = EnumDepartment;
  DynamicContentData: any = [];
  StaffTypeList: any = [];
  DocumentCategory: any = [];
  Table_SearchText: string = '';
  IsPrivate: boolean = false
  modalReference: NgbModalRef | undefined;
  @ViewChild(MatSort) sort!: MatSort;
  closeResult: string | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
    private toastr: ToastrService,
    private websiteSettingsService: WebsiteSettingsService,
    public appsettingConfig: AppsettingService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    this.HighlightsFromGroup = this.formBuilder.group({
      Title: ['', Validators.required],

      Start_Date: ['', Validators.required],
      End_Date: ['', Validators.required],

      ViewTypeIDs: ['', Validators.required],
      DepartmentSubID: ['', [DropdownValidators]],
      TypeID: ['', [DropdownValidators]],
      DocCategoryID: ['', [DropdownValidators]],
      StaffTypeID: ['', [DropdownValidators]],
      DesignationID: ['', Validators.required],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.todayDate = new Date().toISOString().substring(0, 16);

    await this.GetDynamicUploadTypeDDL();
    await this.GetLateralCourse();
    await this.GetViewTypeDDL();
    await this.GetAllData();
    await this.GetStaffTypeData();
    //debugger
    if (this.sSOLoginDataModel.RoleID == EnumRole.Apprenticeship || this.sSOLoginDataModel.RoleID == EnumRole.Apprenticeship) {
      //debugger
      this.request.TypeID = 6
      this.HighlightsFromGroup.get('TypeID')?.disable();
    } else {
      this.HighlightsFromGroup.get('TypeID')?.enable();
    }
  }

  get _HighlightsFromGroup() { return this.HighlightsFromGroup.controls; }

  async GetStaffTypeData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('PostType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async fillupDesignation() {


    await this.GetPostList();
  }
  async GetPostList() {
    try {

      this.loaderService.requestStarted();
      const data: any = await this.commonMasterService.GetCommonMasterData('PostMaster', this.request.StaffTypeID);
      this.PostList = data['Data'];
      //this.PostList = this.PostList.filter((item: any) => item.TypeID == this.formData.StaffTypeID);
      // Keep original list for filtering later
      console.log(this.PostList, "PostList");
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ResetControls() {
    this.request = new WebsiteSettingDataModel();
    this.Searchrequest = new WebsiteSettingDataModel();
    this.HighlightsFromGroup.reset()
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.isFormSubmitted = false
    this.HighlightsFromGroup.controls['DepartmentSubID'].enable();
    this.HighlightsFromGroup.controls['TypeID'].enable();
  }

  async SaveData() {

    this.isFormSubmitted = true;
    if (this.sSOLoginDataModel.RoleID == 212) {
      this.HighlightsFromGroup.controls['DepartmentSubID'].clearValidators()
    } else {
      this.HighlightsFromGroup.controls['DepartmentSubID']
        .setValidators([Validators.required]);

    }
    this.HighlightsFromGroup.controls['DepartmentSubID']
      .updateValueAndValidity();


    if (this.sSOLoginDataModel.DepartmentID == 1) {
      this.HighlightsFromGroup.controls['DocCategoryID'].clearValidators()
    } else {
      this.HighlightsFromGroup.controls['DocCategoryID']
        .setValidators([DropdownValidators]);

    }
    this.HighlightsFromGroup.controls['DocCategoryID'].updateValueAndValidity()


    if (this.request.ViewTypeIDs != '10363') {
      this.HighlightsFromGroup.controls['Start_Date'].clearValidators()
      this.HighlightsFromGroup.controls['End_Date'].clearValidators()
    } else {

      this.HighlightsFromGroup.controls['Start_Date']
        .setValidators([Validators.required]);
      this.HighlightsFromGroup.controls['End_Date']
        .setValidators([Validators.required]);

    }
    this.HighlightsFromGroup.controls['Start_Date'].updateValueAndValidity()
    this.HighlightsFromGroup.controls['End_Date'].updateValueAndValidity()


    if (this.sSOLoginDataModel.DepartmentID == 1 || this.request.ViewTypeIDs != '10366') {
      this.HighlightsFromGroup.controls['StaffTypeID'].clearValidators()
      this.HighlightsFromGroup.controls['DesignationID'].clearValidators()
      this.request.StaffTypeID = 0
      this.request.DesignationID = ''
    } else {
      this.HighlightsFromGroup.controls['StaffTypeID']
        .setValidators([DropdownValidators]);
      this.HighlightsFromGroup.controls['DesignationID']
        .setValidators([Validators.required]);
    }

    this.HighlightsFromGroup.controls['StaffTypeID'].updateValueAndValidity()
    this.HighlightsFromGroup.controls['DesignationID'].updateValueAndValidity()

    if (this.HighlightsFromGroup.invalid) {
      this.toastr.error("Please Fill Required Fields")
      return
    }

    if (this.request.FileName == '') {
      this.toastr.warning("Please Upload Document")
      return
    }

    if (this.sSOLoginDataModel.DepartmentID == 2 && this.request.ViewTypeIDs == '10366') {

      this.request.DesignationID =
        this.HighlightsFromGroup.value.DesignationID?.join(',') || '';
    }


    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.request.UserID = this.sSOLoginDataModel.UserID


    this.request.LevelID = this.sSOLoginDataModel.LevelId
    this.request.CreatedByRoleID = this.sSOLoginDataModel.RoleID



    try {
      await this.websiteSettingsService.SaveData(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.CloseModal();
          await this.GetAllData();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  async GetDynamicUploadTypeDDL() {
    try {
      await this.websiteSettingsService.GetDynamicUploadTypeDDL(this.requestBaseModel).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.GetDynamicUploadTypeDDL_Data = data.Data
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })

    } catch (error) {
      console.log(error);
    }
  }

  async GetLateralCourse() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('DocumentCategory')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.DocumentCategory = data['Data'];

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
  async GetViewTypeDDL() {
    try {
      await this.commonMasterService.GetCommonMasterDDLByType('ViewType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.ViewTypeDDL = data.Data
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })

    } catch (error) {
      console.log(error);
    }
  }



  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (
          this.file.type == 'image/jpeg' ||
          this.file.type == 'image/jpg' ||
          this.file.type == 'image/png' ||
          this.file.type == 'application/pdf'
        ) {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File');
            return;
          }
        } else {
          this.toastr.error('Select Only jpeg/jpg/png/pdf file');
          return;
        }
        // upload to server folder

        await this.commonMasterService
          .UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State == EnumStatus.Success) {
              if (Type == 'Photo') {
                this.request.FileName = data['Data'][0]['FileName'];
                this.request.Dis_FileName = data['Data'][0]['Dis_FileName'];
              }

              event.target.value = null;
            }
            if (data.State == EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);
            } else if (data.State == EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    }
  }

  async GetAllData() {

    try {
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.Searchrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.Searchrequest.UserID = this.sSOLoginDataModel.UserID
      if (this.sSOLoginDataModel.RoleID == 212) {
        this.Searchrequest.DepartmentSubID = 6
      }
      await this.websiteSettingsService.GetAllDataOrders(this.Searchrequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        this.DynamicContentData = data.Data


      })

    } catch (error) {
      console.log(error);
    }
  }

  async onDelete(row: any) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.request.WS_ID = row.WS_ID;
            this.request.UserID = this.sSOLoginDataModel.UserID
            this.request.DUTC_ID = row.DUTC_ID
            await this.websiteSettingsService.DeleteDataByID(this.request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (data.State = EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  this.ResetControls();
                  await this.GetAllData()
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
        }
      });
  }

  async onEdit(row: any, content: any) {
    try {


      this.modalService.open(content, {

        size: 'xl',

        ariaLabelledBy: 'modal-basic-title',

        backdrop: 'static'

      }).result.then((result) => {

        this.closeResult = `Closed with: ${result}`;

      }, (reason: any) => {

        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });


      this.request.WS_ID = row.WS_ID
      await this.websiteSettingsService.GetById(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          if (data.State = EnumStatus.Success) {
            this.request = data.Data

            this.GetPostList()

            this.HighlightsFromGroup.patchValue({
              ViewTypeIDs: this.request.ViewTypeIDs
            });



            this.HighlightsFromGroup.patchValue({


              DesignationID: this.request.DesignationID
                ? this.request.DesignationID.split(',').map(Number)
                : []
            });

            this.HighlightsFromGroup.controls['DepartmentSubID'].disable();
            this.HighlightsFromGroup.controls['TypeID'].disable();
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
  }

  onToggleChange(row: any) {

    this.Swal2.Confirmation("Are you sure you want to Change Status ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            row.IsActive = !row.IsActive
            this.loaderService.requestStarted();
            this.request.WS_ID = row.WS_ID;
            this.request.UserID = this.sSOLoginDataModel.UserID
            this.request.DUTC_ID = row.DUTC_ID
            this.request.IsActive = row.IsActive
            await this.websiteSettingsService.ActiveStatusChange(this.request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (data.State = EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  this.ResetControls();
                  await this.GetAllData()
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
        }
      });
  }


  onClickCheckbox() {
    this.request.IsPrivate = !this.request.IsPrivate;
    if (!this.request.IsPrivate) {
      this.request.IsPrivate = false
    } else {
      this.request.IsPrivate = true
    }
  }


  async AddStaffData(content: any, rowData: any = null) {



    // ============================
    // LOAD DROPDOWNS
    // ============================



    // ============================
    // EDIT DATA
    // ============================



    // ============================
    // STREAM LOAD
    // ============================


    // ============================
    // OPEN MODAL
    // ============================

    this.modalService.open(content, {

      size: 'xl',

      ariaLabelledBy: 'modal-basic-title',

      backdrop: 'static'

    }).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

    }, (reason: any) => {

      this.closeResult =
        `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  CloseModal() {

    this.modalService.dismissAll()


    this.request = new WebsiteSettingDataModel()
    this.HighlightsFromGroup.reset()
  }

}
