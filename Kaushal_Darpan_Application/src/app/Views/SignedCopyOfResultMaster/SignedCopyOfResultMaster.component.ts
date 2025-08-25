import { Component, OnInit } from '@angular/core';
import { CompanyMasterDataModels, SignedCopyOfResultModel, SignedCopyOfResultSearchModel } from '../../Models/CompanyMasterDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { CampusPostService } from '../../Services/CampusPost/campus-post.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { IDistrictMaster_StateIDWiseDataModel, IStateMasterDataModel } from '../../Models/CommonMasterDataModel';
import { EnumStatus, EnumRole } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { SweetAlert2 } from '../../Common/SweetAlert2';

@Component({
  selector: 'app-SignedCopyOfResultMaster',
  templateUrl: './SignedCopyOfResultMaster.component.html',
  styleUrls: ['./SignedCopyOfResultMaster.component.css'],
    standalone: false
})
export class SignedCopyOfResultMasterComponent implements OnInit {
  [x: string]: any;

  public ID: number = 0;
  public request = new SignedCopyOfResultModel()
  public requestSearch = new SignedCopyOfResultSearchModel()

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public SignedCopyFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public GetAllSignedCopyList: any = [];
  public signList: any = [];
  public TypeList: any = [];
  public routeId: number=0
  public _EnumRole = EnumRole
  public GetRoleID: number = 0
  public CompanyTypeList: any = []

  constructor(private commonMasterService: CommonFunctionService, private CampusPostService: CampusPostService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, public appsettingConfig: AppsettingService, private router: Router, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    

    // form group
    this.SignedCopyFormGroup = this.formBuilder.group(
      {
        Remark: [''],
        FileName: ['', Validators.required],
        FileTypeID: ['', [DropdownValidators]]
      });

      
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;
    /*this.request.CampusPostID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());*/
    //this.request.CampusPostID = Number(this.route.snapshot.paramMap.get('id')?.toString());

    this.routeId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.request.CampusPostID = Number(this.routeId);

    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key
    await this.GetAllData();
   
    this.GetTypeList();
     
  
  }

  get _SignedCopyFormGroup() { return this.SignedCopyFormGroup.controls; }


  async loadDropdownData(MasterCode: string) {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'CompanyType':
          this.CompanyTypeList = data['Data'];
          console.log(this.CompanyTypeList)
          break;
        default:
          break;
      }
    });
  }

  async GetAllData() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.requestSearch.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestSearch.RoleID = this.sSOLoginDataModel.RoleID;
      this.requestSearch.CreatedBy = this.sSOLoginDataModel.UserID;
      this.requestSearch.CampusPostID = this.routeId;
     
      await this.CampusPostService.GetAllSignedCopyData(this.requestSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.GetAllSignedCopyList = data['Data'];
          debugger;
          console.log('data check',this.GetAllSignedCopyList);
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

  

  async Back() {
    if (this.key == 1) {
      this.routers.navigate(['/CompanyMaster'])
    }
    else if (this.key == 2) {
      this.routers.navigate(['/CompanyValidation'])
    }
  }
  GotoCommonSubject(): void {
    this.routers.navigate(['/commonsubjects']);
  }

  async ddlState_Change() {
    try {
      this.loaderService.requestStarted();
      //await this.commonMasterService.DistrictMaster_StateIDWise(this.request.StateID)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.DistrictMasterList = data['Data'];
      //  }, error => console.error(error));
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


  // get detail by id
  async GetById(ID: number = 0) {
    debugger
    try {
      this.ID = ID;
      this.loaderService.requestStarted();

      await this.CampusPostService.GetSignedCopyById(this.ID)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.request = data['Data'];
          this.request.Remark = data['Data']['Remark'];
          this.request.SignedCopyOfResultID = data['Data']['SignedCopyOfResultID'];
          console.log(this.request, "request");

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

  GetTypeList() {
    this.TypeList = [
      { ID: 1, Name: 'Consent List' },
      { ID: 2, Name: 'Short List' },
      { ID: 3, Name: 'Final Place List' },
      { ID: 4, Name: 'Other List' }

    ];
  }

  async AddMore() {

    
    this.isSubmitted = true;
   

  
    //const isDuplicate = this.signList.some((element: any) =>
    //  this.request.ListTypeID === element.ListTypeID
    //);

    //if (isDuplicate) {
    //  this.toastr.error('SSO ID Already Exists.');
    //  return;
    //} else {
    // Adding office and post names from the respective lists

    if (this.request.FileTypeID == 0)
    {
      this.toastr.warning('Please Select List Type');
      return;
    }


    this.request.ListTypeName = this.TypeList.find((x: any) => x.ID == this.request.FileTypeID)?.Name;
  
     
      this.signList.push({ ...this.request });

    
      this.formData = new SignedCopyOfResultSearchModel();

      this.isSubmitted = false;
      this.isSSOVisible = false;
   

    /*}*/
  }


  async DeleteRow(item: SignedCopyOfResultSearchModel) {

    const index: number = this.signList.indexOf(item);
    if (index != -1) {
      this.signList.splice(index, 1)
    }
  }








  // get detail by id
  async SaveData() {
    
    try {
      debugger;
      //if (this.signList.length == 0) {
      //  this.toastr.warning("Please Add At Least One Signed Copy");
      //  return;
      //}

      this.isSubmitted = true;
      if (this.SignedCopyFormGroup.invalid) {
        console.log("errro")
        return
      }
      this.isLoading = true;

      this.loaderService.requestStarted();
      this.request.SignedCopyOfResultID = this.editingRecord?.SignedCopyOfResultID || 0;

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
     


      
      await this.CampusPostService.SaveSignedCopyData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.GetAllData();
           /* this.routers.navigate(['/CompanyMaster']);*/
          } else if (this.State = EnumStatus.Warning) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage); 
          }
          else {
            this.toastr.error(this.ErrorMessage)
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

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {

      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png' || this.file.type === 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
        }
        else {// type validation
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.Dis_File = data['Data'][0]["Dis_FileName"];
                this.request.FileName = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
              this.SignedCopyFormGroup.patchValue({
                FileName: this.file.name
              });
              this.SignedCopyFormGroup.get('FileName')?.updateValueAndValidity();
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async DeleteImage(FileName: any, Type: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.commonMasterService.DeleteDocument(FileName).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == "Photo") {
            this.request.Dis_File = '';
            this.request.FileName = '';
          }
          //else if (Type == "Sign") {
          //  this.requestStudent.Dis_StudentSign = '';
          //  this.requestStudent.StudentSign = '';
          //}
          this.toastr.success(this.Message)
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
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


  async btnDelete_OnClick(ID: number) {
    
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.CampusPostService.DeleteSignedCopyDataByID(ID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetAllData();
                }
                else {
                  this.toastr.error(this.ErrorMessage)
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
      });
  }

  // reset
  ResetControls() {
    this.request = new SignedCopyOfResultModel();


    //this.multiSelect.toggleSelectAll();
  }


}
