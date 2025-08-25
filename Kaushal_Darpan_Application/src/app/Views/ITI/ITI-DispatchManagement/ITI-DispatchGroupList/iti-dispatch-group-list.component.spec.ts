import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIDispatchGroupListComponent } from './iti-dispatch-group-list.component';

describe('ITIDispatchGroupListComponent', () => {
  let component: ITIDispatchGroupListComponent;
  let fixture: ComponentFixture<ITIDispatchGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIDispatchGroupListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIDispatchGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
