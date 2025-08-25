import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiPlanningListComponent } from './iti-planning-list.component';

describe('ItiPlanningListComponent', () => {
  let component: ItiPlanningListComponent;
  let fixture: ComponentFixture<ItiPlanningListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiPlanningListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiPlanningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
