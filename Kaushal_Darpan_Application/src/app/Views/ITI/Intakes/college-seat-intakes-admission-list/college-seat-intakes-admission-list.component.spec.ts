import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeSeatIntakesAdmissionListComponent } from './college-seat-intakes-admission-list.component';

describe('CollegeSeatIntakesAdmissionListComponent', () => {
  let component: CollegeSeatIntakesAdmissionListComponent;
  let fixture: ComponentFixture<CollegeSeatIntakesAdmissionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollegeSeatIntakesAdmissionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeSeatIntakesAdmissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
