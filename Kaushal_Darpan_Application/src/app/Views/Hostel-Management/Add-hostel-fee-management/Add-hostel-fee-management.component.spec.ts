import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddhostelfeemanagementComponent } from './Add-hostel-fee-management.component';

describe('AddhostelfeemanagementComponent', () => {
  let component: AddhostelfeemanagementComponent;
  let fixture: ComponentFixture<AddhostelfeemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddhostelfeemanagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddhostelfeemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
