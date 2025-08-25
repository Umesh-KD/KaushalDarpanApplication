import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchGroupListComponent } from './dispatch-group-list.component';

describe('DispatchGroupListComponent', () => {
  let component: DispatchGroupListComponent;
  let fixture: ComponentFixture<DispatchGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispatchGroupListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
