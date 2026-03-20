import { ComponentFixture, TestBed } from '@angular/core/testing';

import { itiAddNodelUserComponent } from './iti-Add-Nodel-User.component';  

describe('itiAddNodelUserComponent', () => {
  let component: itiAddNodelUserComponent;
  let fixture: ComponentFixture<itiAddNodelUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [itiAddNodelUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(itiAddNodelUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
