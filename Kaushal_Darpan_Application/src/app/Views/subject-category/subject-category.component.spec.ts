import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCategoryComponent } from './subject-category.component';

describe('SubjectCategoryComponent', () => {
  let component: SubjectCategoryComponent;
  let fixture: ComponentFixture<SubjectCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectCategoryComponent]
    });
    fixture = TestBed.createComponent(SubjectCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
