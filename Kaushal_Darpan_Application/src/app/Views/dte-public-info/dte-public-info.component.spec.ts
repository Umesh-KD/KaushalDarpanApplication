import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEPublicInfoComponent } from './dte-public-info.component';

describe('DTEPublicInfoComponent', () => {
  let component: DTEPublicInfoComponent;
  let fixture: ComponentFixture<DTEPublicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DTEPublicInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DTEPublicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
