import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchGroupRevalListComponent } from './dispatch-group-reval-list.component';

describe('DispatchGroupListComponent', () => {
  let component: DispatchGroupRevalListComponent;
  let fixture: ComponentFixture<DispatchGroupRevalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispatchGroupRevalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchGroupRevalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
