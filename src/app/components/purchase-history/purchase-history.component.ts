import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Lottery } from 'src/app/model/Lottery.model';
import { Purchase } from 'src/app/model/purchase.model';
import { CartService } from 'src/app/services/cart.service';
import { LotteryService } from 'src/app/services/lottery.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent {
  lotteryResults = Array<Lottery>();
  isMultiple = false;
  lotteriesByNumber = new Array<any>();
  allLotteryResults = Array<Lottery>();
  
  dataSource = new MatTableDataSource<Purchase>([]);
  selectedDate: Date | null = null;

  hasSearchResults: boolean = true;
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


  
  goToSearch() {
    this.router.navigate(['/member']);
  }

  // Function to calculate the total number of items in the cart
calculateTotalItems(): number {
  let totalItems = 0;
  if (this.Results && this.Results.length > 0) {
    totalItems = this.Results.reduce((sum: number, item: any) => sum + item.quantity, 0);
  }
  return totalItems;
}

// Function to calculate the total price of items in the cart
calculateTotalPrice(): number {
  let totalPrice = 0;
  if (this.Results && this.Results.length > 0) {
    totalPrice = this.Results.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  }
  return totalPrice;
}



  
getInputValues(): string {
  let concatenatedValue = '';
  for (let i = 1; i <= 6; i++) {
    const inputElement = document.getElementsByName(
      'input' + (i - 1)
    )[0] as HTMLInputElement;
    if (inputElement) {
      concatenatedValue += inputElement.value;
    }
  }
  return concatenatedValue;
}
  
  resetSearch() {
  // Clear the input fields
  for (let i = 1; i <= 3; i++) {
    const inputElement = document.getElementsByName('input' + (i - 1))[0] as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }

  // Reset the displayed results to the original data
  this.Results = this.allLResults;
}


search(input: string) {
  // Ensure there is input to search for
  if (input.trim() === '') {
    return;
  }

  // Create an array to store the matching lottery results
  const matchingResults = this.allLResults.filter((result: any) => {
    // Extract the ticket number as a string
    const ticketNumber = result.ticket_number.toString();

    // Check if the ticket number includes the input
    return ticketNumber.includes(input);
  });

  // Update the displayed results with the matching ones
  this.Results = matchingResults;

  // If there are no matching results, display a message
  if (matchingResults.length === 0) {
    Swal.fire({
      icon: 'info',
      title: 'No Matching Results',
      text: 'No lottery results match the entered number.',
    });
  }
}



// search(input: string) {
//   this.isMultiple = true;
//   this.lotteriesByNumber = [];
//   const inputArray = input.split(',');

//   const ticketNumbers = inputArray.map((inputItem) =>
//     Number(inputItem.trim())
//   );

//   this.lotteryResults = this.allLotteryResults.filter((lottery) => {
//     const lotteryNumbers = lottery.ticket_number
//       .toString()
//       .split(',')
//       .map(Number);

//     const hasAllNumbers = ticketNumbers.every((number) =>
//       lotteryNumbers.includes(number)
//     );

//     const ticketNumberStrings = ticketNumbers.map((number) =>
//       number.toString()
//     );

//     const startsWithNumber = ticketNumberStrings.some((inputNumber) =>
//       lotteryNumbers.some((lotteryNumber) =>
//         lotteryNumber.toString().startsWith(inputNumber)
//       )
//     );

//     const endsWithNumber = ticketNumberStrings.some((inputNumber) =>
//       lotteryNumbers.some((lotteryNumber) =>
//         lotteryNumber.toString().endsWith(inputNumber)
//       )
//     );

//     return hasAllNumbers || startsWithNumber || endsWithNumber;
//   });

//   // เพิ่มการแจ้งเตือน SweetAlert2 เมื่อไม่พบผลลัพธ์
//   if (this.lotteryResults.length === 0) {
//     Swal.fire({
//       title: 'ไม่พบสลาก',
//       text: 'ไม่พบสลากที่ค้นหา',
//       icon: 'info',
//       confirmButtonText: 'ตกลง'
//     });
//   }
// }

  filterData() {
  if (!this.selectedDate) {
    // Display an error message if no date is selected
    Swal.fire({
      icon: 'info',
      title: 'กรุณาป้อนข้อมูล',
      text: 'โปรดเลือกวันที่ก่อนค้นหา',
    });
    return;
  }

  // Filter the data based on the selected date
  this.Results = this.allLResults.filter((purchase: Purchase) => {
    const purchaseDate = new Date(purchase.created_at);
    return purchaseDate.toDateString() === this.selectedDate!.toDateString();
  });

  // Update the 'hasSearchResults' flag
  this.hasSearchResults = this.Results.length > 0;

  // Show an error message if no results are found
  if (!this.hasSearchResults) {
    Swal.fire({
      icon: 'info',
      title: 'ไม่พบผลลัพธ์',
      text: 'ไม่พบผลลัพธ์ที่ตรงกับคำค้นหาของคุณ',
    });
  }
}

}
