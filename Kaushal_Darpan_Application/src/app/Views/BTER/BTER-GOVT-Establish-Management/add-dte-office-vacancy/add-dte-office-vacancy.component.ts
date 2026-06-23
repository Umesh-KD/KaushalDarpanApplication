import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfficeVacancyModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { BTEREstablishManagementService } from '../../../../Services/BTER/BTER-EstablishManagement/bter-establish-management.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { BudgetType, EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
  selector: 'app-add-dte-office-vacancy',
  standalone: false,
  templateUrl: './add-dte-office-vacancy.component.html',
  styleUrl: './add-dte-office-vacancy.component.css'
})
export class AddDTEOfficeVacancyComponent {
  public formData = new OfficeVacancyModel();
  public sSOLoginDataModel = new SSOLoginDataModel();

  public AddOfficeVacancyForm!: FormGroup;

  public OfficeList: any[] = [];
  public PostList: any[] = [];
  public InstituteMasterDDLList: any = [];
  public StaffTypeList: any = [];
  public BugetHeadList: any = [];
  OfficeVacancyList: OfficeVacancyModel[] = [];
  OfficeVacancy: OfficeVacancyModel[] = [];
  public StreamMasterDDLList: any[] = [];

  public file!: File;
  public Uploadfile: string = '';
  public isSubmitted: boolean = false;
  public isFinalSave:boolean=true;
  public isShow:boolean=true;
  public VacancyID: number = 0;
  public today: string = '';
  _BudgetType = BudgetType;

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
    this.AddOfficeVacancyForm = this.formBuilder.group({
      OfficeID: [0, [DropdownValidators]],
      InstituteID: [0,[]],
      StaffTypeID: [0, [DropdownValidators]],
      DesignationID: [0, [DropdownValidators]],
      TotalSeatID: ['', [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern("^[0-9]*$")]],
      Comments: ['',Validators.required],
      BugetHeadID: [0, [DropdownValidators]],
      orderDoc: [''],
      OrderNumber: ['',Validators.required],
      OrderDate: ['',Validators.required],
      BugetHeadTypeID: [0, [DropdownValidators]],
      BranchID: [0, [DropdownValidators]]
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.VacancyID = Number(this.activatedRoute.snapshot.queryParamMap.get('id'));
    await this.setToday();
    await this.GetStaffTypeData();
    await this.GetOfficeList();
    await this.GetBTER_BGT_BudgetType();
    await this.GetInstitute();

    if(this.VacancyID > 0) {
      await this.ViewByIDOfficeVacancy(this.VacancyID);
    }
  }

  get _AddOfficeVacancyForm() {
    return this.AddOfficeVacancyForm.controls;
  }

  async setToday() {
    const date = new Date();
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    this.today = `${year}-${month}-${day}`;
  }

  async fillupDesignation() {
    await  this.GetPostList();
    if(this.formData.StaffTypeID==30){
      await this.getStreamMasterList();
    } else {
      this.StreamMasterDDLList = [];
    }    
  }

  async showAddButton() {
    if(this.VacancyID>0 && this.OfficeVacancyList?.length > 0){
      this.isShow = false;
    }
  }
  
  async GetPostList() {
    var id = 0;
    // || this.formData.OfficeID==17
    if (this.formData.StaffTypeID == 31 && (this.formData.OfficeID==18)) {
      id = 1;
    } else if(this.formData.StaffTypeID == 31 && this.formData.OfficeID==17) {
      id=2;
    }
    try {
      this.loaderService.requestStarted();
      const data: any = await this.commonMasterService.GetDesignationAndPostMaster(id);
      this.PostList = data['Data'];
      this.PostList = this.PostList.filter((item: any) => item.TypeID == this.formData.StaffTypeID);
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

  async GetStaffTypeData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
        console.log("StaffTypeList", this.StaffTypeList);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetInstitute() {
    await this.commonMasterService
      .InstituteMaster(
        this.sSOLoginDataModel.DepartmentID,
        0,
        this.sSOLoginDataModel.EndTermID
      )
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        //  Filter only InstitutionManagementTypeID = 1
        this.InstituteMasterDDLList = data.Data.filter(
          (x: any) => x.InstitutionManagementTypeID === 1
        );

        console.log("Filtered Institute Master List ==>", this.InstituteMasterDDLList);
      });
  }

  async GetOfficeList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, 1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          console.log(this.OfficeList, "OfficeList");
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

  async GetBTER_BGT_BudgetType() {
    try {
        await this.commonMasterService.BTER_BGT_BudgetType(this.sSOLoginDataModel.DepartmentID, 1,this.formData.BugetHeadTypeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BugetHeadList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async onFilechange(event: any, name: string) {
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
          // this.request.TrainingDoc = '';
          event.target.value = null;
          return;
        }

        //upload model
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = this.file.type ?? "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "BTER_Establishment/VacancyOrderDocument";

        //Upload to server folder
        await this.commonMasterService.UploadDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              this.formData.orderDoc = data['Data'][0]["FileName"];
              this.formData.Dis_orderDoc = data['Data'][0]["Dis_FileName"];
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

  async refreshValidators() {
    if(this.formData.StaffTypeID!=30) {
      this.AddOfficeVacancyForm.get('BranchID')?.clearValidators();
      this.AddOfficeVacancyForm.get('BranchID')?.updateValueAndValidity();
    }
  }

  tempIndex: number = 1;
  async addOfficeVacancy() {
    //debugger;
    await this.refreshValidators();
    const formValues = this.AddOfficeVacancyForm.value;
    this.isSubmitted=true;
    if(this.AddOfficeVacancyForm.invalid){
      this.toastr.warning("Please fill all required fields before adding.");
      return;
      // Object.keys(this.AddOfficeVacancyForm.controls).forEach(key => {
      //   const control = this.AddOfficeVacancyForm.get(key);

      //   if (control && control.invalid) {
      //     this.toastr.error(`Control ${key} is invalid`);
      //     Object.keys(control.errors!).forEach(errorKey => {
      //       this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
      //     });
      //   }
      // });
    }

    if(this.formData.orderDoc==''){
      this.toastr.error('Please Upload Order Document');
      return;
    }

    const getoffice = this.OfficeList.find((item:any) => item.ID == formValues.OfficeID);
    const getdesignation = this.PostList.find((item1: any) => item1.ID == formValues.DesignationID)||[];
    const getstaffType = this.StaffTypeList.find((item3: any) => item3.ID == formValues.StaffTypeID);
    const BudgetHeadName = this.BugetHeadList.find((x: any) => x.ID == formValues.BugetHeadID)?.Name;
    const BudgetTypeName = this._BudgetType.find((x: any) => x.id == formValues.BugetHeadTypeID)?.name;
    const InstituteName = this.InstituteMasterDDLList.find((x: any) => x.InstituteID == formValues.InstituteID)?.InstituteName;
    const BranchID = this.StreamMasterDDLList.find((x: any) => x.StreamID == formValues.BranchID)?.StreamName;

    const vacancyData: OfficeVacancyModel = {
      Comments: formValues.Comments,
      DesignationID: formValues.DesignationID,
      BugetHeadID:formValues.BugetHeadID || 0,
      InstituteID: formValues.InstituteID || 0,  // fallback if null
      OfficeID: formValues.OfficeID,
      StaffTypeID: formValues.StaffTypeID,
      TotalSeatID: formValues.TotalSeatID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      CreatedBy: this.sSOLoginDataModel.UserID,
      DepartmentID: 1,
      CourseTypeID: 1,
      ActiveStatus: true,
      DeleteStatus: false,
      RTS: '',
      ModifyBy: 0,
      ModifyDate: '',
      IPAddress: '',
      ID: this.formData.ID || 0,
      RemainingSeatID: 0,
      OfficeName: getoffice.Name,
      DesignationName: getdesignation.Name,
      InstituteName: InstituteName,
      StaffTypeName: getstaffType.Name,
      PostedSeat: 0,
      PlanningID:0,
      Index: this.tempIndex++,
      TradeID: 0,
      TradeName:'',
      Dis_orderDoc:this.formData.Dis_orderDoc,
      orderDoc: this.formData.orderDoc,
      PostSanctionDate: '',
      PostSanctionedID:0,
      BudgetHeadName: BudgetHeadName || '',
      BudgetTypeName: BudgetTypeName || '',
      OrderNumber: formValues.OrderNumber,
      OrderDate: formValues.OrderDate,
      BranchID: formValues.BranchID,
      BranchName: BranchID,
      BugetHeadTypeID: formValues.BugetHeadTypeID
    };

    console.log('Vacancy being added:', vacancyData);

    this.OfficeVacancyList.push(vacancyData); // Add to array
    this.isSubmitted = false;
    this.OfficeVacancy = this.OfficeVacancyList;
    this.isFinalSave=false;
    this.toastr.success("Vacancy added successfully.");

    this.AddOfficeVacancyForm.reset(); // Reset form after adding
    this.formData = new OfficeVacancyModel();
    await this.showAddButton();
  }

  async SaveData() {
    this.loaderService.requestStarted();

    if (this.OfficeVacancy.length === 0) {
      this.toastr.warning("Please add at least one valid vacancy before saving.");
      return;
    }
   
    try {
      this.loaderService.requestStarted();

      await this.BTER_EstablishManagementService.Save_M_OfficeVacancy_IU(this.OfficeVacancy).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          
          this.OfficeVacancy = [];
          // this.OfficeVacancyDataList();
          this.toastr.success('Data saved successfully!');
          this.isFinalSave=true;
          this.routers.navigate(['/dte-office-vacancy-list'])
           // Clear array after successful save
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      });

    } catch (error) {
      console.error("Error saving data:", error);
      this.toastr.error("An unexpected error occurred while saving data.");
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  removeVacancy(row: any) {
    this.OfficeVacancyList = this.OfficeVacancyList.filter(
      x => x !== row
    );
  }

  async getStreamMasterList() {
    try {
      var Eng_NonEng: number = 0
      if(this.formData.DesignationID == 75) {
        Eng_NonEng = 1
      } else if (this.formData.DesignationID == 77) {
        Eng_NonEng = 2
      } else {
        Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      }
      this.loaderService.requestStarted();

      
      
      //debugger
      const branchControl = this.AddOfficeVacancyForm.get('BranchID');
      const designationId = Number(this.formData.DesignationID);

      const noBranchRequiredIds = [67, 68, 69, 70, 74, 78, 79, 80, 81];

      if (noBranchRequiredIds.includes(designationId)) {
        this.AddOfficeVacancyForm.get('BranchID')?.clearValidators();
      } else {
        this.AddOfficeVacancyForm.get('BranchID')?.setValidators([DropdownValidators]);
      }

      this.AddOfficeVacancyForm.get('BranchID')?.updateValueAndValidity();
     

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ViewByIDOfficeVacancy(ID: number) {
    try {
      debugger;
      this.loaderService.requestStarted();
      await this.BTER_EstablishManagementService.ViewByIDOfficeVacancy(ID).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.formData = data.Data;
        await this.fillupDesignation();

      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
