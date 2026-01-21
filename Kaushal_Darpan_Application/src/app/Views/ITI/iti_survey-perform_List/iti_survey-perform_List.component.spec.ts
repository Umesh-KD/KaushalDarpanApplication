import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIsurveyperformListComponent } from './iti_survey-perform_List.component';

describe('ITIsurveyperformListComponent', () => {
  let component: ITIsurveyperformListComponent;
  let fixture: ComponentFixture<ITIsurveyperformListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIsurveyperformListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIsurveyperformListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
