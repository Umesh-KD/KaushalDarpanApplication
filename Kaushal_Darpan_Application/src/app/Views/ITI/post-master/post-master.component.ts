import { Component } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';


@Component({
  selector: 'app-post-master',
  standalone: false,
  templateUrl: './post-master.component.html',
  styleUrls: ['./post-master.component.css']
})
export class PostMasterComponent {

  public StaffTypeList: any[] = [];
  public TradeList: any[] = [];

  public formData: any = {};
  public tradeSearchRequest: any = {};
  public form!: FormGroup; 

  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    
  ) { }
  async ngOnInit() {

    // Create FormGroup properly
    this.form = this.formBuilder.group({
      StaffTypeID: [0, [DropdownValidators]],
      TradeID: [0, [DropdownValidators]],
      Post: ['']
    });

    // Load dropdown data
    await this.GetStaffTypeData();
    await this.GetTradeData();
  }
  // Get Staff Type
  async GetStaffTypeData() {
    try {
      this.loaderService.requestStarted();

      const data: any = await this.commonMasterService.GetCommonMasterData('PostType');
      const parsedData = JSON.parse(JSON.stringify(data));
      this.StaffTypeList = parsedData.Data;
      console.log("StaffTypeList:"+ this.StaffTypeList);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // Get Trade Data
  async GetTradeData() {
    this.tradeSearchRequest.action = 'Posttrade';
    this.tradeSearchRequest.CollegeID = this.formData.PlanningID;

    try {
      this.loaderService.requestStarted();
      debugger;
      console.log("Request:"+this.tradeSearchRequest);
      const data: any = await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest);
      const parsedData = JSON.parse(JSON.stringify(data));
      debugger;
      this.TradeList = parsedData.Data;

      console.log("ItiTradeListAll",this.TradeList );

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
