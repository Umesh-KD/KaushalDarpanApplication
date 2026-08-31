import { Component, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumStatus, GlobalConstants, EnumStaffTrainingStatus, EnumRole, EnumTransferSystemStatus } from '../../../../Common/GlobalConstants';
import { BTER_EM_TransferSystemModle, BTER_GetStaffPersonalDetailsModel, BTERStaffManualRequestModel, EM_TransferSystemSearchModel, TransferSystemGeneratorDataModel, TransferSystemUpdateDataModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { BTEREMStaffServiceDetailsService } from '../../../../Services/BTER/BTER_EM_StaffServiceDetails/bter-em-staff-service-details.service';
import { DropdownValidators, DropdownValidators1 } from '../../../../Services/CustomValidators/custom-validators.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ViewStaffProfileModalComponent } from '../../BTER-GOVT-Establish-Management/view-staff-profile-modal/view-staff-profile-modal.component';
import { StreamDDL_InstituteWiseModel } from '../../../../Models/CommonMasterDataModel';

  @Component({
    selector: 'app-TabutarTransferList',
    standalone: false,
    templateUrl: './TabutarTransferList.component.html',
    styleUrl: './TabutarTransferList.component.css'
  })

  export class TabutarTransferListComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
    public updateSearch = new TransferSystemUpdateDataModel();

    public updateExtSearch = new EM_TransferSystemSearchModel();
    /*public request = new EM_TransferSystemSearchModel();*/
    public searchRequest = new EM_TransferSystemSearchModel();

  public AddTrainingDetailsFromGroup!: FormGroup;

  public EM_TrainingCourseTypeList: any = [];
   
    public EM_TransferProcessList: any = [];
    public AllSelect: boolean = false;
    public ExaminersList: any[] = [];
    public TransferSystemStatusList: any[] = [];
    public EM_TransferSystemEXTList: any[] = [];
    public EM_TransferSystemHSTList: any[] = [];
    public TransferSystemStatusSearchList: any[] = [];
    public StaffDDLList: any[] = [];
    

  isSubmitted: boolean = false;
  Table_SearchText: string = '';
  public file!: File;
    public Uploadfile: string = '';
    selectedRows: any[] = [];
    isSingleSelection = false;
    public Status: string = '';
    public SearchStatus: number = 0;
    public Remark: string = '';
    public statusID: number = 0;
    modalReference: NgbModalRef | undefined;
    public StaffTrainingHTS_GetDataList: any = [];
    public ShowCheckBoxId: number = 0;
    public GazettedList: any[] = [
      { ID: 1, Name: 'Gazetted' },
      { ID: 2, Name: 'Non-Gazetted' }
    ];
    public GetTransfercateList: any = [];
    public ItiCollegesListAll: any = [];
    public InstituteList: any = [];
    public SearchCategoryID: number = 0;
    public SearchInstituteID: number = 0;
    public SearchEmployeeType: number = 0;

    public SupportingDoc: string = '';
    public Dis_SupportingDoc: string = '';
    public TransferSystemStatusUpdateList: any = [];
    public updateStatus: number = 0;
    public isAnyApproved: boolean = false;
    public requestUp = new TransferSystemGeneratorDataModel();
    public RequestManual = new BTERStaffManualRequestModel();
    public UpdateTransferRequest!: FormGroup;
    public requestModel = new BTER_GetStaffPersonalDetailsModel();
    public GetStaffPersonalDetailsList: any = [];
    public request = new BTER_EM_TransferSystemModle();
    public PostList: any = [];
    public OfficeList: any[] = [];
    public DistrictList: any = [];
    public AddTransferRequest!: FormGroup;
    public isShowData: boolean = false;
    public To_OfficeList: any[] = [];
    public To_PostList: any = [];
   
    public To_DistrictList: any = [];
    public To_InstituteList: any = [];
    public InsOfficeID: number = 21;
    public isShowDDl: boolean = false;
    public To_isShowDDl: boolean = false;

    public isStar: boolean = false;
    todayDate: string = new Date().toISOString().split('T')[0];
    public CourseMasterDDL: any = [];
    public TransferSystem_PostWiseBranchID: any = [];
    public To_CourseMasterDDL: any = [];
    public StreamSearch = new StreamDDL_InstituteWiseModel();
    public IsBranchshow: number = 0;
    public To_IsBranchshow: number = 0;
    @ViewChild('Modal_StaffDetailsViewModal') childComponentViewStaffProfile!: ViewStaffProfileModalComponent;
    public GetDesignationID: number[] = [];


  constructor(
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private bterEstablishManagementService: BTEREstablishManagementService,
    private staffServiceDetailsService: BTEREMStaffServiceDetailsService,
    private appsettingConfig: AppsettingService,
    private modalService: NgbModal,
  ) { }

    async ngOnInit() {

      this.AddTransferRequest = this.formBuilder.group({

        PostID: [0, [DropdownValidators]],
        OfficeID: [0, [DropdownValidators]],
        ddlCollege: [0, []],
        ddlDistrictID: [0, []],

        StaffID: [0, [DropdownValidators]],
        TransfercateID: [0, [DropdownValidators]],
        ReasonDescription: [''],
        To_PostID: [0, [DropdownValidators]],
        To_OfficeID: [0, [DropdownValidators]],
        To_ddlDistrictID: [0, []],
        To_ddlCollege: [0, []],
        BranchID: [0, []],
        To_BranchID: [0, []],
        EngNonEngID: [0, []],
        To_EngNonEngID: [0, []],
        Designation: [''],
        SSOID: [''],
      });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.Status = "0";
    await this.commonFunctionService.InstituteMaster(1, 1, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ItiCollegesListAll = data.Data;
    })

    await this.commonFunctionService.GetCommonMasterDDLByType('TransferRequest').then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.GetTransfercateList = data['Data'];
      console.log(this.GetTransfercateList, "GetTransfercateList");
    });
    

    await this.commonFunctionService.GetCommonMasterDDLByAction1('TransferSystemStatus')
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        this.TransferSystemStatusSearchList = data['Data'];
          if (this.sSOLoginDataModel.RoleID == EnumRole.DTE || this.sSOLoginDataModel.RoleID == EnumRole.DIRECTOR) {
            //this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList.filter((item: any) => item.ID ==
              //EnumTransferSystemStatus.Appnoved || item.ID == EnumTransferSystemStatus.UnderDTEReview);

            this.TransferSystemStatusSearchList = this.TransferSystemStatusSearchList
              .filter((item: any) =>
                item.ID == EnumTransferSystemStatus.UnderDTEReview ||
                item.ID == EnumTransferSystemStatus.Approved 
                
              )
              .map((item: any) => {
                if (item.ID == EnumTransferSystemStatus.Approved) {
                  item.Name = 'Dispatched ';
                }

                if (item.ID == EnumTransferSystemStatus.UnderDTEReview) {
                  item.Name = 'Reviewed';
                }

                return item;
              });


            this.SearchStatus = EnumTransferSystemStatus.UnderDTEReview;
            this.onChangeSearchStatus();
            this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderDTEReview);
        }
         else{
          this.TransferSystemStatusList = [];
            this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderDTEReview);
        }
      }, (error: any) => console.error(error));

    await this.GetPostList();
    await this.GetOfficeList();
    await this.ddl_District();

    await this.ToGetOfficeList();
    await this.ToGetPostList();
    await this.Toddl_District();

    }


    get _UpdateTransferRequestForm() {
      return this.UpdateTransferRequest.controls;
    }
    async EM_TransferSystem_GetData_Search(statusID: number) {
      
      this.statusID = statusID;
      await this.EM_TransferSystem_GetData();
    }
    async EM_TransferSystem_GetData() {
      debugger
      try {
        this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
        this.searchRequest.Action = "TabutarTransferList";
        this.searchRequest.StatusID = this.SearchStatus;
        this.searchRequest.CategoryID = this.SearchCategoryID;
        this.searchRequest.EmployeeType = this.SearchEmployeeType;
        this.searchRequest.InstituteID = this.SearchInstituteID;
        await this.staffServiceDetailsService.GetEM_TransferSystemData(this.searchRequest).then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.EM_TransferProcessList = data.Data;
            if (this.statusID == 0) {
              this.EM_TransferProcessList = data.Data;
            }
          } else {
            this.EM_TransferProcessList = [];
          }
        })
      } catch (error) {
        console.error(error);
      }
    }
    checkboxthView_checkboxchange(isChecked: boolean) {
      
      this.AllSelect = isChecked;
      for (let item of this.EM_TransferProcessList) {
        item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
      }

    }

    async onFilechange(event: any, Name: any) {
      debugger
      try {
        this.file = event.target.files[0];
        if (this.file) {
          // Type validation
          if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
            // Size validation
            if (this.file.size > 2000000) {
              this.toastr.error('Select less than 2MB File');
              return;
            }
          }
          else {
            this.toastr.error('Select valid file type jpg/jpeg/png/pdf');
            this.Uploadfile = '';
            event.target.value = null;
            return;
          }

          //upload model
          let uploadModel = new UploadFileModel();
          uploadModel.FileExtention = this.file.type ?? "";
          uploadModel.MinFileSize = "";
          uploadModel.MaxFileSize = "2000000";
          uploadModel.FolderName = "BTER_Establishment/TransferRequestDocument";

          //Upload to server folder
          await this.commonFunctionService.UploadDocument(this.file, uploadModel)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State === EnumStatus.Success) {
                if (Name == 'SupportingDocuments') {
                  this.requestUp.OrderSupportingDocument = data['Data'][0]["FileName"];
                  this.requestUp.OrderSupportingDocument_Dis = data['Data'][0]["Dis_FileName"];
                } else {
                  this.toastr.warning("no action provided")
                }
              }

              if (data.State === EnumStatus.Error) {
                this.toastr.error(data.ErrorMessage);

              } else if (data.State === EnumStatus.Warning) {
                this.toastr.warning(data.ErrorMessage);
              }
            });
        }
      } catch (Ex) {
        console.log(Ex);
      } finally {
        this.loaderService.requestEnded();
      }
    }

  

    async TransferSystemGeneratorUpdate() {
      debugger
      try {
        if (!this.requestUp.DispatchNo || this.requestUp.DispatchNo == "") {
          this.toastr.warning("Please enter DispatchNo");
          return;
        }

        if (!this.requestUp.OrderDate || this.requestUp.OrderDate == "") {
          this.toastr.warning("Please enter Date");
          return;
        }
        if (!this.requestUp.OrderSupportingDocument || this.requestUp.OrderSupportingDocument == "") {
          this.toastr.warning("Please Upload Doc");
          return;
        }

        const selectedRows = this.EM_TransferProcessList
          .filter((item: any) => item.Selected === true);

        if (selectedRows.length === 0) {
          this.toastr.warning("Please select at least one record");
          return;
        }
        const jsonData = selectedRows.map((item: any) => ({
          TransferSystemID: item.TransferSystemID,
          Status: EnumTransferSystemStatus.Approved,
          DispatchNo: this.requestUp.DispatchNo,
          OrderSupportingDocument: this.requestUp.OrderSupportingDocument,
          OrderSupportingDocument_Dis: this.requestUp.OrderSupportingDocument_Dis,
          OrderDate: this.requestUp.OrderDate,
          CreatedBy: this.sSOLoginDataModel.UserID
        }));
        this.updateSearch.jsonData = JSON.stringify(jsonData);

        this.updateSearch.RoleID = this.sSOLoginDataModel.RoleID;
        await this.staffServiceDetailsService
          .TransferSystemGeneratorUpdate(this.updateSearch)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State === EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.updateSearch.jsonData = "";
              this.EM_TransferProcessList =
                this.EM_TransferProcessList.map((item: any) => ({
                  ...item,
                  Selected: false
                }));
              this.requestUp = new  TransferSystemGeneratorDataModel();
              await this.EM_TransferSystem_GetData();
            } else {
              this.toastr.error(data.ErrorMessage);
            }
          });

      } catch (error) {
        console.error(error);
      }
    }

    async onChangeSearchStatus() {

      if ((this.sSOLoginDataModel.RoleID == EnumRole.DTE || this.sSOLoginDataModel.RoleID == EnumRole.DIRECTOR) && EnumTransferSystemStatus.UnderDTEReview == this.SearchStatus) {
        this.ShowCheckBoxId = 1;
      }

      else {
        this.ShowCheckBoxId = 0;
      }
      this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderDTEReview);
    }

    async onManualRequest(model: any) {
      try {
        this.loaderService.requestStarted();
        try {
          
         
        } catch (error) {
          console.error(error);
        }
        this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
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

    CloseModal() {
      this.modalService.dismissAll();
      this.modalReference?.close();
      this.RequestManual = new BTERStaffManualRequestModel();
      this.IsBranchshow = 0;
      this.To_IsBranchshow = 0;

    }

  


    async GetStaffPersonalDetails() {
      debugger
      try {
        this.loaderService.requestStarted();
        this.requestModel.StaffID = this.RequestManual.StaffID;

        await this.staffServiceDetailsService.GetStaffPersonalDetails(this.requestModel).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GetStaffPersonalDetailsList = data['Data'];
          this.RequestManual.NonGazetteName = this.GetStaffPersonalDetailsList[0]["ISNonGazetted"];
          this.RequestManual.UserID = this.GetStaffPersonalDetailsList[0]["UserID"];
          this.RequestManual.SSOID = this.GetStaffPersonalDetailsList[0]["SSOID"];
          this.request.EmployeeDesignation = this.GetStaffPersonalDetailsList[0]["DesignationNameEnglish"];
          
        });
      }
      catch (error) {
        console.error(error);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    }


    async GetStaffDDLList() {

      try {
        this.loaderService.requestStarted();

        this.StaffDDLList = [];

        if (this.RequestManual.OfficeID != 21) {

          this.RequestManual.DistrictID = 0;
          this.RequestManual.InstituteID = 0;
        }

        if (this.RequestManual.OfficeID != 21 && this.RequestManual.DistrictID == 0 && this.RequestManual.InstituteID==0) {
          
          
          await this.commonFunctionService.DDL_EmployeeTransferSysterm(this.RequestManual.OfficeID, this.RequestManual.PostID, this.RequestManual.DistrictID, this.RequestManual.InstituteID)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.StaffDDLList = data['Data'];
            }, (error: any) => console.error(error));

        }

        if (this.RequestManual.OfficeID == 21 && this.RequestManual.DistrictID != 0 && this.RequestManual.InstituteID !=0) {
          this.RequestManual.OfficeID = this.RequestManual.OfficeID;
          this.RequestManual.InstituteID = this.RequestManual.InstituteID;

          await this.commonFunctionService.DDL_EmployeeTransferSysterm(this.RequestManual.OfficeID, this.RequestManual.PostID, this.RequestManual.DistrictID, this.RequestManual.InstituteID)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.StaffDDLList = data['Data'];
            }, (error: any) => console.error(error));

        }

        

       
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


     

    // from ddl
    async GetOfficeList() {

      try {
        this.loaderService.requestStarted();
        await this.commonFunctionService.DDL_ITI_GovtEMDDLOfficeVacancy(this.sSOLoginDataModel.DepartmentID, 0)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.OfficeList = data['Data'];
            this.To_OfficeList = data['Data'];
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


    async GetPostList() {
      try {
        debugger
        this.loaderService.requestStarted();
        const data: any = await this.commonFunctionService.GetCommonMasterData('Post', 0, 0, 0);
        this.PostList = data['Data'];
        this.To_PostList = data['Data'];
 
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    }

    async ddl_District() {

      try {
        this.loaderService.requestStarted();
        this.DistrictList = [];
        this.To_DistrictList = [];
        await this.commonFunctionService.GetDistrictMaster()
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictList = data['Data'];
            this.To_DistrictList = data['Data'];
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


    async getITICollege() {
      try {
        debugger
        await this.commonFunctionService.GetInstituteMaster_ByDistrictWise(this.RequestManual.DistrictID, this.sSOLoginDataModel.EndTermID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.InstituteList = data['Data'];
            this.To_InstituteList = data['Data'];
            this.InstituteList = this.InstituteList.filter((item: any) => item.TypeID == 1);
           
            

          }, error => console.error(error));

      } catch (error) {
        console.error(error)
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }

    }


    ////To ddl

    async ToGetOfficeList() {

      try {
        this.loaderService.requestStarted();
        await this.commonFunctionService.DDL_ITI_GovtEMDDLOfficeVacancy(this.sSOLoginDataModel.DepartmentID, 0)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
           
            this.To_OfficeList = data['Data'];
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


    async ToGetPostList() {
      try {
        debugger
        this.loaderService.requestStarted();
        const data: any = await this.commonFunctionService.GetCommonMasterData('Post', 0, 0, 0);
      
        this.To_PostList = data['Data'];

      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    }

    async Toddl_District() {

      try {
        this.loaderService.requestStarted();
     
        this.To_DistrictList = [];
        await this.commonFunctionService.GetDistrictMaster()
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
           
            this.To_DistrictList = data['Data'];
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


    async TogetITICollege() {
      try {
        debugger
        await this.commonFunctionService.GetInstituteMaster_ByDistrictWise(this.RequestManual.To_ddlDistrictID, this.sSOLoginDataModel.EndTermID)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.To_InstituteList = data['Data'];
            this.To_InstituteList = this.To_InstituteList.filter((item: any) => item.TypeID == 1);
          }, error => console.error(error));

      } catch (error) {
        console.error(error)
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }

    }


    async OfficeChange() {
      debugger;

      if (this.RequestManual.OfficeID == this.InsOfficeID) {

        this.AddTransferRequest.get('ddlDistrictID')?.setValidators([DropdownValidators]);
        this.AddTransferRequest.get('ddlCollege')?.setValidators([DropdownValidators]);

        this.isShowDDl = true;

      } else {

        this.AddTransferRequest.get('ddlDistrictID')?.clearValidators();
        this.AddTransferRequest.get('ddlCollege')?.clearValidators();

        this.isShowDDl = false;
      }

      this.AddTransferRequest.get('ddlDistrictID')?.updateValueAndValidity();
      this.AddTransferRequest.get('ddlCollege')?.updateValueAndValidity();

      await this.PostChange();
    }

    async To_OfficeChange() {

      debugger
      if (this.RequestManual.To_OfficeID == this.InsOfficeID) {
        this.AddTransferRequest.controls['To_ddlDistrictID'].setValidators([DropdownValidators]);
        this.AddTransferRequest.controls['To_ddlCollege'].setValidators([DropdownValidators]);
        this.To_isShowDDl = true;
      }
      else {
        this.AddTransferRequest.controls['To_ddlDistrictID'].clearValidators();
        this.AddTransferRequest.controls['To_ddlCollege'].clearValidators();
        this.To_isShowDDl = false;
      }
      this.AddTransferRequest.controls['To_ddlDistrictID'].updateValueAndValidity();
      this.AddTransferRequest.controls['To_ddlCollege'].updateValueAndValidity();

    }

    async AddManualRequest() {
      this.isSubmitted = true;
      if (this.AddTransferRequest.invalid) {
        this.AddTransferRequest.markAllAsTouched();
        this.toastr.error('Please fill all the required fields.', 'Error');
        Object.keys(this.AddTransferRequest.controls).forEach(key => {
          const control = this.AddTransferRequest.get(key);

          if (control && control.invalid) {
            this.toastr.error(`Control ${key} is invalid`);
            Object.keys(control.errors!).forEach(errorKey => {
              this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
            });
          }
        });
        return;
      }
      this.RequestManual.CreatedBy = this.sSOLoginDataModel.UserID;

      if (this.isShowDDl == false) {
        this.RequestManual.DistrictID = 0;
        this.RequestManual.InstituteID = 0;
      }

      if (this.To_isShowDDl == false) {
        this.RequestManual.To_ddlDistrictID = 0;
        this.RequestManual.To_ddlCollege = 0;
      }
      debugger
      this.RequestManual.RoleID = this.sSOLoginDataModel.RoleID;
      await this.staffServiceDetailsService
        .AddTransferSystemManualRequest(this.RequestManual)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.RequestManual = new BTERStaffManualRequestModel();

           await  this.CloseModal();
           await this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderDTEReview);

          }
          else if (data.State === EnumStatus.Error) {
            this.toastr.warning(data.Message);
            this.RequestManual = new BTERStaffManualRequestModel();

            await this.CloseModal();
            await this.EM_TransferSystem_GetData_Search(EnumTransferSystemStatus.UnderDTEReview);

          }

          else {
            this.toastr.error(data.ErrorMessage);
          }
        });

    }

    async PostChange() {
      debugger;

      await this.GetTransferSystem_PostWiseBranchCheck();

      if (this.RequestManual.PostID != 0) {

        if (this.RequestManual.InstituteID != 0 && this.GetDesignationID.includes(this.RequestManual.PostID)) {
          this.IsBranchshow = 1;

          this.AddTransferRequest.get('EngNonEngID')?.setValidators([DropdownValidators]);
          this.AddTransferRequest.get('BranchID')?.setValidators([DropdownValidators]);
         
        }
        else {
          this.IsBranchshow = 0;
          await this.GetStaffDDLList();
          this.RequestManual.BranchID = 0;
          this.AddTransferRequest.get('EngNonEngID')?.clearValidators();
          this.AddTransferRequest.get('BranchID')?.clearValidators();
        }

        this.AddTransferRequest.get('EngNonEngID')?.updateValueAndValidity();
        this.AddTransferRequest.get('BranchID')?.updateValueAndValidity();
      } 
    }

    async StaffChange() {
      await this.GetStaffPersonalDetails();
    }

    async TransferCategoryChange() {

      if (this.request.TransferCategoryID == 7358) {
        this.AddTransferRequest.get('ReasonDescription')?.setValidators([Validators.required]);
        this.isStar = true;
      }
      else {
        this.AddTransferRequest.get('ReasonDescription')?.clearValidators();
      }
      this.AddTransferRequest.get('ReasonDescription')?.updateValueAndValidity();


      if (this.request.TransferCategoryID == 7358) {
        this.isStar = true;



      } else {
        this.isStar = false;
      }
    }

    async OpenStaffProfileViewModal(StaffID: number, UserID: number) {
      debugger
      this.childComponentViewStaffProfile.StaffID = StaffID;
      this.childComponentViewStaffProfile.UserID = UserID;
      await this.childComponentViewStaffProfile.OpenStaffProfileViewModal();
    }

    exportToExcel(): void {

      if (this.EM_TransferProcessList.length == 0) {
        this.toastr.warning('No records available for Excel export.');
        return;
      }

      const unwantedColumns = [
        'TransferSystemID',
        'FinalApproveStatus',
        'ISNonGazetted',
        'StatusID',
        'StaffUserID',
        'StaffID'
      ];

      const filteredData = this.EM_TransferProcessList.map(
        (item: any, index: number) => {

          const filteredItem: any = {};

          // Add Serial Number
          filteredItem["Sr. No"] = index + 1;

          Object.keys(item).forEach(key => {
            if (!unwantedColumns.includes(key)) {
              filteredItem[key] = item[key];
            }
          });

          return filteredItem;
        });

      const ws: XLSX.WorkSheet =
        XLSX.utils.json_to_sheet(filteredData);

      const wb: XLSX.WorkBook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, 'Report');

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.-]/g, '_');

      XLSX.writeFile(
        wb,
        `TabularTransferList_${timestamp}.xlsx`
      );
    }

    async getStreamMasterData() {
      try {
        debugger
        this.StreamSearch.InstituteID = this.RequestManual.InstituteID;
        this.StreamSearch.StreamType = this.RequestManual.EngNonEngID;
        this.loaderService.requestStarted();
        await this.commonFunctionService.StreamDDLInstituteIdWise(this.StreamSearch).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CourseMasterDDL = data.Data;
          console.log("StreamMasterList", this.CourseMasterDDL)
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


    async BranchWiseEmployee() {
      try {
        this.loaderService.requestStarted();

        this.StaffDDLList = [];

        const data: any = await this.commonFunctionService.DDL_EmployeeTransferSysterm(
          this.RequestManual.OfficeID,
          this.RequestManual.PostID,
          this.RequestManual.DistrictID,
          this.RequestManual.InstituteID
        );

        const response = JSON.parse(JSON.stringify(data));

        // Null/undefined handling
        const staffList = response?.Data ?? [];

        this.StaffDDLList = staffList.filter(
          (item: any) => item?.CourseID == this.RequestManual.BranchID
        );

      } catch (Ex) {
        console.log(Ex);
        this.StaffDDLList = [];
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    }



    async getTo_StreamMasterData() {
      try {
        debugger
        this.StreamSearch.InstituteID = this.RequestManual.To_ddlCollege;
        this.StreamSearch.StreamType = this.RequestManual.To_EngNonEngID;
        this.loaderService.requestStarted();
        await this.commonFunctionService.StreamDDLInstituteIdWise(this.StreamSearch).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.To_CourseMasterDDL = data.Data;
          console.log("StreamMasterList", this.To_CourseMasterDDL)
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

    async To_PostChange() {
      debugger;
      await this.GetTransferSystem_PostWiseBranchCheck();

      if (this.RequestManual.To_ddlCollege != 0 && this.RequestManual.To_PostID !=0) {

        if (this.GetDesignationID.includes(this.RequestManual.To_PostID)) {
          this.To_IsBranchshow = 1;

          this.AddTransferRequest.get('To_EngNonEngID')?.setValidators([DropdownValidators]);
          this.AddTransferRequest.get('To_BranchID')?.setValidators([DropdownValidators]);

        } else {
          this.RequestManual.To_BranchID = 0;
          this.RequestManual.To_EngNonEngID = 0;
          this.AddTransferRequest.get('To_EngNonEngID')?.clearValidators();
          this.AddTransferRequest.get('To_BranchID')?.clearValidators();
          this.To_IsBranchshow = 0;
        }
        this.AddTransferRequest.get('To_EngNonEngID')?.updateValueAndValidity();
        this.AddTransferRequest.get('To_BranchID')?.updateValueAndValidity();

      } 
    }


    async EngNonEngWiseBranch() {
      debugger
      await this.getStreamMasterData();
    }


    async To_EngNonEngWiseBranch() {
      debugger
      await this.getTo_StreamMasterData();
    }

    async GetTransferSystem_PostWiseBranchCheck() {
      try {
        debugger
        this.GetDesignationID = [];
        this.loaderService.requestStarted();
        await this.staffServiceDetailsService.GetTransferSystem_PostWiseBranchCheck(this.searchRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TransferSystem_PostWiseBranchID = data.Data;
          this.GetDesignationID = data.Data.map((x: any) => x.DesignationID);
          console.log("TransferSystem_PostWiseBranchID", this.CourseMasterDDL)
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
}
