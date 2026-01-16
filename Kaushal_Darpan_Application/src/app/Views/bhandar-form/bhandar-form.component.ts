import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { BterApplicationForm } from '../../Services/BterApplicationForm/bterApplication.service';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '../../Services/EncryptionService/encryption-service.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { AddBhandarFormDataModel } from '../../Models/BhandarFormDataModel';

@Component({
  selector: 'app-bhandar-form',
  standalone: false,
  templateUrl: './bhandar-form.component.html',
  styleUrl: './bhandar-form.component.css'
})
export class BhandarFormComponent {
  public BhandarForm!: FormGroup;
  public isSubmitted: boolean = false
  public request = new AddBhandarFormDataModel()

  constructor(
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private ApplicationService: BterApplicationForm,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService
  ) { }

  async ngOnInit() {

    this.BhandarForm = this.formBuilder.group(
      {


        MoharID: ['', [DropdownValidators]],
        Name: ['', Validators.required],


      });


  }

  get _BhandarForm() { return this.BhandarForm.controls; }

}
