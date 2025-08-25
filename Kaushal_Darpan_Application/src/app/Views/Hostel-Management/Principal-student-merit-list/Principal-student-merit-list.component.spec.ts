import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalstudentmeritlistComponent } from './Principal-student-merit-list.component';

describe('StudentRequestListComponent', () => {
  let component: PrincipalstudentmeritlistComponent;
  let fixture: ComponentFixture<PrincipalstudentmeritlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrincipalstudentmeritlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalstudentmeritlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
