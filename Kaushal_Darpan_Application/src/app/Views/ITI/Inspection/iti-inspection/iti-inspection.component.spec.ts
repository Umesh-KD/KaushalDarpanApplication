import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIInspectionComponent } from './iti-inspection.component';

describe('ITIInspectionComponent', () => {
  let component: ITIInspectionComponent;
  let fixture: ComponentFixture<ITIInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIInspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
