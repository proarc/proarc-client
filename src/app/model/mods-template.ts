export interface ModsTemplate {
    [key: string]: ModsFieldTemplate;
}

type ModsUsage = 'R' | 'M' | 'MA';

export interface ModsFieldTemplate {
    _include?: string;
    usage: ModsUsage;
    required?: boolean,
    label: string;
    selector: string;
    labelKey: string;
    description: string;
    options?: [string, string][];
    cols?: number;
    help?: string;
    expanded?: boolean;
    isElectronicArticle?: boolean;
    attributes?: {[field: string] : ModsFieldTemplate};
    fields?: {[field: string] : ModsFieldTemplate};
}
