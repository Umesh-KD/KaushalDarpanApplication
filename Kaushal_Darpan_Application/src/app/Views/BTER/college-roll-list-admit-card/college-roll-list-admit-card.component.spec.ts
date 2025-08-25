import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeRollListAdmitCardComponent } from './college-roll-list-admit-card.component';

describe('CollegeRollListAdmitCardComponent', () => {
  let component: CollegeRollListAdmitCardComponent;
  let fixture: ComponentFixture<CollegeRollListAdmitCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeRollListAdmitCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeRollListAdmitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
