import { ComponentFixture, TestBed } from '@angular/core/testing';

import { downloadITIResultComponent } from './download-ITI-Result.component';

describe('downloadITIResultComponent', () => {
  let component: downloadITIResultComponent;
  let fixture: ComponentFixture<downloadITIResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [downloadITIResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(downloadITIResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
