import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenqueryDetailsComponent } from './citizenquery-details.component';

describe('CitizenqueryDetailsComponent', () => {
  let component: CitizenqueryDetailsComponent;
  let fixture: ComponentFixture<CitizenqueryDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CitizenqueryDetailsComponent]
    });
    fixture = TestBed.createComponent(CitizenqueryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
