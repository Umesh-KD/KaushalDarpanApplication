import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterObserverComponent } from './center-observer.component';

describe('CenterObserverComponent', () => {
  let component: CenterObserverComponent;
  let fixture: ComponentFixture<CenterObserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterObserverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterObserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
