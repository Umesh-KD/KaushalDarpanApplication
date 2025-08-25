import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIDispatchAddGroupCodeComponent } from './ITI-Dispatch-AddGroupCode.component';

describe('ITIDispatchAddGroupCodeComponent', () => {
  let component: ITIDispatchAddGroupCodeComponent;
  let fixture: ComponentFixture<ITIDispatchAddGroupCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ITIDispatchAddGroupCodeComponent]
    });
    fixture = TestBed.createComponent(ITIDispatchAddGroupCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
