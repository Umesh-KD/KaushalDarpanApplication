import { ComponentFixture, TestBed } from '@angular/core/testing';

import { itiNodelUserListComponent } from './iti-Nodel-User-List.component';  ///

describe('itiNodelUserListComponent', () => {
  let component: itiNodelUserListComponent;
  let fixture: ComponentFixture<itiNodelUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [itiNodelUserListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(itiNodelUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
