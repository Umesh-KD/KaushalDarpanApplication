import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignApplicationListComponent } from './assign-application-list.component';

describe('AssignApplicationListComponent', () => {
  let component: AssignApplicationListComponent;
  let fixture: ComponentFixture<AssignApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignApplicationListComponent]
    });
    fixture = TestBed.createComponent(AssignApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
