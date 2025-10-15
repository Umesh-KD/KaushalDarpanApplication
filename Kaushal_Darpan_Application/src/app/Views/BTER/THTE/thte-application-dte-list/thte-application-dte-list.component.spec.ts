import { ComponentFixture, TestBed } from '@angular/core/testing';

import { THTEApplicationDteListComponent } from './thte-application-dte-list.component';

describe('THTEApplicationDteListComponent', () => {
  let component: THTEApplicationDteListComponent;
  let fixture: ComponentFixture<THTEApplicationDteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [THTEApplicationDteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(THTEApplicationDteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
