import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  constructor(private dialog: MatDialog, private router: Router) {}
  refreshPage() {
    window.location.reload();
  }
  dashboard() {
    const dialogRef = this.dialog.open(MyDialogComponent, {
      width: '250px',
      data: 'กรุณาสมัครสมาชิกก่อนเข้าใช้งาน'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      // นำไปยังหน้า login
      this.router.navigate(['/login']);
    });
  }
  account_login() {
    const dialogRef = this.dialog.open(MyDialogComponent, {
      width: '250px',
      data: 'กรุณาสมัครสมาชิกก่อนเข้าใช้งาน'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      // นำไปยังหน้า login
      this.router.navigate(['/login']);
    });
  }
}
