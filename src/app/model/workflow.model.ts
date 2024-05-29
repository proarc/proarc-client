export interface WorkFlowProfileSubjob {
  disabled: boolean,
  hint: string,
  name: string,
  title: string
}

export interface WorkFlowMaterial {
  id: number,
  jobId: number,
  label: string,
  name: string,
  pid?: string,
  profileLabel: string,
  type: string
}

export class WorkFlow {
  barcode: string;
  created: Date;
  field001: string;
  financed: string;
  id: number;
  label: string;
  model: string;
  modified: Date;
  ownerId: number;
  pid: string;
  priority: number;
  profileHint: string;
  profileLabel: string;
  profileName: string;
  rawPath: string;
  sigla: string;
  signature: string;
  state: string;
  taskDate: Date
  taskHint: string;
  taskLabel: string;
  taskName: string;
  taskUser: string;
  taskUsername: string;
  timestamp: Date
  year: string;
  parentId?: number;
}

export class WorkFlowProfile {
  disabled: boolean;
  hint: string;
  model: { disabled: boolean, name: string, title: string }[];
  name: string;
  subjob: WorkFlowProfileSubjob[];
  task: { disabled: boolean, hint: string, name: string, title: string }[];
  title: string;
}