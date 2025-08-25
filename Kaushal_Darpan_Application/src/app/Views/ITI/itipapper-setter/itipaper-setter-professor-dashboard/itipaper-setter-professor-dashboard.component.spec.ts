import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIPaperSetterProfessorDashboardComponent } from './itipaper-setter-professor-dashboard.component';

describe('ITIPaperSetterProfessorDashboardComponent', () => {
  let component: ITIPaperSetterProfessorDashboardComponent;
  let fixture: ComponentFixture<ITIPaperSetterProfessorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIPaperSetterProfessorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIPaperSetterProfessorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
