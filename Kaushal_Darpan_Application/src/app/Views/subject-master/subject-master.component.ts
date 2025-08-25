import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ParentSubjectMap, SubjectMasterDataModel, SubjectSearchModel } from '../../Models/SubjectMasterDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { SubjectCategoryService } from '../../Services/SubjectCategory/subject-category.service';
import { SubjectMasterService } from '../../Services/SubjectMaster/Subject-master.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import * as XLSX from 'xlsx';
import { EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';

@Component({
    selector: 'app-subject-master',
    templateUrl: './subject-master.component.html',
    styleUrls: ['./subject-master.component.css'],
    standalone: false
})
export class SubjectMasterComponent {

  SubjectMasterFormGroup!: FormGroup;
  public SubjectID: number = 0
  public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public SubjectCategoryListList: any = []
  public SubjectMasterList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public BranchesMasterList: any = []
  public SemesterMasterList: any = []
  public showDropdown = false;  // Controls dropdown visibility
  public isShowInput = false
  public ParentList: any = []
  public settingsMultiselect: object = {};
  public Table_SearchText: string = '';
  public SearchRequest = new SubjectSearchModel()
  public SelectedInstituteList:number=0
  request = new SubjectMasterDataModel()
  sSOLoginDataModel = new SSOLoginDataModel();
  AddParent = new ParentSubjectMap()
  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default
  constructor(private SubjectMasterService: SubjectMasterService, private SubjectCategoryService: SubjectCategoryService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
    private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2, private commonMasterService: CommonFunctionService) {
  }

  async ngOnInit() {

    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
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



    this.SubjectMasterFormGroup = this.formBuilder.group(
      {
        txtSubjectName: ['', Validators.required],
        txtSubjectCode: ['', Validators.required],
        max_th: [''],
        max_pr: [''],
        max_ia: [''],
        sca_grade: [''],
        IsParent: ['', Validators.required],
        is_th: ['', Validators.required],
        is_sca: ['', Validators.required],
        is_ia: ['', Validators.required],
        is_pr: ['', Validators.required],
        txtCredits: ['', Validators.required],

     
        ddlSemester: ['', [DropdownValidators]],
        ddlStream: ['', [DropdownValidators]],
        ddlParent: ['',],


        chkActiveStatus: ['true'],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.Modify = this.sSOLoginDataModel.UserID;

    await this.GetSubjectCategoryList();
    await this.GetSubjectMasterList()
    await this.GetSemesterMasterData()
    await this.GetBranchesMasterData()

    if (this.SubjectID > 0) {
      await this.btnEdit_OnClick(this.SubjectID)
    }

  }
  get form() { return this.SubjectMasterFormGroup.controls; }

  onSubjectTypeChange(value: any) {
    // Show the dropdown only if "Mandatory" is selected
    if (value == 2) {
      this.showDropdown = true

    } else {
      this.showDropdown = false
      this.request.ParentID = 0
    }


  }
  async OnCheck(type: string) {
    if (type === 'th') this.request.is_th = !this.request.is_th;
    else if (type === 'pr') this.request.is_pr = !this.request.is_pr;

    else if (type === 'ia') this.request.is_ia = !this.request.is_ia;
    else if (type === 'sca') this.request.is_sca = !this.request.is_sca;
  }



  async GetSubjectCategoryList() {
    try {
      this.loaderService.requestStarted();
      await this.SubjectCategoryService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SubjectCategoryListList = data['Data'];
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

  async GetParentSubjectDDL(SubjectID:number,StreamID:number, SemesterID:number) {
    this.SearchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.SearchRequest.SubjectID = SubjectID
    this.SearchRequest.SemesterID = SemesterID
    this.SearchRequest.BranchID = StreamID

  
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetParentSubjectDDL(this.SearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ParentList = data['Data'];
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


  async GetBranchesMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.BranchesMasterList = data.Data;
        console.log("StreamMasterList", this.BranchesMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetSemesterMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterList = data.Data;
        console.log("StreamMasterList", this.BranchesMasterList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async GetSubjectMasterList() {
    this.SearchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.SearchRequest.CourseType = this.sSOLoginDataModel.Eng_NonEng
    try {
      this.loaderService.requestStarted();
      await this.SubjectMasterService.GetAllData(this.SearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SubjectMasterList = data['Data'];
          this.loadInTable()
          console.log(this.SubjectMasterList, "CodeSubject")
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

  async SaveData() {
    this.isSubmitted = true;
    if (this.SubjectMasterFormGroup.invalid) {
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    try {
      await this.SubjectMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetSubjectMasterList()
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
          console.log(this.SubjectMasterFormGroup)
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

  async btnEdit_OnClick(SubjectID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.SubjectMasterService.GetByID(SubjectID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.request = data['Data']
          this.request.SubjectID = data['Data']["SubjectID"];
          this.request.SubjectName = data['Data']["SubjectName"];
          this.request.SubjectCode = data['Data']["SubjectCode"];
          this.request.is_th = data['Data']["is_th"];
          this.request.is_pr = data['Data']["is_pr"];
          this.request.is_ia = data['Data']["is_ia"];
          this.request.is_sca = data['Data']["is_sca"];
          this.request.isParent = data['Data']["isParent"];
          this.request.ParentID = data['Data']['ParentID']
          this.request.SubjectType = data['Data']["SubjectType"];
          this.request.SubjectCredits = data['Data']["SubjectCredits"];
          if (this.request.ParentID > 0) {
            this.request.SubjectRadio = true
            this.showDropdown = true
          } else {
            this.request.SubjectRadio = false
            this.showDropdown = false
          }
          this.request.ActiveStatus = data['Data']["ActiveStatus"];
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async GetPARENTsUBJECT(SubjectID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.SubjectMasterService.GetChildSubject(SubjectID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.AddParent = data['Data']
         
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }


  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }


  //async btnDelete_OnClick(SubjectID: number) {

  //  this.isSubmitted = false;
  //  try {
  //    if (confirm("Are you sure you want to delete this ?")) {
  //      this.loaderService.requestStarted();
  //      await this.SubjectCategoryService.DeleteDataByID(SubjectID, this.UserID)
  //        .then((data: any) => {
  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];
  //          if (this.State == 0) {
  //            this.toastr.success(this.Message)
  //            this.GetSubjectCategoryList()
  //          }
  //          else {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //        })
  //    }
  //  }
  //  catch (ex) { }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async btnDelete_OnClick(SubjectId: number, isParent: boolean) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();
       /*     alert(isParent)*/
            await this.SubjectMasterService.DeleteDataByID(SubjectId, this.UserID, isParent)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data)
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  this.GetSubjectMasterList()
                  //reload
                  /*        this.GetSubjectCategoryList()*/
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

  async ResetControl() {
    const txtRoleName = document.getElementById('txtRoleName');

    this.request = new SubjectMasterDataModel()
    if (txtRoleName) txtRoleName.focus();
    this.isSubmitted = false;
    this.request.SubjectName = '';
    this.request.SubjectType = 0;
    this.request.SubjectCode = '';


    this.request.ActiveStatus = true;
    this.request.ActiveDeactive = '';
    this.request.DeleteStatus = false;



    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.SubjectCategoryListList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][3] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "RoleMaster.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }

  }
  @ViewChild('content') content: ElementRef | any;

  openModal(content: any, row: any) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.AddParent.SubjectID = row.SubjectID
    this.GetParentSubjectDDL(row.SubjectID, row.StreamId, row.SemesterId)
    this.GetPARENTsUBJECT(row.SubjectID)

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
    this.modalService.dismissAll();
    this.AddParent.SubjectID = 0
    this.AddParent.SubjectList = []
    
   

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

  async MapInsitute() {
    this.loaderService.requestStarted();
    this.isLoading = true;
    console.log(this.AddParent)
    if (this.AddParent.SubjectList.length == 0) {
      this.toastr.error("Please Select Subjects")
      return
    }
    try {
      await this.SubjectMasterService.SaveParentData(this.AddParent)
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
          console.log(this.SubjectMasterFormGroup)
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


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.SubjectMasterList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.SubjectMasterList.length;
  }



}
