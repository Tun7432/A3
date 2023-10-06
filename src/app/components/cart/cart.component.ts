import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Lottery } from 'src/app/model/Lottery.model';
import { CartService } from 'src/app/services/cart.service';
import { LotteryService } from 'src/app/services/lottery.service';

import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  [x: string]: any;
  cartItems: Lottery[] = [];
  
  constructor(private cartService: CartService, private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,private data: LotteryService,
    private http: HttpClient,     ) {}

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
  confirmCart() {
  const snackBarRef = this.snackBar.open('ยืนยันการซื้อ', 'ยืนยัน', {
    duration: 5000, // Show the message for 5 seconds
  });

    snackBarRef.afterDismissed().subscribe(() => {
   this.add();
this.cartService.clearCart();
    // Redirect to a new page or perform any other action after the snackbar is dismissed
    this.router.navigate(['/member']);
  });
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
  
//   add() {
//   // Check if the cart is not empty
//   if (this.cartItems.length === 0) {
//     this.snackBar.open('Your cart is empty.', 'Close', {
//       duration: 2000,
//     });
//     return;
//   }

//   // Prepare the data to be added to the database
//   const dataToAdd = this.cartItems.map((item) => {
//     return {
    
//   user_id: this.cartService.Usersid,
//   ticket_number: item.ticket_number,
//   period: item.period,
//   set_number: item.set_number,
//   price: item.price,
//   quantity: item.quantity


//     };
//   });
//     console.log(dataToAdd);
//   // Send a POST request to the server to add data to the database
//   this.http
//     .post(this.data.apiEndpoint + '/purchase', { items: dataToAdd })
//     .subscribe(
//       (response) => {
//         // Handle a successful response (e.g., show a success message)
//         console.log('Data added to the database:', response);
//         this.router.navigate(['/member']);
//         this.snackBar.open('Items added to the database successfully.', '', {
//           duration: 4000,
//           horizontalPosition: 'center',
//           verticalPosition: 'top',
//         });
//       },
//       (error) => {
//         // Handle an error response (e.g., show an error message)
//         console.error('Error adding data to the database:', error);
//         this.snackBar.open('Error adding items to the database.', 'Close', {
//           duration: 2000,
//           horizontalPosition: 'center',
//           verticalPosition: 'top',
//         });
//       }
//     );
// }
add() {
  // Check if the cart is not empty
  if (this.cartItems.length === 0) {
    this.snackBar.open('Your cart is empty.', 'Close', {
      duration: 2000,
    });
    return;
  }

  // Prepare the data to be added to the database
  const orderDetails = this.cartItems.map((item) => ({
    lot_id: item.id, // Assuming you have a 'lot_id' property in your cart items
    amount: item.quantity,
    price: item.price,
    total_price: (item.quantity || 0) * item.price,
  }));

 
//   user_id: this.cartService.Usersid,
//   ticket_number: item.ticket_number,
//   period: item.period,
//   set_number: item.set_number,
//   price: item.price,
//   quantity: item.quantity

  const grandTotal = orderDetails.reduce((total, item) => total + item.total_price, 0);
  
  const orderData = {
    ac_id: this.cartService.Usersid,
    grand_total: grandTotal, // Assuming you have 'totalPrice' calculated
    quantity: this.calculateTotalItems(),
    details: orderDetails,
  };

  console.log(orderData);

  // Send a POST request to the server to add data to the database
  this.http
    .post(this.data.apiEndpoint +'/lottery/buy', orderData, {
      observe: 'response',
    })
    .subscribe(
      (response) => {
        console.log(JSON.stringify(response.status));
        console.log(JSON.stringify(response.body));





      },
      (error) => {
       
        console.error('Error placing the order:', error);

        
      }
    );
}


}

