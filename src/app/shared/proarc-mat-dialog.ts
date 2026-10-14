import { Component, inject, Injectable, OnInit, signal, TemplateRef, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { UserSettings, UserSettingsService } from './user-settings';

@Injectable({ providedIn: 'root' })
export class ProarcMatDialog extends MatDialog {

  //settings = inject<UserSettings>(UserSettings);

  dialogPos: any = {};

  override open<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {


    const currentConfig = {...config};
    let componentName = '';

    if (componentOrTemplateRef instanceof Type) {
      componentName = componentOrTemplateRef.name;

      const savedPosition = this.dialogPos?.[componentName];
      if (savedPosition) {
        currentConfig.position = {left: savedPosition.left +'px', top: savedPosition.top +'px', };
        if (componentName !== '_LogDialogComponent') {
          currentConfig.width = savedPosition.width + 'px';
          currentConfig.height = savedPosition.height + 'px';
          currentConfig.maxWidth = undefined;
        }
      }
    }

    // Voláme původní metodu open z MatDialog
    const dialogRef = super.open(componentOrTemplateRef, currentConfig);

    if (componentName) {
      dialogRef.beforeClosed().subscribe(() => {

        const dialogElement = document.getElementById(dialogRef.id);

        if (dialogElement) {
          let rect = dialogElement.getBoundingClientRect();

          // Pokud je to draggable, bereme potomek
          const ch = dialogElement.querySelector('.mat-mdc-dialog-surface');
          if (ch) {
            rect = ch.getBoundingClientRect();
          }
          this.dialogPos[componentName] = rect;
        }


      });
    }

    return dialogRef;
  }
}
