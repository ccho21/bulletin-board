import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogginPopupComponent } from './loggin-popup.component';

describe('LogginPopupComponent', () => {
  let component: LogginPopupComponent;
  let fixture: ComponentFixture<LogginPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogginPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogginPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
