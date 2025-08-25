import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IMCManagementAllotmentComponent } from './imc-management-allotment.component';

describe('IMCManagementAllotmentComponent', () => {
  let component: IMCManagementAllotmentComponent;
  let fixture: ComponentFixture<IMCManagementAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IMCManagementAllotmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IMCManagementAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
