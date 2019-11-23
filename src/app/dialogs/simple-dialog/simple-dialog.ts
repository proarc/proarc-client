export interface SimpleDialogData {
  title: string;
  message: string;
  btn1: SimpleDialogButton;
  btn2?: SimpleDialogButton;
  checkbox?: SimpleDialogCheckbox;
}

export interface SimpleDialogButton {
  color: string;
  label: string;
  value: string;
}

export interface SimpleDialogCheckbox {
  label: string;
  checked: boolean;
}
