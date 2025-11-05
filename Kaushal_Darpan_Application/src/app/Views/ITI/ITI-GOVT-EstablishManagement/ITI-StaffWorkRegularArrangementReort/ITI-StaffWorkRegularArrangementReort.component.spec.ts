import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIStaffWorkRegularArrangementReortComponent } from './ITI-StaffWorkRegularArrangementReort.component';

describe('ITIStaffWorkRegularArrangementReortComponent', () => {
  let component: ITIStaffWorkRegularArrangementReortComponent;
  let fixture: ComponentFixture<ITIStaffWorkRegularArrangementReortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIStaffWorkRegularArrangementReortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIStaffWorkRegularArrangementReortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
