import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteDetailComponent } from './institute-detail.component';

describe('InstituteDetailComponent', () => {
  let component: InstituteDetailComponent;
  let fixture: ComponentFixture<InstituteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstituteDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
