export interface SimpleDialogData {
  title: string;
  message?: string;
  alertClass?: string;
  btn1: SimpleDialogButton;
  btn2?: SimpleDialogButton;
  checkboxes?: SimpleDialogCheckbox[];
  numberInput?: SimpleDialogNumberInput;
  textInput?: SimpleDialogTextInput;
  width?: number;
  textAreaInput?: SimpleDialogTextInput;
  rows?: number;
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

export interface SimpleDialogTextInput {
  label: string;
  value: string;
}

export interface SimpleDialogNumberInput {
  label: string;
  value: number;
  min: number;
  max: number;
}
