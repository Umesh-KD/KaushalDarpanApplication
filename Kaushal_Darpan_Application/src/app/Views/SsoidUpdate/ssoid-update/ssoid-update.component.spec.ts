import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsoidUpdateComponent } from './ssoid-update.component';

describe('SsoidUpdateComponent', () => {
  let component: SsoidUpdateComponent;
  let fixture: ComponentFixture<SsoidUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SsoidUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SsoidUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
