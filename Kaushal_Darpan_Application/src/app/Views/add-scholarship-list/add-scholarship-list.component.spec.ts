import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScholarshipListComponent } from './add-scholarship-list.component';

describe('AddScholarshipListComponent', () => {
  let component: AddScholarshipListComponent;
  let fixture: ComponentFixture<AddScholarshipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddScholarshipListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddScholarshipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
