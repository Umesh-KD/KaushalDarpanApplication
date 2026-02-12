import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTECommitteeAssignComponent } from './dte-committee-assign.component';

describe('DTECommitteeAssignComponent', () => {
  let component: DTECommitteeAssignComponent;
  let fixture: ComponentFixture<DTECommitteeAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DTECommitteeAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DTECommitteeAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
