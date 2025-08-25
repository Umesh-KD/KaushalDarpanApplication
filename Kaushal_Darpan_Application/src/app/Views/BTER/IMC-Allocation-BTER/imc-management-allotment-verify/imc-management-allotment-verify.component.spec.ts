import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IMCManagementAllotmentVerifyComponent } from './imc-management-allotment-verify.component';

describe('IMCManagementAllotmentVerifyComponent', () => {
  let component: IMCManagementAllotmentVerifyComponent;
  let fixture: ComponentFixture<IMCManagementAllotmentVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IMCManagementAllotmentVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IMCManagementAllotmentVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
