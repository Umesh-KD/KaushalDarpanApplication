import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IipCompanyMasterComponent } from './iip-company-master.component';

describe('IipCompanyMasterComponent', () => {
  let component: IipCompanyMasterComponent;
  let fixture: ComponentFixture<IipCompanyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IipCompanyMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IipCompanyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
