import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WgtUploadTaskComponent } from './wgt-upload-task.component';

describe('WgtUploadTaskComponent', () => {
  let component: WgtUploadTaskComponent;
  let fixture: ComponentFixture<WgtUploadTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WgtUploadTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WgtUploadTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
