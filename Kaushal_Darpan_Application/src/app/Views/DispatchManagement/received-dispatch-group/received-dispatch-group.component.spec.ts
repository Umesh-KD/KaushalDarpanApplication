import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedDispatchGroupComponent } from './received-dispatch-group.component';

describe('ReceivedDispatchGroupComponent', () => {
  let component: ReceivedDispatchGroupComponent;
  let fixture: ComponentFixture<ReceivedDispatchGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceivedDispatchGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedDispatchGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
