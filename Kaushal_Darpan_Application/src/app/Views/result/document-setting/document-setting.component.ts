import { Component, OnInit } from '@angular/core';
import { DocumentSettingDataModel } from '../../../Models/DocumentSettingDataModel';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DocumentSettingService } from '../../../Services/DocumentSetting/document-setting.service';
import { LoaderService } from '../../../Services/Loader/loader.service';

@Component({
    selector: 'app-document-setting',
    templateUrl: './document-setting.component.html',
    styleUrls: ['./document-setting.component.css'],
    standalone: false
})
export class DocumentSettingComponent  implements OnInit {
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
  public DocumentSettingList: any = []  
  public AddDocumentFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private fb: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private documentSettingService: DocumentSettingService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    await this.GetMasterDataList();
  }

  async GetMasterDataList() {
    /*this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;*/
    try {
      this.loaderService.requestStarted();
      await this.documentSettingService.GetAllData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.DocumentSettingList = data['Data'];
            console.log(this.DocumentSettingList, 'ttttt')
          } else {
            this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
