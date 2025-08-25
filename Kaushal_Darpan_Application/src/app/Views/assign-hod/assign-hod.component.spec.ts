import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignHodComponent } from './assign-hod.component';

describe('AssignHodComponent', () => {
  let component: AssignHodComponent;
  let fixture: ComponentFixture<AssignHodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignHodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignHodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
