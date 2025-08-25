import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AdminUserDetailModel, AdminUserSearchModel, StreamMasterForHodModel } from './../../Models/AdminUserDataModel';
import { SSOLoginDataModel } from './../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from './../../Services/CommonFunction/common-function.service';
import { AdminUserService } from './../../Services/BTERAdminUser/admin-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from './../../Services/Loader/loader.service';
import { SweetAlert2 } from './../../Common/SweetAlert2';
import { EnumRole, EnumStatus, GlobalConstants } from './../../Common/GlobalConstants';
import { DropdownValidators } from './../../Services/CustomValidators/custom-validators.service';
import { StreamDDL_InstituteWiseModel } from '../../Models/CommonMasterDataModel';
import { AssignHodBranch, ParentSubjectMap } from '../../Models/SubjectMasterDataModel';


@Component({
  selector: 'app-assign-hod',
  standalone: false,
  templateUrl: './assign-hod.component.html',
  styleUrl: './assign-hod.component.css'
})
export class AssignHodComponent {
  public UserID: number = 0;
  public UserAdditionID: number = 0;
  public ProfileID: number = 0;
  public Table_SearchText: string = "";
  public searchRequest = new AdminUserSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new AdminUserDetailModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public IsView: boolean = false;
  public State: number = 0;
  public Message: string = '';
  AddParent = new AssignHodBranch()
  public ErrorMessage: string = '';
  public AdminUserFormGroup!: FormGroup;
  public AdminUserList: any = [];
  public RoleMasterList1: any = [];
  public RoleMasterList: any = [];
  public settingsMultiselect: object = {};
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public SubMasterList: any = []
  public CourseMasterDDL: any = []
  public StreamSearch = new StreamDDL_InstituteWiseModel()
  public streamMasterForHod = new StreamMasterForHodModel()
  constructor(private commonMasterService: CommonFunctionService,
    private adminUserService: AdminUserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router,
    private modalService: NgbModal, private toastr: ToastrService,
    private loaderService: LoaderService, private Swal2: SweetAlert2) {

  }

  async ngOnInit() {


    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'StreamID',
      textField: 'StreamName',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };




    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    await this.GetAllData();
    await this.GetMasterSubDDL();


  }





  maskMobileNumber(mobile: string): string {
    if (mobile && mobile.length > 4) {
      // Mask all but the last 4 digits
      const masked = mobile.slice(0, -4).replace(/\d/g, '*');
      return `${masked}${mobile.slice(-4)}`;
    }
    return mobile; // Return original if length is less than or equal to 4
  }

  async GetMasterSubDDL() {
    var CommnID = 0

    if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon) {
      CommnID = 89;
    }
    else if (this.sSOLoginDataModel.RoleID == EnumRole.DTE || this.sSOLoginDataModel.RoleID == EnumRole.DTENON) {
      CommnID = 88;
    }
    else if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      CommnID = 87;
      //this.searchRequest.PolytechnicID = this.sSOLoginDataModel.InstituteID;
    }
    else {
      CommnID = 0;
    }

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectForCitizenSugg(CommnID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubMasterList = data['Data'];
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


  // reset
  ResetControls() {
    this.request = new AdminUserDetailModel();
    this.isSubmitted = false;

  }
  async GetAllData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      }
      if (this.sSOLoginDataModel.RoleID != EnumRole.Principal && this.sSOLoginDataModel.RoleID != EnumRole.PrincipalNon) {
        this.searchRequest.UserRole = this.sSOLoginDataModel.RoleID
      } else {
        if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {
          this.searchRequest.UserRole = EnumRole.HOD_Eng
        } else {
          this.searchRequest.UserRole = EnumRole.HOD_NonEng
        }
      }


      this.loaderService.requestStarted();
      await this.adminUserService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.AdminUserList = data.Data;
        //if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {

        //  this.AdminUserList = this.AdminUserList.filter((e: any) => e.RoleID == 7)
        //} else if (this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
        //  this.AdminUserList = this.AdminUserList.filter((e: any) => e.RoleID == 13)
        //}

        //if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {

        //  this.AdminUserList = this.AdminUserList.filter((e: any) => e.RoleID == 7)
        //} else if (this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
        //  this.AdminUserList = this.AdminUserList.filter((e: any) => e.RoleID == 13)
        //}
        //if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon) {
        //  this.AdminUserList = this.AdminUserList.filter((e: any) => e.RoleID != 13 && e.RoleID!=7)
        //}

        console.log(data.Data)
      }, (error: any) => console.error(error))
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


  // get all data
  async ClearSearchData() {
    this.searchRequest = new AdminUserSearchModel();
    this.AdminUserList = [];

  }


  CloseModal() {
    this.modalService.dismissAll();
    this.AddParent.UserID = 0
    this.AddParent.InstituteID = 0
    this.AddParent.CourseTypeID = 0
    this.AddParent.UserAdditionalID = 0
    this.AddParent.Branchlist = []



  }
  @ViewChild('content') content: ElementRef | any;
  async openModal(content: any, row: any) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.AddParent.InstituteID = this.sSOLoginDataModel.InstituteID
    this.AddParent.UserID = row.UserID
    this.AddParent.UserAdditionalID = row.UserAdditionID
    this.AddParent.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    /*    this.AddParent.SubjectID = row.SubjectID*/
    await this.GetStreamMasterForHod()
    await this.GetById()
    //this.GetParentSubjectDDL(row.SubjectID, row.StreamId, row.SemesterId)
    //this.GetPARENTsUBJECT(row.SubjectID)

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
    this.ResetControls();
  }

  //GetHodBranch
  async GetById() {
    try {
      
      this.loaderService.requestStarted();
      this.searchRequest.UserID = this.AddParent.UserID;
      this.searchRequest.UserAdditionID = this.AddParent.UserAdditionalID;
      this.searchRequest.Eng_NonEng = this.AddParent.CourseTypeID;
      this.searchRequest.InstituteID = this.AddParent.InstituteID;

      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      await this.adminUserService.GetHodBranch(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AddParent.Branchlist = data['Data']

          const selectedSubjectIDs = this.AddParent.Branchlist.map((x: any) => x.StreamID);
          this.AddParent.Branchlist = this.CourseMasterDDL.filter((subject: any) =>
            selectedSubjectIDs.includes(subject.StreamID)
          );

          console.log(this.AddParent.Branchlist)


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




  onItemSelect(item: any, centerID: number) {



  }

  onDeSelect(item: any, centerID: number) {



  }

  onSelectAll(items: any[], centerID: number) {



  }

  onDeSelectAll(centerID: number) {



  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }


  //branch master
  async GetStreamMasterForHod() {
    try {
      this.loaderService.requestStarted();

      this.streamMasterForHod.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.streamMasterForHod.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.streamMasterForHod.StreamType = this.sSOLoginDataModel.Eng_NonEng;
      this.streamMasterForHod.RoleID = this.sSOLoginDataModel.RoleID;

      this.streamMasterForHod.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.streamMasterForHod.UserAdditionID = this.AddParent.UserAdditionalID;
      //call
      await this.adminUserService.GetStreamMasterForHod(this.streamMasterForHod).
        then((data: any) => {
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



  async MapInsitute() {
    this.loaderService.requestStarted();
    this.isLoading = true;
    console.log(this.AddParent)
    if (this.AddParent.Branchlist.length == 0) {
      this.toastr.error("Please Select Branch")
      return
    }
    this.AddParent.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
    this.AddParent.ModifyBy = this.sSOLoginDataModel.UserID
    this.AddParent.RoleID = this.sSOLoginDataModel.RoleID
    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {
      this.AddParent.UserRole = EnumRole.HOD_Eng
    } else {
      this.AddParent.UserRole = EnumRole.HOD_NonEng
    }

    try {
      await this.adminUserService.AssignHOD(this.AddParent)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            //this.ResetControl();
            //this.GetSubjectMasterList()
            this.CloseModal()
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
        this.isLoading = false;

      }, 200);
    }
  }

}
