import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CitizenSuggestionService } from '../../../Services/CitizenSuggestionService/citizen-suggestion.service';
import {
  CitizenSuggestionModel,
  CitizenSuggestionQueryModel,
  SearchRequest,
} from '../../../Models/CitizenSuggestionDataModel';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-citizenquery-details',
  templateUrl: './citizenquery-details.component.html',
  styleUrls: ['./citizenquery-details.component.css'],
  standalone: false,
})
export class CitizenqueryDetailsComponent implements OnInit {
  public ID: number = 0;
  public CommnID: any;
  public QueryMasterList: CitizenSuggestionModel[] = [];
  QueryForMasterList: any[] = [];
  public Request = new CitizenSuggestionModel();
  public searchRequest = new SearchRequest();
  public queryRequest = new CitizenSuggestionQueryModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;

  public searchBySubjectName: string = '';
  public searchByPolytechnicName: string = '';
  public tbl_txtSearch: string = '';
  public Table_SearchText: string = '';
  searchText: string = '';
  selectedOption: any = 0;
  PolytechMasterList: any[] = [];
  SubMasterList: any[] = [];
  public QueryReqFormGroup!: FormGroup;
  public ResponseForCollege: boolean = false;
  public filteredDistricts: any[] = [];
  public filteredTehsils: any[] = [];
  public TehsilList: any[] = [];
  public InstituteMasterList: any = [];
  DivisionMasterList: any[] = [];
  DistrictMasterList: any[] = [];
  TehsilMasterList: any[] = [];
  CitizenQueryStatusList: any[] = [];

  public ProfileLists: any = {};

  stars = [
    { id: 1, icon: 'star', class: 'star-gray star-hover star' },
    { id: 2, icon: 'star', class: 'star-gray star-hover star' },
    { id: 3, icon: 'star', class: 'star-gray star-hover star' },
    { id: 4, icon: 'star', class: 'star-gray star-hover star' },
    { id: 5, icon: 'star', class: 'star-gray star-hover star' },
  ];

  modalReference: NgbModalRef | undefined;
  constructor(
    private commonMasterService: CommonFunctionService,
    private CitizenSuggestionService: CitizenSuggestionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal
  ) {}

  async ngOnInit() {
    this.CommnID = this.activatedRoute.snapshot.paramMap.get('id');
    // form group
    this.QueryReqFormGroup = this.formBuilder.group({
      Replay: ['', Validators.required],
      IsResolved: [''],
    });

    this.sSOLoginDataModel = await JSON.parse(
      String(localStorage.getItem('SSOLoginUser'))
    );
    this.ID = Number(
      this.activatedRoute.snapshot.queryParamMap.get('PK_ID')?.toString()
    );
    this.Request.ModifyBy = this.sSOLoginDataModel.UserID;
    await this.GetAllData();
    await this.GetMasterDDL();
    await this.loadDropdownData('Institute');
    await this.GetMasterSubDDL();
    await this.CitizenQueryStatusDDL();
    await this.selectedStar();
    await  this.commonIDFix();
  }

  async GetMasterSubDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService
        .GetSubjectForCitizenSugg(this.searchRequest.CommnID)
        .then(
          (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.SubMasterList = data['Data'];
            console.log(this.SubMasterList, "asdfasd")
          },
          (error: any) => console.error(error)
        );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async commonIDFix() {
    debugger;
    if (this.sSOLoginDataModel.DepartmentName === "ITI" && this.sSOLoginDataModel.InstituteID === 0) {
      const excludedIDs = [89, 87, 274]; 
      this.QueryForMasterList = this.QueryForMasterList.filter(item => !excludedIDs.includes(item.ID));
      this.CommnID = 88;
      this.GetMasterSubDDL();
    }
    else if (this.sSOLoginDataModel.DepartmentName === "BTER" && this.sSOLoginDataModel.InstituteID === 0) {
      const excludedIDs = [88, 274, 87];
      this.QueryForMasterList = this.QueryForMasterList.filter(item => !excludedIDs.includes(item.ID));
      this.CommnID = 89;
      this.GetMasterSubDDL();
      console.log(this.QueryForMasterList, "gfgf")
    }
    else if (this.sSOLoginDataModel.DepartmentName === "ITI" && this.sSOLoginDataModel.InstituteID !== 0) {
      const excludedIDs = [87, 88, 89];
      this.QueryForMasterList = this.QueryForMasterList.filter(item => !excludedIDs.includes(item.ID));
      this.CommnID = 274;
      this.GetMasterSubDDL();
    }
    else if (this.sSOLoginDataModel.DepartmentName === "BTER" && this.sSOLoginDataModel.InstituteID !== 0) {
      const excludedIDs = [88,89, 274];
      this.QueryForMasterList = this.QueryForMasterList.filter(item => !excludedIDs.includes(item.ID));
      this.CommnID = 87;
      this.GetMasterSubDDL();
    }
  }

  //async OnchangeApplyFor() {
  //  if (this.searchRequest.CommnID == 87) {
  //    this.ResponseForCollege = true;
  //    //this.GetAllData();
  //  } else {
  //    this.ResponseForCollege = false;
  //    //this.GetAllData();
  //  }
  //}

  getStarIcon(starId: number, userRating: number): string {
    return starId <= userRating ? 'star' : 'star_border';
  }
  

  selectedStar(): void {
    this.QueryMasterList.forEach(item => {
      const userRating = item.UserRating;
      this.stars.forEach((star, index) => {
        
        if (index < userRating) {
          star.class = 'star-gold star'; 
        } else {
          star.class = 'star-gray star';
        }
      });
    });
  }

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.CitizenSuggestionService.GetByID(
        id,
        this.sSOLoginDataModel.DepartmentID
      ).then(
        async (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.queryRequest = data['Data'];
          this.queryRequest.ReplayAttachment = data.Data.ReplayAttachment;

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = 'Update';

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = 'Cancel';
        },
        (error) => console.error(error)
      );
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ReplayQueryUpdate(content: any, Pk_ID: number) {
    this.queryRequest.Pk_ID = Pk_ID;

    await this.GetByID(Pk_ID);
    this.modalReference = this.modalService.open(content, {
      backdrop: 'static',
      size: 'md',
      keyboard: true,
      centered: true,
    });
  }

  CloseModalPopup() {
    this.isSubmitted = false;
    this.queryRequest = new CitizenSuggestionQueryModel();
    this.QueryReqFormGroup.reset();

    this.modalService.dismissAll();
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        //if (
        //  this.file.type == 'image/jpeg' ||
        //  this.file.type == 'image/jpg' ||
        //  this.file.type == 'image/png'
        //) {
        //  //size validation
        //  if (this.file.size > 2000000) {
        //    this.toastr.error('Select less then 2MB File');
        //    return;
        //  }
        //  //if (this.file.size < 100000) {
        //  //  this.toastr.error('Select more then 100kb File')
        //  //  return
        //  //}
        //} else {
        //  // type validation
        //  this.toastr.error('Select Only jpeg/jpg/png file');
        //  return;
        //}
        if (this.file.size > 2000000) {
          this.toastr.error('Select less then 2MB File');
          return;
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService
          .UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == 'Photo') {
                //this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
                this.queryRequest.ReplayAttachment =
                  data['Data'][0]['FileName'];
              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage);
            } else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async DeleteImage(FileName: any, Type: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.commonMasterService
        .DeleteDocument(FileName)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == 0) {
            if (Type == 'Photo') {
              //this.request.Dis_CompanyName = '';
              this.queryRequest.ReplayAttachment = '';
            }
            //else if (Type == "Sign") {
            //  this.requestStudent.Dis_StudentSign = '';
            //  this.requestStudent.StudentSign = '';
            //}
            this.toastr.success(this.Message);
          }
          if (this.State == 1) {
            this.toastr.error(this.ErrorMessage);
          } else if (this.State == 2) {
            this.toastr.warning(this.ErrorMessage);
          }
        });
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async SaveReplayData() {
    //this.AppointExaminer.DepartmentID = this.sSOLoginDataModel.DepartmentID;

    this.queryRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    try {
      this.isSubmitted = true;
      if (this.QueryReqFormGroup.invalid) {
        console.log('Form is invalid');
        return;
      }

      this.loaderService.requestStarted();
      await this.CitizenSuggestionService.SaveReplayData(
        this.queryRequest
      ).then((data: any) => {
        /*data = JSON.parse(JSON.stringify(data));*/
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.CloseModalPopup();
          this.GetAllData();
          this.queryRequest = new CitizenSuggestionQueryModel();
        } else {
          this.toastr.error(this.ErrorMessage);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //async GetMasterSubDDL() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetCommonMasterDDLByType('SubjectFor')
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.SubMasterList = data['Data'];
  //        console.log("QueryFor", this.SubMasterList);
  //      }, (error: any) => console.error(error)
  //      );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService
      .GetCommonMasterData(MasterCode)
      .then((data: any) => {
        switch (MasterCode) {
          case 'Institute':
            this.PolytechMasterList = data['Data'];
            break;
          default:
            break;
        }
      });
  }

  ResetControl() {
    this.searchRequest.InstituteID = 0;
    this.searchRequest.SubjectId = 0;
    this.searchRequest.CommnID = 0;
    this.searchRequest = new SearchRequest();
    this.GetAllData();
    this.ResponseForCollege = false;
  }

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('QueryFor').then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.QueryForMasterList = data['Data'];
          console.log('QueryFor', this.QueryForMasterList);
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async CitizenQueryStatusDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService
        .GetCommonMasterDDLByType('CitizenQueryStatus')
        .then(
          (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.CitizenQueryStatusList = data['Data'];
          },
          (error: any) => console.error(error)
        );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ResetControls() {
    this.queryRequest = new CitizenSuggestionQueryModel();
  }

  async GetAllData() {
    debugger;
    try {
     
      this.searchRequest.InstituteID;
      this.searchRequest.SubjectId;
      this.searchRequest.CommnID;

      this.Request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      if (this.sSOLoginDataModel.IsCitizenQueryUser) {
        this.searchRequest.SubjectId = this.sSOLoginDataModel.QueryType;
      }

      if (
        this.sSOLoginDataModel.RoleID == EnumRole.Admin ||
        this.sSOLoginDataModel.RoleID == EnumRole.AdminNon
      )
      {
        this.searchRequest.CommnID = 89;
      }
      else if (
        this.sSOLoginDataModel.RoleID == EnumRole.DTE ||
        this.sSOLoginDataModel.RoleID == EnumRole.DTENON
      )
      {
        this.searchRequest.CommnID = 88;
      }
      else if (
        this.sSOLoginDataModel.RoleID == EnumRole.DTETraing 
      ) {
        this.searchRequest.CommnID = 293;
      }
      else if (
        this.sSOLoginDataModel.RoleID == EnumRole.Principal ||
        this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon
      ) {
        this.searchRequest.CommnID = 87;
       // this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      }

      else if (
        this.sSOLoginDataModel.RoleID == 22 // ITI SCVT
      ) {
        this.searchRequest.CommnID = 245;
      }
      else if (
        this.sSOLoginDataModel.RoleID == 42 // ITI NCVT
      ) {
        this.searchRequest.CommnID = 246;
      }



      else {
        this.searchRequest.CommnID = 0;
      }
      //this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.loaderService.requestStarted();
      await this.CitizenSuggestionService.GetAllData(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.QueryMasterList = data.Data;
          console.log('QueryMasterList', this.QueryMasterList);
        
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'ActiveStatus',
      'Pk_ID',
      'PolytechnicID',
      'SubjectId',
      'CommnID',
    ];
    const filteredData = this.QueryMasterList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach((key) => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'UserQueryData.xlsx');
  }

  get _QueryReqFormGroup() {
    return this.QueryReqFormGroup.controls;
  }
}
