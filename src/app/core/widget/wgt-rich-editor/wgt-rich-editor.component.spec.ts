import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WgtRichEditorComponent } from './wgt-rich-editor.component';

describe('WgtRichEditorComponent', () => {
  let component: WgtRichEditorComponent;
  let fixture: ComponentFixture<WgtRichEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WgtRichEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WgtRichEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
