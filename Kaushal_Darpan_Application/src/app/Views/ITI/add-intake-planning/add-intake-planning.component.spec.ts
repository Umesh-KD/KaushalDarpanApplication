import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntakePlanningComponent } from './add-intake-planning.component';

describe('AddIntakePlanningComponent', () => {
  let component: AddIntakePlanningComponent;
  let fixture: ComponentFixture<AddIntakePlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddIntakePlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIntakePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
