import { Component, OnInit, HostBinding } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { FactionsService } from '../../services/factions.service';
import { SystemsService } from '../../services/systems.service';
import { FDevIDs } from '../../utilities/fdevids';
import { EBGSUser, EBGSFactionV3Schema, EBGSSystemChart } from '../../typings';
import * as moment from 'moment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    isAuthenticated: boolean;
    user: EBGSUser;
    factions: EBGSFactionV3Schema[] = [];
    systems: EBGSSystemChart[] = [];
    factionModal: boolean;
    systemModal: boolean;
    constructor(
        private authenticationService: AuthenticationService,
        private factionsService: FactionsService,
        private systemsService: SystemsService,
        private titleService: Title
    ) {
        this.titleService.setTitle('Elite BGS');
    }

    ngOnInit(): void {
        this.getAuthentication();
    }

    getAuthentication() {
        this.authenticationService
            .isAuthenticated()
            .subscribe(status => {
                this.isAuthenticated = status;
                if (this.isAuthenticated) {
                    this.getUser();
                } else {
                    this.user = {} as EBGSUser;
                    this.factions = [];
                    this.systems = [];
                }
            });
    }

    getUser() {
        this.authenticationService
            .getUser()
            .subscribe(user => {
                this.user = user;
                this.getFactions();
                this.getSystems();
            });
    }

    async getFactions() {
        const factionList = this.user.factions.map(faction => {
            return faction.name;
        });

        const factionData = await this.factionsService.parseFactionDataName(factionList);
        this.factions = factionData;
        this.factions.forEach(faction => {
            faction.faction_presence.forEach(system => {
                system.state = FDevIDs.state[system.state].name;
                system.pending_states.forEach(state => {
                    state.state = FDevIDs.state[state.state].name;
                });
                system.recovering_states.forEach(state => {
                    state.state = FDevIDs.state[state.state].name;
                });
            });
        });
    }

    async getSystems() {
        const systemList = this.user.systems.map(system => {
            return system.name;
        });

        const systemData = await this.systemsService.parseSystemDataName(systemList);
        this.systems = systemData;
        this.systems.forEach(system => {
            system.state = FDevIDs.state[system.state].name;
            system.factions.forEach(faction => {
                faction.state = FDevIDs.state[faction.state].name;
                faction.pending_states.forEach(state => {
                    state.state = FDevIDs.state[state.state].name;
                });
                faction.recovering_states.forEach(state => {
                    state.state = FDevIDs.state[state.state].name;
                });
                if (faction.name_lower === system.controlling_minor_faction) {
                    system.controlling_faction = faction;
                }
            });
        });
    }

    getUpdatedAtFormatted(updatedAt) {
        return {
            time: moment(updatedAt).utc().format('ddd, MMM D, HH:mm:ss'),
            fromNow: moment(updatedAt).fromNow(true),
            ageFlag: moment(Date.now()).diff(moment(updatedAt), 'days', true) - 1
        }
    }

    openFactionAddModal() {
        this.factionModal = true;
    }

    closeFactionAddModal() {
        this.factionModal = false;
    }

    openSystemAddModal() {
        this.systemModal = true;
    }

    closeSystemAddModal() {
        this.systemModal = false;
    }
}
