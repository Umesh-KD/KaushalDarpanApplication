import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DTEPublicInfoTabsComponent } from './dtepublic-info-tabs.component';

describe('DTEPublicInfoTabsComponent', () => {
  let component: DTEPublicInfoTabsComponent;
  let fixture: ComponentFixture<DTEPublicInfoTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DTEPublicInfoTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DTEPublicInfoTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
