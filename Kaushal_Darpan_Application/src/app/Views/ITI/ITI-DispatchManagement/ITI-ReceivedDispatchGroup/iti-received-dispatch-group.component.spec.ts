import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIReceivedDispatchGroupComponent } from './iti-received-dispatch-group.component';

describe('ITIReceivedDispatchGroupComponent', () => {
  let component: ITIReceivedDispatchGroupComponent;
  let fixture: ComponentFixture<ITIReceivedDispatchGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIReceivedDispatchGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIReceivedDispatchGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
