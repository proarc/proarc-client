export interface SimpleDialogData {
  title: string;
  message: string;
  btn1: SimpleDialogButton;
  btn2?: SimpleDialogButton;
}

export interface SimpleDialogButton {
  color: string;
  label: string;
  value: string;
}
