import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterUserRequestListComponent } from './bter-request-list.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: BterUserRequestListComponent;
  let fixture: ComponentFixture<BterUserRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterUserRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterUserRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
