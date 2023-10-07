import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Lottery } from 'src/app/model/Lottery.model';
import { CartService } from 'src/app/services/cart.service';
import { LotteryService } from 'src/app/services/lottery.service';


@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent {

  cartItems: Lottery[] = [];
  id = this.cartService.Usersid;
  // allResults: string | undefined;
  Results: any;
  allLResults: any;
  constructor(private cartService: CartService, private router: Router,
    private snackBar: MatSnackBar,
        private http: HttpClient,
public data: LotteryService,
    private dialog: MatDialog) {
    console.log(this.id);
     this.http.get(this.data.apiEndpoint + "/purchase/" + this.id).subscribe(
      (response) => {
        console.log("สถานะการอัปเดตข้อมูล: " + response);
         console.log("ผลการอัปเดตข้อมูล: " + JSON.stringify(response));
         this.allLResults = response;
this.Results = this.allLResults;

         console.log(this.Results);
         
      },
      (error) => {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล: " + JSON.stringify(error));
      }
    );
    
  }

  ngOnInit() {
    this.cartService.getItems().subscribe((items) => {
      this.cartItems = items;
    });
  }
  
  removeFromCart(lottery: Lottery) {
    const config = new MatSnackBarConfig();
    config.duration = 5000; // ระยะเวลาที่ snackBar แสดง (ms)
    config.panelClass = ['custom-snackbar']; // คลาส CSS สำหรับ snackBar
    
    const snackBarRef = this.snackBar.open('คุณแน่ใจหรือไม่ที่ต้องการลบสลากนี้ออกจากตะกร้า?', 'ยืนยัน', config);
  
    snackBarRef.onAction().subscribe(() => {
      this.cartService.clearSpecificLottery(lottery);
      console.log(lottery);
    });
  }
  
  
  
  clearCart() {
    const snackBarRef = this.snackBar.open('คุณต้องการลบทั้งหมดใช่หรือไม่?', 'ยืนยัน', {
      duration: 5000, // ระยะเวลาในการแสดง Snackbar (5 วินาที)
    });

    snackBarRef.onAction().subscribe(() => {
      // ถ้าผู้ใช้คลิกที่ปุ่ม "ยืนยัน"
      // ให้เรียกใช้งานเมธอด clearCart() หรือสิ่งที่คุณต้องการทำเมื่อต้องการลบทั้งหมด
      this.clearCartConfirmed();
    });
  }
  clearCartConfirmed() {
 
    this.cartService.clearCart();
    console.log("ลบทั้งหมด",this.cartService)
  }

  getCartBadgeCount(lottery: Lottery): number {
    const existingLottery = this.cartItems.find(
      (item) => item.ticket_number === lottery.ticket_number
    );
    return existingLottery ? existingLottery.quantity || 0 : 0;
  }
  
  goToSearch() {
    this.router.navigate(['/member']);
  }

  calculateTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      if (item.quantity !== undefined) {
        return total + (item.price * item.quantity);
      } else {
        return total;
      }
    }, 0);
  }
  
  calculateTotalItems(): number {
    return this.cartItems.reduce((total, item) => {
      if (item.quantity !== undefined) {
        return total + item.quantity;
      } else {
        return total;
      }
    }, 0);
  }
  
  

  incrementQuantity(lottery: Lottery) {
    const existingLottery = this.cartItems.find(
      (item) => item.ticket_number === lottery.ticket_number
    );
  
    if (existingLottery && existingLottery.quantity) {
      existingLottery.quantity += 1;
      console.log(`เพิ่มสลาก ${existingLottery.ticket_number} ในตะกร้า: ${existingLottery.quantity}`);
    } else if (existingLottery) {
      existingLottery.quantity = 1;
      console.log(`เพิ่มสลาก ${existingLottery.ticket_number} ในตะกร้า: 1`);
    }
  }
  
 
decrementQuantity(lottery: Lottery) {
  const existingLottery = this.cartItems.find(
    (item) => item.ticket_number === lottery.ticket_number
  );

  if (existingLottery && existingLottery.quantity && existingLottery.quantity > 1) {
    existingLottery.quantity -= 1;
    if (existingLottery) {
      console.log(`ลดจำนวนสลาก ${existingLottery.ticket_number} ในตะกร้า: ${existingLottery.quantity}`);
    }
  } else if (existingLottery) {
    // ถ้ามีแค่ 1 ใบให้ไม่ทำอะไร
  }
}
}
