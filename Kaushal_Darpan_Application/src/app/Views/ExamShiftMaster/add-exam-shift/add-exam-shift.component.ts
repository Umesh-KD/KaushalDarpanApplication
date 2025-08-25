import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ExamShiftDataModel } from '../../../Models/ExamShiftDataModel';

@Component({
  selector: 'app-add-exam-shift',
  templateUrl: './add-exam-shift.component.html',
  styleUrl: './add-exam-shift.component.css',
  standalone: false
})
export class AddExamShiftComponent implements OnInit {
  ExamShiftForm!: FormGroup;
  public request = new ExamShiftDataModel();
  public isSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
  ) {}

  async ngOnInit() {
    this.ExamShiftForm = this.fb.group({
      ExamShiftName: ['', Validators.required],
      StartTime: ['', Validators.required],
      EndTime: ['', Validators.required],
    });
  }
  get _ExamShiftForm() { return this.ExamShiftForm.controls; }
}
