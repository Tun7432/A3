import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LotteryService } from 'src/app/services/lottery.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  response: any;
  email: string = '';
  emailIsValid(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }


  constructor(
    private data: LotteryService,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  add(
    email: string,
    password: string,
    prefix: string,
    first_name: string,
    last_name: string,
    birthdate: string,
    phone_number: string
  ) {
    // ตรวจสอบความถูกต้องของข้อมูล
    if (
      !email ||
      !password ||
      !prefix ||
      !first_name ||
      !last_name ||
      !birthdate ||
      !phone_number ||
      !this.emailIsValid(email)
    ) {
      this.snackBar.open('กรุณากรอกข้อมูลให้ครบถ้วน', 'ปิด', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    let jsonObj = {
      email: email,
      password: password,
      prefix: prefix,
      first_name: first_name,
      last_name: last_name,
      birthdate: birthdate,
      phone_number: phone_number
    };

    let jsonString = JSON.stringify(jsonObj);

    this.http
    .post(this.data.apiEndpoint + '/users', jsonString, { observe: 'response' })
    .subscribe(
      (response) => {
        console.log(response);
        console.log(JSON.stringify(response.status));
        console.log(JSON.stringify(response.body));
        if (response.status === 201) {
          this.router.navigate(['/member']);
          this.snackBar.open('สมัครสมาชิกสำเร็จ', '', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        } else if (response.status === 409) {
          // ถ้าอีเมลซ้ำในระบบ
          this.snackBar.open('อีเมลซ้ำในระบบ', 'ปิด', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการส่งคำขอ:', error);

        // แสดงข้อความแจ้งเตือนถ้าเกิดข้อผิดพลาด
        this.snackBar.open('เกิดข้อผิดพลาดในการส่งคำขอ', 'ปิด', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    );
}
}
  
    
  
 
