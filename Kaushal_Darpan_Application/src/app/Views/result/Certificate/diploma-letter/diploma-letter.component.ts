import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiplomaLetterService } from '../../../../Services/DiplomaLetter/diploma-letter.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { DiplomaLetterDataModel, DiplomaLetterSearchModel } from '../../../../Models/DiplomaLetterDataModel';


@Component({
    selector: 'app-diploma--letter',
    templateUrl: './diploma-letter.component.html',
    styleUrls: ['./diploma-letter.component.css'],
    standalone: false
})
export class DiplomaLetterComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request = new DiplomaLetterDataModel()
  public searchRequest = new DiplomaLetterSearchModel();
  public InstituteList: any = [];

  constructor(private commonMasterService: CommonFunctionService, private DiplomaLetterService: DiplomaLetterService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2) {
  }


  async ngOnInit() {
    //this.searchRequest.DepartmentID = 2;
    //this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //await this.GetAllData();
      await this.GetInstituteListDDL();

  }

  async GetInstituteListDDL() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = 1;
      await this.commonMasterService.InstituteMaster(this.searchRequest.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteList = data.Data;
          console.log(this.InstituteList)
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

 






}
