import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentVisiblityConfigurationComponent } from './content-visiblity-configuration.component';

describe('ContentVisiblityConfigurationComponent', () => {
  let component: ContentVisiblityConfigurationComponent;
  let fixture: ComponentFixture<ContentVisiblityConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentVisiblityConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentVisiblityConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
