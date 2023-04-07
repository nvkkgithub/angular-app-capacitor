import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PluginListenerHandle } from '@capacitor/core';
import { Network, ConnectionStatus} from '@capacitor/network';
import { BatteryInfo, Device, DeviceInfo } from '@capacitor/device';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  deviceInformation: DeviceInfo | any = {}
  batteryInformation: BatteryInfo | any = {}
  networkStatus: ConnectionStatus | any;
  networkListener: PluginListenerHandle | any;

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router) {}

  async ngOnInit() {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.networkListener = Network.addListener('networkStatusChange', status => {
      console.log('HomePage.Network status changed', JSON.stringify(status));
      this.networkStatus = status
    });
    this.networkStatus = await Network.getStatus();
    console.log('HomePage.Network status:', JSON.stringify(this.networkStatus));

    const info = await Device.getBatteryInfo();
    console.log(info);
    this.batteryInformation = info;
    
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
