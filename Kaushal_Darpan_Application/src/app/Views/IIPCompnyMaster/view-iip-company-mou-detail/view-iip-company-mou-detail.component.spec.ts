import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIipCompanyMouDetailComponent } from './view-iip-company-mou-detail.component';

describe('ViewIipCompanyMouDetailComponent', () => {
  let component: ViewIipCompanyMouDetailComponent;
  let fixture: ComponentFixture<ViewIipCompanyMouDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewIipCompanyMouDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIipCompanyMouDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
