import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDeficiencyComponent } from './upload-deficiency.component';

describe('UploadDeficiencyComponent', () => {
  let component: UploadDeficiencyComponent;
  let fixture: ComponentFixture<UploadDeficiencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDeficiencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDeficiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
