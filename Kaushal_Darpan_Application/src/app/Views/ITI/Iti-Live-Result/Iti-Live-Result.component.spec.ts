import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiLiveResultComponent } from './Iti-Live-Result.component';

describe('ItiLiveResultComponent', () => {
  let component: ItiLiveResultComponent;
  let fixture: ComponentFixture<ItiLiveResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiLiveResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiLiveResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
