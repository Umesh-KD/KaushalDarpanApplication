import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSCAMarkingComponent } from './admin-sca-marking.component';

describe('AdminSCAMarkingComponent', () => {
  let component: AdminSCAMarkingComponent;
  let fixture: ComponentFixture<AdminSCAMarkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSCAMarkingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSCAMarkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
