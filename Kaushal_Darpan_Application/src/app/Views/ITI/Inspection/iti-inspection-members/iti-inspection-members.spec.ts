import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIInspectionMembersComponent } from './iti-inspection-members.component';

describe('ITIInspectionMembersComponent', () => {
  let component: ITIInspectionMembersComponent;
  let fixture: ComponentFixture<ITIInspectionMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIInspectionMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIInspectionMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
