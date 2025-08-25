import { Component, ViewChild, ElementRef } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EnumCourseType, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMStaffMaster } from '../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../../Services/Menu/menu.service';
import * as XLSX from 'xlsx';
import {ITIGovtUserPrincipMasterSerchModel } from '../../../../Models/ITIGovtEMStaffMasterDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ITI-Govt-Principal-Multiple-Institute-AlloatList',
  standalone: false,
  
  templateUrl: './ITI-Govt-Principal-Multiple-Institute-AlloatList.Component.html',
  styleUrl: './ITI-Govt-Principal-Multiple-Institute-AlloatList.Component.css'
})
export class ITIGovtPrincipalMultipleInstituteAlloatListComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _GlobalConstants: any = GlobalConstants;
  public _EnumRole = EnumRole;
  public UserID: number = 0
  public RoleID: number = 0
  public InstituteMasterList: any = [];
  public StreamMasterList: any = [];
  public SemesterMasterList: any = [];
  public StudentTypeMasterList: any = [];
  public requestUserMasterSerchModel = new ITIGovtUserPrincipMasterSerchModel();//search
  //public requestPrincipleUpdateInstituteIDModel = new PrincipleUpdateInstituteIDModel();//search
  public nextAcedmicYearDDl: any[] = [];//grid
  public NextEndTermID: string = '0'
  public PrincipleList: any[] = [];
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
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  selectedInstitutes: { [key: number]: number } = {};
  closeResult: string | undefined;
  //end table feature default

  constructor(private commonMasterService: CommonFunctionService,
   
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ITIGovtEMStaffMaster: ITIGovtEMStaffMaster,
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService
  ) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID
    await this.GetMasterData();
    await this.GetAllPrinciple();

    this.PrincipleList.forEach(p => {
      p.InstituteID = p.InstituteID || 0;
      this.selectedInstitutes[p.UserID] = p.InstituteID;
    });
   

  }

  async GetMasterData() {
    try {
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          this.InstituteMasterList = data['Data'];
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetAllPrinciple() {
    
    try {
      this.requestUserMasterSerchModel.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.requestUserMasterSerchModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.requestUserMasterSerchModel.RoleId = EnumRole.ITIPrincipal 
      await this.ITIGovtEMStaffMaster.GetPrincipleList(this.requestUserMasterSerchModel)
        .then(async (data: any) => {
        
          if (data.State == EnumStatus.Success) {
            
            this.PrincipleList = data['Data'];
           
            this.loadInTable();
            
          }
          else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }




  onInstituteSelect(rowId: number, selectedId: number) {
    
    this.selectedInstitutes[rowId] = selectedId;
  }

 


  //isInstituteSelectedByAnotherRow(currentRowId: number, instituteId: number): boolean {
    
  //  return Object.keys(this.selectedInstitutes)
  //    .some(rowId => +rowId !== currentRowId && this.selectedInstitutes[+rowId] === instituteId);
  //}



  isInstituteSelectedByAnotherRow(currentUserId: number, instituteId: number): boolean {
    // "--All--" option should never be disabled
    if (instituteId === 0) return false;

    // Check if any institute has been selected (excluding 0)
    const hasSelections = Object.values(this.selectedInstitutes).some(
      id => id && id !== 0
    );
    if (!hasSelections) return false;

    // Disable if this institute is selected by a different user
    return Object.entries(this.selectedInstitutes).some(
      ([userId, selectedId]) =>
        +userId !== currentUserId && selectedId === instituteId
    );
  }


  

  //async btn_Update() {
  
  //  const converted = Object.entries(this.selectedInstitutes)
  //    .filter(([_, value]) => value !== 0) 
  //    .map(([key, value]) => ({
  //      rowId: +key,
  //      InstituteID: value,
  //      DepartmentID: this.sSOLoginDataModel.DepartmentID,
  //      CourseType: this.sSOLoginDataModel.Eng_NonEng
  //    }));
    
  //  this.requestPrincipleUpdateInstituteIDModel.json_Data = JSON.stringify(converted);;
  //  this.requestPrincipleUpdateInstituteIDModel.RoleID = this._EnumRole.Principal;
  //  if (this.requestPrincipleUpdateInstituteIDModel.json_Data != "[]" ) {
  //    try {
  //      //const data: any = await this.ITIGovtEMStaffMaster.UpdatePrincipleData(this.requestPrincipleUpdateInstituteIDModel);
  //      //if (data.State === EnumStatus.Success) {
  //      //  this.toastr.success("Institute IDs updated successfully.");

  //      //  this.PrincipleList.forEach(p => {
  //      //    p.InstituteID = 0;
  //      //  });
  //      //  this.selectedInstitutes = {};
  //      //} else {
  //      //  this.toastr.error(data.ErrorMessage || "Update failed.");
  //      //}
  //    } catch (error) {
  //      console.error("Update error:", error);
  //      this.toastr.error("An unexpected error occurred.");
  //    }
  //  } else {
  //    this.toastr.error("not selected  Institute");
  //  }

    
  //}





 

  

  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.PrincipleList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.PrincipleList.length;
  }

  get totalInTableSelected(): number {
    return this.PrincipleList.filter(x => x.Selected)?.length;
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
    this.paginatedInTableData = [...this.PrincipleList].slice(this.startInTableIndex, this.endInTableIndex);
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

  @ViewChild('content') content: ElementRef | any;

  openModal(content: any, row: any) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //this.AddParent.SubjectID = row.SubjectID
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

  CloseModal() {
    this.modalService.dismissAll();
    //this.AddParent.SubjectID = 0
    //this.AddParent.SubjectList = []



  }


}
