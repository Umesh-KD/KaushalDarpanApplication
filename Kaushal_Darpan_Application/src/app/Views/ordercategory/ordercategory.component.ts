import { Component } from '@angular/core';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { OrderCategoryMasterModel } from '../../Models/OrderCategoryMasterModel ';
import { EnumCourseType, EnumDepartment, EnumStatus } from '../../Common/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../Common/SweetAlert2';

@Component({
  selector: 'app-ordercategory',
  standalone: false,
  templateUrl: './ordercategory.component.html',
  styleUrls: ['./ordercategory.component.css']
})
export class OrderCategoryComponent {

  OrderCategoryList: any[] = [];
 
  form!: FormGroup;
  selectedID: number = 0;

  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    
    private toastr: ToastrService,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.initForm();
    await this.GetOrderCategoryList();
  }

  initForm() {
    this.form = this.fb.group({
      CategoryName: ['', Validators.required],
      IsActive: [true]
    });
  }

  async GetOrderCategoryList() {

    const res: any = await this.commonMasterService.GetAllOrderCategory({
      OrderCategoryID: 0,
      CategoryName: '',
      CreatedBy: 0,
      ModifyBy: 0,
      IsActive: true
    });

    this.OrderCategoryList = res?.Data || [];
  }

  async onSave() {

    if (this.form.invalid) {
      return;
    }

    const payload = {
      OrderCategoryID: this.selectedID,
      CategoryName: this.form.value.CategoryName,
      CreatedBy: 1,
      ModifyBy: 1,
      IsActive: this.form.value.IsActive
    };

    const res: any = await this.commonMasterService.SaveOrderCategory(payload);

    if (res?.State === 1) {

      this.toastr.success(res.Message);

      this.CloseModalPopup();

      await this.GetOrderCategoryList();
    }
    else {

      this.toastr.error(res.ErrorMessage);
    }
  }


  async ViewandUpdate(content: any, id: number = 0) {
    debugger
    this.selectedID = id;

    if (id > 0) {

      const res: any =
        await this.commonMasterService.GetOrderCategoryById(id);

      const data = res?.Data;

      this.form.patchValue({
        CategoryName: data?.CategoryName,
        IsActive: data?.IsActive
      });

    } else {

      this.form.reset({
        CategoryName: '',
        IsActive: true
      });
    }

    this.modalService.open(content);
  }

  async Delete(id: number) {

    this.Swal2.Confirmation(
      "Do you want to delete?",
      async (result: any) => {

        if (result.isConfirmed) {

          try {

            this.loaderService.requestStarted();

            const res: any =
              await this.commonMasterService.DeleteOrderCategoryId(id, 1);

            if (res?.State === 1) {

              this.toastr.success(res.Message);

              await this.GetOrderCategoryList();

            } else {

              this.toastr.error(res.ErrorMessage);
            }

          } catch (error) {

            console.error(error);

          } finally {

            this.loaderService.requestEnded();
          }
        }
      });
  }

  
  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  async onToggleChange(orderCategoryID: number, status: boolean) {

    this.Swal2.Confirmation(
      "Are you sure you want to change status?",
      async (result: any) => {

        if (result.isConfirmed) {

          try {

            this.loaderService.requestStarted();

            const payload = {
              OrderCategoryID: orderCategoryID,
              
              IsActive: !status
            };

            const data: any =
              await this.commonMasterService.UpdateOrderCategoryStatus(payload);

            if (data.State == EnumStatus.Success) {

              this.toastr.success(data.Message);

              await this.GetOrderCategoryList();

            } else {

              this.toastr.error(data.ErrorMessage);
            }

          } catch (ex) {

            console.log(ex);

          } finally {

            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
  }
 }

  

