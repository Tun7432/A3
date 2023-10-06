import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Users } from 'src/app/model/Users.model';
import { CartService } from 'src/app/services/cart.service';
import { LotteryService } from '../../services/lottery.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
}) 
export class LoginComponent  {
  user = Array<Users>();
  //user: Users[] = [];
  constructor(
    private cartService: CartService,
    private lotteryService: LotteryService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  
  ) {}
    
 

  login(email: string, password: string) {
    if (!email || !password) {
      // ถ้า email หรือ password ไม่ถูกป้อนให้แสดงข้อความแจ้งเตือน
      this.snackBar.open('โปรดกรอกทั้งอีเมลและรหัสผ่าน', 'ปิด', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      
      return;
    }
  
    const data = {
      email: email,
      password: password,
    };
  
    let jsonString = JSON.stringify(data);
  
    // เริ่มแสดง Stunning Loading Animation
 
    // console.log(this.spinner);
    // console.log(NgxSpinnerService);
    // console.error(this.spinner)
    // console.error(NgxSpinnerService)
  
    

this.http.post(this.lotteryService.apiEndpoint + "/login", jsonString).subscribe(
  (response: any) => {
    console.log('เข้าสู่ระบบสำเร็จ:', response);
    console.log(response.user.id);
    this.user = response.user;
    // this.user = user.toUsers(JSON.stringify(data));
    // console.log(this.user);
    if (response.user.role==='admin') {
      this.router.navigate(['/dashboard']);
    } else {
      this.lotteryService.isLoggedIn = true;
      this.lotteryService.setMemberName(response.user.first_name);
      this.cartService.Usersid = response.user.id;
      this.router.navigate(['/member']);
      this.cdr.detectChanges();
      this.snackBar.open('ล็อคอินสำเร็จ', '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }

   
  },
  (error) => {
    console.error('เข้าสู่ระบบไม่สำเร็จ:', error);
    this.snackBar.open('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'ปิด', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

   
  }
);

}
}
  