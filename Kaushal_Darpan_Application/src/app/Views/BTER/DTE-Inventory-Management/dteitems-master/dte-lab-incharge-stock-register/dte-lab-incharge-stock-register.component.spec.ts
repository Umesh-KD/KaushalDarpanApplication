import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DTELabInchargeStockRegisterComponent } from './dte-lab-incharge-stock-register.component';
//import { ItemsMasterComponent } from './../dteitems-master.component';

describe('ItemsMasterComponent', () => {
  let component: DTELabInchargeStockRegisterComponent;
  let fixture: ComponentFixture<DTELabInchargeStockRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DTELabInchargeStockRegisterComponent]
    });
    fixture = TestBed.createComponent(DTELabInchargeStockRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
