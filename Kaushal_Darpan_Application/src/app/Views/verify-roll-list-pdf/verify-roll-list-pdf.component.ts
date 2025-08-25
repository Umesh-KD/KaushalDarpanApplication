import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EnumStatus } from '../../Common/GlobalConstants';
import { GenerateRollSearchModel } from '../../Models/GenerateRollDataModels';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { GetRollService } from '../../Services/GenerateRoll/generate-roll.service';

@Component({
  selector: 'app-verify-roll-list-pdf',
  standalone: false,
  templateUrl: './verify-roll-list-pdf.component.html',
  styleUrl: './verify-roll-list-pdf.component.css'
})
export class VerifyRollListPdfComponent {
  public SearchForm!: FormGroup;
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public StudentTypeList: any[] = [];
  public ExamList: any[] = [];
  public Table_SearchText: any = '';
  public VerifyRollList: any[] = [];
  public InstituteMasterList: any = [];
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new GenerateRollSearchModel();
  public UserID: number = 0;

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


  constructor(
    private commonMasterService: CommonFunctionService,
    private GetRollService: GetRollService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
  ) { }

  async ngOnInit() {


    this.sSOLoginDataModel = await JSON.parse(
      String(localStorage.getItem('SSOLoginUser'))
    );
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetAllData()
  }

  async GetAllData() {
    try {

      this.VerifyRollList = [];
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.action = "_VerifyRollListPdf"
      this.loaderService.requestStarted();
      //call
      await this.GetRollService.VerifyRollListPdf(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.VerifyRollList = data['Data'];

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

}
