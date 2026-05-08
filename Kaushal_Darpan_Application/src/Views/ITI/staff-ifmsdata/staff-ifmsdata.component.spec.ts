import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffIFMSDataComponent } from './staff-ifmsdata.component';

describe('StaffIFMSDataComponent', () => {
  let component: StaffIFMSDataComponent;
  let fixture: ComponentFixture<StaffIFMSDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StaffIFMSDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffIFMSDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
