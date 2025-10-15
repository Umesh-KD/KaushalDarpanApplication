import { Component, OnInit } from '@angular/core';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { GetAdmitCardService } from '../../../../Services/GenerateAdmitCard/generateAdmitCard.service';

import { ReportService } from '../../../../Services/Report/report.service';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { ITIGenrateEnrollService } from '../../../../Services/ITI/ITIGenerateEnroll/ITIGenerateEnroll.service';
import { ITIStudentEnrollmentService } from '../../../../Services/ITI/ITIstudentenrollment/itistudent-enrollment.service';
import { ChunksSearchModel } from '../../../../Models/StudentMasterModels';
import { DataPagingListModel, NCVTChunkInfoDataModelDataPagingList } from '../../../../Models/DataPagingListModel';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-upload-ncvt-data',
  standalone: false,
  templateUrl: './upload-ncvt-data.component.html',
  styleUrl: './upload-ncvt-data.component.css'
})
export class UploadNcvtDataComponent implements OnInit
{
  sSOLoginDataModel = new SSOLoginDataModel();
  public listDataPaging: NCVTChunkInfoDataModelDataPagingList[] = []
  public searchRequest = new ChunksSearchModel();
  public SemesterName: string = '';
  masterSelected: boolean = false;

  public PostData: NCVTChunkInfoDataModelDataPagingList[] = []


  constructor(private loaderService: LoaderService, private itigenrateenrollservice: ITIStudentEnrollmentService
    ,
    private activatedRoute: ActivatedRoute, private reportService: ReportService, private toastrService: ToastrService, 
    )
  { }

  ngOnInit()
  {
      this.GetAllData();
  }

  async GetAllData()
  {
    this.listDataPaging = []
    try {
      this.loaderService.requestStarted();
      await this.itigenrateenrollservice.GetNcvtStudentData_Chunks(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success)
          {
            this.listDataPaging = data['Data'];
            console.log(this.listDataPaging, "PaginData")
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



  //upload data
  async UploadDataInChunks(item:any)
  {
    this.PostData=[]
    this.PostData.push(item);
    this.UploadTraineeData(this.PostData)

  }

  async BulkUploadApi()
  {
    const selectedItems = this.listDataPaging.filter(item => item.IsSelected);
    if (selectedItems.length === 0)
    {
      this.toastrService.warning("Please select at least one record!");
      return;
    }
    this.UploadTraineeData(selectedItems)
  }


  async UploadTraineeData(request: NCVTChunkInfoDataModelDataPagingList[])
  {
    try {
      this.loaderService.requestStarted();
      await this.itigenrateenrollservice.UploadTraineeData(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success)
          {
     
          }
          this.PostData = [];
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



  // Select / deselect all rows
  checkUncheckAll() {
    for (let item of this.listDataPaging)
    {
      item.IsSelected = this.masterSelected;
    }
  }

  // Check if all rows are selected
  isAllSelected()
  {
    this.masterSelected = this.listDataPaging.every(item => item.IsSelected);
  }

  // Example filter function
  filterSelectedItems() {
    this.listDataPaging = this.listDataPaging.filter(item => item.IsSelected);
  }



}
