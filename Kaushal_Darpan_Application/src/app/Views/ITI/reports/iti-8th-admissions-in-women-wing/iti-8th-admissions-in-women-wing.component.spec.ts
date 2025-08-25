import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Iti8ThAdmissionsInWomenWingComponent } from './iti-8th-admissions-in-women-wing.component';

describe('Iti8ThAdmissionsInWomenWing', () => {
  let component: Iti8ThAdmissionsInWomenWingComponent;
  let fixture: ComponentFixture<Iti8ThAdmissionsInWomenWingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Iti8ThAdmissionsInWomenWingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Iti8ThAdmissionsInWomenWingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
