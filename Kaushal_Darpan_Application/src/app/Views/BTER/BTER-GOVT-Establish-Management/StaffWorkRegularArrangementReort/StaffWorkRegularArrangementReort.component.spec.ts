import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffWorkRegularArrangementReortComponent } from './StaffWorkRegularArrangementReort.component';

describe('StaffWorkRegularArrangementReortComponent', () => {
  let component: StaffWorkRegularArrangementReortComponent;
  let fixture: ComponentFixture<StaffWorkRegularArrangementReortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffWorkRegularArrangementReortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffWorkRegularArrangementReortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
