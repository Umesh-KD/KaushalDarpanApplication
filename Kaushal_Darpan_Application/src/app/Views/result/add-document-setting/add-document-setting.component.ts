import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { RoomsMasterDataModel } from '../../../Models/RoomsMasterDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { RoomsMasterService } from '../../../Services/RoomsMaster/rooms-master.service';
import { DocumentSettingDataModel } from '../../../Models/DocumentSettingDataModel';
import { DocumentSettingService } from '../../../Services/DocumentSetting/document-setting.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
    selector: 'app-add-document-setting',
    templateUrl: './add-document-setting.component.html',
    styleUrls: ['./add-document-setting.component.css'],
    standalone: false
})
export class AddDocumentSettingComponent {
  ParentMenuDDLList: any;
  isParentMenuVisible: boolean = false;
  ResultTypeList: any;
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_SearchText: string = "";
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TodayDate = new Date()
  closeResult: string | undefined;
  isAddMenuModalVisible: boolean = false;
  isDropdownVisible: boolean = false; // Checkbox state
  ParentId: number | null = null;
  public request = new DocumentSettingDataModel;
  public InstituteList: any = []
  public DocumentSettingMasterId: number | null = null;
  /*public AddDocumentFormGroup!: FormGroup;*/
  public sSOLoginDataModel = new SSOLoginDataModel();
  public uploadedFile: File | null = null;
  public _GlobalConstants: any = GlobalConstants;
  public keyError: string = '';
  constructor(private fb: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private documentSettingService: DocumentSettingService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2) {

  }

  /*get _AddDocumentFormGroup() { return this.AddDocumentFormGroup.controls; }*/

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.AddDocumentFormGroup = this.fb.group({
    //  Name: ['', Validators.required],
    //  ContentType: ['', Validators.required],
    //  Key: ['', [Validators.required, Validators.pattern(/^[a-zA-Z].*/)]], 
    //  Value: [''],
    //  StartDate: ['', Validators.required],
    //  EndDate: ['', Validators.required],
    //  IsNow: ['', Validators.required],
    //});  
    this.DocumentSettingMasterId = Number(this.activatedRoute.snapshot.queryParamMap.get('DocumentSettingMasterId')?.toString());
    if (this.DocumentSettingMasterId > 0) {
      await this.Get_DocumentSettingData_ByID(this.DocumentSettingMasterId);
    }
  }
  
  async SaveData() {

    /*this.isSubmitted = true;*/
    //if (this.AddDocumentFormGroup.invalid) {
    //  return console.log("error", this.AddDocumentFormGroup);
    //}
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {     
      /*this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;*/
      await this.documentSettingService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.routers.navigate(['/DocumentSetting']);
            this.ResetControls();
          } else {
            this.toastr.error(this.ErrorMessage);

          }
        });
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  ResetControls() {
    this.isSubmitted = false;
    this.request = new DocumentSettingDataModel();    
  }

  async Get_DocumentSettingData_ByID(DocumentSettingMasterId: number) {

    try {

      this.loaderService.requestStarted();

      await this.documentSettingService.Get_DocumentSettingData_ByID(DocumentSettingMasterId)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.DocumentSettingMasterId = data['Data']["DocumentSettingMasterId"];
          this.request.Name = data['Data']["Name"];
          this.request.ContentType = data['Data']["ContentType"];
          this.request.Key = data['Data']["Key"];
          this.request.Value = undefined;
          const StartDate = new Date(data['Data']['StartDate']);
          const startYear = StartDate.getFullYear();
          const startMonth = String(StartDate.getMonth() + 1).padStart(2, '0');
          const startDay = String(StartDate.getDate()).padStart(2, '0');
          this.request.StartDate = `${startYear}-${startMonth}-${startDay}`;

          // Formatting EndDate
          const EndDate = new Date(data['Data']['EndDate']);
          const endYear = EndDate.getFullYear();
          const endMonth = String(EndDate.getMonth() + 1).padStart(2, '0');
          const endDay = String(EndDate.getDate()).padStart(2, '0');
          this.request.EndDate = `${endYear}-${endMonth}-${endDay}`;

          this.request.StartDate = data['Data']['StartDate']?.substring(0,10);
          this.request.EndDate = data['Data']['EndDate']?.substring(0, 10);
          this.request.IsNow = data['Data']['IsNow']

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const AddDocIn = document.getElementById('AddDocIn');
          if (AddDocIn) AddDocIn.innerHTML = "Update Document Setting";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        // Type validation
        if (['image/jpeg', 'image/jpg', 'image/png'].includes(this.file.type)) {
          // Size validation
          if (this.file.size > 400000) {
            this.toastr.error('Select less than 400KB File');
            return;
          }
        } else {
          this.toastr.error('Select Only jpeg/jpg/png file');
          return;
        }

        // Upload to server folder
        this.loaderService.requestStarted();
        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              switch (Type) {
                case "Photo":
                  this.request.Dis_valuePhoto = data['Data'][0]["Dis_FileName"];
                  this.request.Value = data['Data'][0]["FileName"];
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

  async DeleteImage(FileName: any, Type: string) {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.DeleteDocument(FileName).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State != EnumStatus.Error) {
          switch (Type) {
            case "Photo":
              this.request.Dis_valuePhoto = '';
              this.request.Value = '';
              this.request.ValuePhoto = '';
              break;           
            default:
              break;
          }
          this.toastr.success(data.Message);
        }
        if (data.State === EnumStatus.Error) {
          this.toastr.error(data.ErrorMessage);
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.ErrorMessage);
        }
      });
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

 async validateKey() {
    const keyPattern = /^[a-zA-Z].*/; // Key must start with a letter
    if (!keyPattern.test(this.request.Key)) {
      this.keyError = 'Key must start with a character.';
    } else {
      this.keyError = '';
    }
  }
}
