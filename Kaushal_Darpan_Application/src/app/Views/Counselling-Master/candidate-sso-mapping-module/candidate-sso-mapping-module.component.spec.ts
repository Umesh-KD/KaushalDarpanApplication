import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSsoMappingModuleComponent } from './candidate-sso-mapping-module.component';

describe('CandidateSsoMappingModuleComponent', () => {
  let component: CandidateSsoMappingModuleComponent;
  let fixture: ComponentFixture<CandidateSsoMappingModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateSsoMappingModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateSsoMappingModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
