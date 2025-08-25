import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { GenerateRollData, GenerateRollSearchModel } from '../../Models/GenerateRollDataModels';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { GetRollService } from '../../Services/GenerateRoll/generate-roll.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr/toastr/toastr.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-roll-number',
  standalone: false,
  templateUrl: './verify-roll-number.component.html',
  styleUrl: './verify-roll-number.component.css'
})
export class VerifyRollNumberComponent {
  public SearchForm!: FormGroup;
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public StudentTypeList: any[] = [];
  public ExamList: any[] = [];
  public Table_SearchText: any = '';
  public StudentList: any[] = [];
  public InstituteMasterList: any = [];
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new GenerateRollSearchModel();
  public UserID: number = 0;
  public ModuleID:number=0
  //table feature default
  public paginatedInTableData: any[] = []; //copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = '50';
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;

  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  public Status: number = 0




  public RollNoHistoryList: any[] = [];

  constructor(
    private commonMasterService: CommonFunctionService,
    private GetRollService: GetRollService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
   private activeroute: ActivatedRoute



  ) { }

  async ngOnInit()
  {

    this.sSOLoginDataModel = await JSON.parse(
      String(localStorage.getItem('SSOLoginUser'))
    );


    this.ModuleID = Number(this.activeroute.snapshot.paramMap.get('id') ?? 0);
    this.Status = Number(this.activeroute.snapshot.paramMap.get('status') ?? 0);

    this.searchRequest.StatusID = this.Status
    this.searchRequest.ModuleID = this.ModuleID
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData()
   
  }

  async GetAllData() {
    try {
    
      this.StudentList = [];
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      if (this.searchRequest.ModuleID == 1)
      {
        this.searchRequest.action = "_GenerateRollNumbers"
      } else {
        this.searchRequest.action = "_GenerateEnrollNumbers"
      }
   
      this.loaderService.requestStarted();
      //call
      await this.GetRollService.GetVerifyRollData(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];
            console.log(this.StudentList,"StudentList")
            
          }
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



  async GetRollNumberDetails_History() {
    try
    {
      
      this.RollNoHistoryList = [];
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.UserID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.searchRequest.action = "_GetRollHistory"
      this.loaderService.requestStarted();
      //call
      await this.GetRollService.GetRollNumberDetails_History(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.RollNoHistoryList = data['Data'];
            console.log(this.RollNoHistoryList,"RollNoHistoryList")
          }
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



  
  async ViewHistory(content: any)
  {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    await this.GetRollNumberDetails_History();
   
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
  }






}
