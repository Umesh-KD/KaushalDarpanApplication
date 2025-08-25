import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCollegeUpdateComponent } from './iti-college-update.component';

describe('ItiCollegeUpdateComponent', () => {
  let component: ItiCollegeUpdateComponent;
  let fixture: ComponentFixture<ItiCollegeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiCollegeUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCollegeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
