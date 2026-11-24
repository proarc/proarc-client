import { Injectable } from "@angular/core";
import { Device } from "../../model/device.model";
import { User } from "../../model/user.model";
import { WorkFlowProfile } from "../../model/workflow.model";
import { ApiService } from "../../services/api.service";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin } from "rxjs";
import { Configuration } from "../../shared/configuration";

@Injectable()
export class WfConfiguration {

    constructor(
        private translator: TranslateService,
        private config: Configuration,
        private api: ApiService
    ) { }

    states = [
        { code: 'OPEN', value: 'Otevřený' },
        { code: 'FINISHED', value: 'Hotový' },
        { code: 'READY', value: 'Připraven' },
        { code: 'STARTED', value: 'Probíhá' },
        { code: 'CANCELED', value: 'Zrušený' },
    ]

    priorities = [
        { code: 1, value: 'Spěchá' },
        { code: 2, value: 'Normální' },
        { code: 3, value: 'Nízká' },
        { code: 4, value: 'Odloženo' },
    ]

    inited = false;


    allTasks: any[];
    profiles: WorkFlowProfile[];
    devices: Device[];
    users: User[];
    lists: { [field: string]: { code: string, value: string }[] } = {};

    getWorkflowProfiles(callback: Function) {
        
        this.allTasks = this.config.getValueMap('proarc.workflow.tasks');
        const profileNames = this.config.getValueMap('proarc.workflow.tasks');
        const rUsers = this.api.getUsers();
        const rProfiles = this.api.getWorkflowProfiles();
        const rDevices = this.api.getDevices();
        forkJoin([rUsers, rProfiles, rDevices]).subscribe(([users, profiles, devices]: [User[], any, Device[]]) => {
            this.users = users;

            if (profiles['response'].errors) {
                //this.ui.showErrorDialogFromObject(profiles['response'].errors);
                return;
            }
            this.profiles = profiles.response.data;
            this.devices = devices;
            this.lists['model'] = this.config.models.map((p: string) => { return { code: p, value: this.translator.instant('model.' + p) } });
            this.lists['taskUser'] = this.users.map(p => { return { code: p.userId + '', value: p.name } });
            this.lists['state'] = this.states.map(p => { return { code: p.code, value: p.value } });
            this.lists['ownerId'] = this.users.map(p => { return { code: p.userId + '', value: p.name } });
            this.lists['priority'] = this.priorities.map(p => { return { code: p.code + '', value: p.value } });
            this.lists['profileName'] = [...this.profiles.map(p => { return { code: p.name + '', value: p.title } })
                , ...profileNames.map(p => { return { code: p.name + '', value: p.title } })
            ];

            //this.lists['profileName'] = profileNames.map(p => { return { code: p.name + '', value: p.title } });

            this.lists['deviceId'] = this.devices.map(p => { return { code: p.id + '', value: p.label } });
            this.lists['taskName'] = this.allTasks.map(p => { return { code: p.name + '', value: p.title } });
            this.inited = true;
            callback();
        });
    }

}