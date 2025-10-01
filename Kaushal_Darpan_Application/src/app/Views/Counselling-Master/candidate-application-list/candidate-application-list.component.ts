import { Component, OnInit } from '@angular/core';
import { CounsellingApplicationSearchModel } from '../../../Models/CounsellingApplicationFormDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CounsellingApplicationFormService } from '../../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { Router } from '@angular/router';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-candidate-application-list',
  standalone: false,
  templateUrl: './candidate-application-list.component.html',
  styleUrl: './candidate-application-list.component.css'
})
export class CandidateApplicationListComponent implements OnInit
{

  constructor(
    private loaderService: LoaderService,
    private counsellingApplicationFormService: CounsellingApplicationFormService,
    private router: Router,
    private encryptionService: EncryptionService, 
  ) { }



  public searchRequest = new CounsellingApplicationSearchModel();

  public StudentDetailsModelList: any[] = [];

  isShowGrid: boolean = false;
  async ngOnInit()
  {
    this.GetAllDataActionWise();
  }

  async GetAllDataActionWise() {   
    this.searchRequest.Action = '_GetCandidateApplication';
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();
      await this.counsellingApplicationFormService.MapCandidateSSO(this.searchRequest)
        .then((data: any) =>
        {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success)
          {
            this.isShowGrid = true

            this.StudentDetailsModelList = data['Data'];
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

  async redirectApplication(row: any) {
    this.router.navigate(['/counselling-candidate-form'],{
      queryParams: { AppID: this.encryptionService.encryptData(row.CandidateID) }
    });
  }

}
