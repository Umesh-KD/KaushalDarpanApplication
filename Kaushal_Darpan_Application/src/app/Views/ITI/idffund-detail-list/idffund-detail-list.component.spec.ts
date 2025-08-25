import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IDFFundDetailListComponent } from './idffund-detail-list.component';

describe('IDFFundDetailListComponent', () => {
  let component: IDFFundDetailListComponent;
  let fixture: ComponentFixture<IDFFundDetailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IDFFundDetailListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IDFFundDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
