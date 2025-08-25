import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiPlanningComponent } from './iti-planning.component';

describe('ItiPlanningComponent', () => {
  let component: ItiPlanningComponent;
  let fixture: ComponentFixture<ItiPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
