import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionMasterComponent } from './sanction-master.component';

describe('SanctionMasterComponent', () => {
  let component: SanctionMasterComponent;
  let fixture: ComponentFixture<SanctionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SanctionMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
