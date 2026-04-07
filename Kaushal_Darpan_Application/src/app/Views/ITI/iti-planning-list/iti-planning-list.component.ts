  import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITI_PlanningCollegesModel, ITI_PlanningCollegesSearchModel, ItiVerificationModel } from '../../../Models/ItiPlanningDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ItiPlanningComponent } from '../iti-planning/iti-planning.component';
import { ItiCollegesSearchModel } from '../../../Models/CommonMasterDataModel';
import { ActivatedRoute } from '@angular/router';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { NgSelectModule } from '@ng-select/ng-select';
import * as XLSX from 'xlsx';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-iti-planning-list',
  standalone: false,
  templateUrl: './iti-planning-list.component.html',
  styleUrl: './iti-planning-list.component.css'
})
export class ItiPlanningListComponent {

  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CampusValidationListData: any = [];
  public InstituteMasterList: any = [];
  public StudentHistoryModelList: any = [];
  public _enumrole = EnumRole
  public CompanyMasterList: any = [];
  public CollegeID: number = 0;
  public ITItypeID: number = 0;
  public InstituteID: number = 0;
  public Collegeid: number = 0;
  public ApprovedStatus: number = 0;
  public ManagmentTypeList: any = [];
  requestAction = new ItiVerificationModel();

  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;public request = new ITI_PlanningCollegesSearchModel()

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  formAction!: FormGroup;
  public isShowdrop: boolean = true

  public TodayDate = new Date()
  public SearchStudentDataFormGroup!: FormGroup;
  
  public AllCompanyMasterList: any[] = [];
  public FileName: string = ''
  public Disfilename:string=''

  public QueryStatus: number = 0;
  constructor(private commonMasterService: CommonFunctionService, private campusPostService: ITIsService, private loaderService: LoaderService,
    private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService, private appsettingConfig: AppsettingService,
    private activeroute: ActivatedRoute) {
  }

  async ngOnInit()
  {

    const param = this.activeroute.snapshot.queryParamMap.get('status');
    this.QueryStatus = param !== null && !isNaN(Number(param)) ? Number(param) : 0;


    this.formAction = this.formBuilder.group(
      {
        ddlAction: ['', [DropdownValidators]],
        txtActionRemarks: ['', Validators.required],
      })


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    const idParam = this.activeroute.snapshot.queryParamMap.get('id');
    this.InstituteID = Number(idParam);
    if (!idParam || isNaN(this.InstituteID)) {
      this.InstituteID = 0;
    }
    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || this.sSOLoginDataModel.RoleID == EnumRole.Principal_NCVT)
    {
      this.CollegeID = this.InstituteID
      //this.ITItypeID = this.ITItypeID
    }
    else
    {
      if (this.QueryStatus != 0)
      {
        this.ApprovedStatus = this.QueryStatus;
      }
      else
      {
        if (this.sSOLoginDataModel.RoleID == 97) {
          this.ApprovedStatus = 0;
        }
        else {
          this.ApprovedStatus = 2
        }
      }
    }
    await this.GetIti()
    await this.btn_SearchClick();
    await this.GetManagmentType();
  }

  get FormAction() { return this.formAction.controls; }



  async btn_SearchClick() {
    debugger;

    try {
   
      this.loaderService.requestStarted();
      await this.campusPostService.GetPlanningList(this.CollegeID, this.ITItypeID, this.ApprovedStatus, this.sSOLoginDataModel.DistrictID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusValidationListData = data['Data'];

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

  async ViewWorkflow(CollegeID:number=0) {
    try {
      this.loaderService.requestStarted();
      await this.campusPostService.ViewWorkflow(CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentHistoryModelList = data['Data'];

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






  async GetIti()
  {
    try
    {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('PrivateITICollege', this.ITItypeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AllCompanyMasterList = data['Data'];   // full list
          this.CompanyMasterList = this.AllCompanyMasterList; // default
          this.request.CollegeID = 0;
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


  //async btn_Clear() {
  //  this.requestAction.InstituteID = 0;
  //  this.requestAction.Status = 0;
  //  this.requestAction.Remarks = '';
  //  this.CollegeID = 0;
  //  this.ApprovedStatus = 2;
  //  await this.GetIti()

  //}


  async btn_Clear() {
    this.formAction.reset();
    this.isSubmitted = false;

    this.requestAction = {
      InstituteID: 0,
      Status: 0,
      Remarks: '',
      UserID: 0,
      DisFileName: '',
      FileName:''

    };

    this.CollegeID = 0;
    this.ApprovedStatus = 2;
    this.ITItypeID = 0; 
    this.CampusValidationListData = []; 

    await this.GetIti();

    await this.btn_SearchClick();
  }


  async UploadCotent(content: any, ID: number,UploadDocument:string='',Disuploaddocument:string='') {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
   
    this.CollegeID = ID
    this.FileName = UploadDocument,
      this.Disfilename = Disuploaddocument
    //this.requestAction.Action = "0";
    //this.requestAction.ActionRemarks = "";
  
  }


  async ViewHistory(content: any, ID: number) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //this.requestAction.Action = "0";
    //this.requestAction.ActionRemarks = "";
    await this.ViewWorkflow(ID)
  }
  async ViewandUpdate(content: any, PostID: number) {
    this.requestAction.Status = 0
    this.requestAction.Remarks = ''
    this.requestAction.InstituteID = PostID
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //this.modalReference.shown(CampusPostComponent, { initialState });
    //this.modalReference.show(CampusPostComponent, { initialState });
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
  CloseModalPopup() {
    this.modalService.dismissAll();
    this.CollegeID = 0
    this.FileName = ''
    this.Disfilename=''
  }
  async SaveData_ApprovedCampus() {
    
    this.isSubmitted = true;
    this.nonApproveValidator();
    if (this.formAction.invalid) {
      return
    }
    this.requestAction.UserID = this.sSOLoginDataModel.UserID;

    //Show Loading
    this.loaderService.requestStarted();
    console.log("this.requestAction", this.requestAction)
    try {
      await this.campusPostService.SaveItiworkflow(this.requestAction)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.CloseModalPopup();
            await this.btn_SearchClick();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  nonApproveValidator()
  {
    if (this.requestAction.Status != 4)//required when reject
    {
      this.formAction.controls['txtActionRemarks'].clearValidators();
    }
    else
    {
      this.formAction.controls['txtActionRemarks'].setValidators(Validators.required)
    }
    this.formAction.controls['txtActionRemarks'].updateValueAndValidity();

  }

  //async GetManagmentType() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetManagType().then((data: any) => {
  //      this.ManagmentTypeList = data.Data;
  //      console.log('Data====>', this.ManagmentTypeList)
  //    });
  //  } catch (error) {
  //    console.error(error);
  //  } finally {
  //    this.loaderService.requestEnded();
  //  }
  //}
  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      const data: any = await this.commonMasterService.GetManagType();
      this.ManagmentTypeList = data.Data.filter((item: any) =>
        item.InstitutionManagementType !== 'PPP (Public Private Partnership)'
      );
      console.log('Filtered Data ====>', this.ManagmentTypeList);
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  onCollegeChange(collegeId: number) {
    this.CollegeID = +collegeId;
    this.btn_SearchClick();
  }

  trackById(index: number, item: any): number {
    return item.ID;  
  }


  exportToExcel(): void {
    const wantedColumns = ['Sno', 'CollegeName', 'Email', 'InstituteCategoryName', 'InstituteManagement', 'PlotHouseBuildingNo',
      'StreetRoadLane', 'AreaLocalitySector', 'LandMark', 'DivisionName', 'SubDivision', 'DistrictName', 'TehsilName', 'Urban/Rural',
      'CityName', 'PanchayatSamitiName', 'GramPanchayatSamitiName', 'VillageName','StatusName'
    ];

    const exportData = this.CampusValidationListData.map((row: any, index: number) => {
      const filteredRow: any = {};
      wantedColumns.forEach(col => {
        filteredRow[col] = (col === 'SrNo') ? index + 1 : row[col];
      });
      return filteredRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // 🧠 Auto-width calculation
    const colWidths = wantedColumns.map(col => {
      const maxLength = Math.max(
        col.length,
        ...exportData.map((row:any) => (row[col] ? row[col].toString().length : 0))
      );
      return { wch: maxLength + 2 }; // Add padding
    });

    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CollegePlanningDetails.xlsx');
  }



  public file!: File;

  async onFilechange(event: any, Type: string) {
    try {

      this.file = event.target.files[0];
      if (this.file) {

        //if (!this.validateFileName(this.file.name))
        //{
        //  this.toastr.error('Invalid file name. Please remove special characters from file');
        //  return;
        //}
        // Type validation
        if (['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(this.file.type)) {
          // Size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else {
          this.toastr.error('Select Only jpeg/jpg/png file');
          return;
        }

        //if (this.file.name.split('.').length > 2)
        //{
        //  this.toastr.error('Invalid file name. Please remove extra . from file');
        //  return ;
        //}



        // Upload to server folder
        this.loaderService.requestStarted();
        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log("photo data", data);
            if (data.State === EnumStatus.Success) {





              switch (Type) {
                case "Photo":

                  this.FileName = data['Data'][0]["FileName"];
                  this.Disfilename = data['Data'][0]["Dis_FileName"];

                  break;
  




              

                default:
                  break;
              }
            }
            event.target.value = null;
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



  async Get_ITIsPlanningData_ByIDReport() {

    try {

      this.loaderService.requestStarted();

      await this.campusPostService.Get_ITIsPlanningData_ByIDReport(this.CollegeID)
        .then((data: any) => {

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          data = JSON.parse(JSON.stringify(data));
          debugger;

          if (data && data.Data) {

            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            // ✅ Date in ddmmyyyy format
            const today = new Date();
            const formattedDate =
              today.getDate().toString().padStart(2, '0') +
              (today.getMonth() + 1).toString().padStart(2, '0') +
              today.getFullYear();

            const link = document.createElement('a');
            link.href = blobUrl;

            // ✅ Final filename
            link.download = `ITIPlanningReport_${formattedDate}.pdf`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(blobUrl);

          } else {
            this.toastr.error(this.Message);
          }

        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage);
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async Uploaddocument() {

    this.isSubmitted = true;

   
    this.requestAction.UserID = this.sSOLoginDataModel.UserID;
    this.requestAction.FileName = this.FileName,
      this.requestAction.DisFileName = this.Disfilename
    this.requestAction.InstituteID = this.CollegeID

    if (this.requestAction.FileName == '') {
      this.toastr.warning("Please Upload Valid Document")
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    console.log("this.requestAction", this.requestAction)
    try {
      await this.campusPostService.SaveItiworkdocument(this.requestAction)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.CloseModalPopup();
            await this.btn_SearchClick();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
