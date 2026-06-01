import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-iip-event-common-master',
  standalone: false,
  templateUrl: './iip-event-common-master.component.html',
  styleUrl: './iip-event-common-master.component.css'
})
export class IipEventCommonMasterComponent implements OnInit {

  form!: FormGroup;
  submitted = false;

  eventList: any[] = [];
  typeList: any[] = [];
  selectedType: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();

  constructor(
    private fb: FormBuilder,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.sSOLoginDataModel =  JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.createForm();
    this.loadTypes();
    this.loadList();
  }

  createForm() {
    this.form = this.fb.group({
      Type: ['', Validators.required],
      NameEng: ['', Validators.required],
      NameHi: ['']
    });
  }

  // LOAD TYPES
  async loadTypes() {
    try {

      let res: any = await this.commonFunctionService.GetEventTypes();
      if (res.State === 1) {
        this.typeList = res.Data;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // SAVE DATA
  async save() {
    this.submitted = true;

    if (this.form.invalid) return;

    try {

      let payload = {
        ...this.form.value,
        CreatedBy: this.sSOLoginDataModel.UserID // 👈 set user id here
      };


      let res: any = await this.commonFunctionService.InsertEventCommonMaster(payload);

      if (res.State === 1) {
        this.toastr.success('Saved successfully');

        this.form.reset();
        this.submitted = false;
      } else if (res.Data === -1) {
        this.toastr.warning('Duplicate record!');
      }

      this.loadList();
    } catch (error) {
      console.error(error);
    }
  }

  // LOAD LIST
  async loadList() {
    let res: any = await this.commonFunctionService.GetEventCommonMasterList(this.selectedType);

    debugger
    if (res.State === 1) {
      this.eventList = res.Data;
    } else {
      this.eventList = [];
    }
  }

  // FILTER CHANGE
  onTypeChange() {
    this.loadList();
  }

  // RESET FILTER
  resetFilter() {
    this.selectedType = '';
    this.loadList();
  }
}
