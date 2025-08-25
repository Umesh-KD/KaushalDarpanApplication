import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeMasterComponent } from './college-master.component';

describe('CollegeMasterComponent', () => {
  let component: CollegeMasterComponent;
  let fixture: ComponentFixture<CollegeMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollegeMasterComponent]
    });
    fixture = TestBed.createComponent(CollegeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
