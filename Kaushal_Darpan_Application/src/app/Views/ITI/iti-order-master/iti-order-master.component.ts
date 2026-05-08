import { Component } from '@angular/core';
import { ITIsService } from '../../../Services/ITIs/itis.service';
@Component({
  selector: 'app-iti-order-master',
  standalone:false,
  templateUrl: './iti-order-master.component.html',
  styleUrl: './iti-order-master.component.css'
})
export class ItiOrderMasterComponent {

  orderList: any[] = [];

  async ngOnInit() {
  await this.loadOrders();
}

constructor(
   
    private ITIsService: ITIsService

  ) { }

async loadOrders() {
  try {
    const res: any = await this.ITIsService.GetAllActiveDgtOrders();

    if (res && res.State === 1) {
      this.orderList = res.Data || [];
    } else {
      this.orderList = [];
      console.error(res.ErrorMessage);
    }
  } catch (error) {
    console.error(error);
  }
}
}
