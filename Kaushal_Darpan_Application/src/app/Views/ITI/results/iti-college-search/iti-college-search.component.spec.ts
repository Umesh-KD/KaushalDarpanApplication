import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCollegeSearchComponent } from './iti-college-search.component';

describe('ItiCertificateComponent', () => {
  let component: ItiCollegeSearchComponent;
  let fixture: ComponentFixture<ItiCollegeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiCollegeSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCollegeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
