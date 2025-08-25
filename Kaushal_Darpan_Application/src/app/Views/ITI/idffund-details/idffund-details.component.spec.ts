import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IDFFundDetailsComponent } from './idffund-details.component';

describe('IDFFundDetailsComponent', () => {
  let component: IDFFundDetailsComponent;
  let fixture: ComponentFixture<IDFFundDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IDFFundDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IDFFundDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
