import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiOrderMasterComponent } from './iti-order-master.component';

describe('ItiOrderMasterComponent', () => {
  let component: ItiOrderMasterComponent;
  let fixture: ComponentFixture<ItiOrderMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiOrderMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiOrderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
