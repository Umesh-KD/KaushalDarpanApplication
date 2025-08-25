import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Iti10ThAdmissionsInWomenWingComponent } from './iti-10th-admissions-in-women-wing.component';

describe('Iti10ThAdmissionsInWomenWing', () => {
  let component: Iti10ThAdmissionsInWomenWingComponent;
  let fixture: ComponentFixture<Iti10ThAdmissionsInWomenWingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Iti10ThAdmissionsInWomenWingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iti10ThAdmissionsInWomenWingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
