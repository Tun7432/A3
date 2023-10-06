import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Lottery, Convert as lotteryCvt } from 'src/app/model/Lottery.model';
import { LotteryService } from 'src/app/services/lottery.service';
import { LotteryDetailComponent } from '../lottery-detail/lottery-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart.service'; 
import { Router } from '@angular/router';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lottery-search',
  templateUrl: './lottery-search.component.html',
  styleUrls: ['./lottery-search.component.css'],
 
})
export class LotterySearchComponent {
  lotteryResults = Array<Lottery>();
  isMultiple = false;
  lotteriesByNumber = new Array<any>();
  allLotteryResults = Array<Lottery>();
  selectedLotteries: Lottery[] = [];
  period = ''; // ตัวแปร period เพื่อเก็บค่างวดที่ถูกเลือก
  periodList: number[] = []; // ตัวแปร periodList เพื่อเก็บรายการงวดทั้งหมด
  selectedPeriod: number | null = null; // กำหนดให้มีค่าเริ่มต้นเป็น null
  set_number = '';
  set_numberList:number[]=[];

  constructor(
   public lotteryService: LotteryService,
    private http: HttpClient,
    private dialog: MatDialog,
    private cartService: CartService,
    private router : Router,
    private snackBar:MatSnackBar
  ) {
  
    http.get(lotteryService.apiEndpoint + '/lottery').subscribe((data: any) => {
      this.allLotteryResults = lotteryCvt.toLottery(JSON.stringify(data));
      this.lotteryResults = this.allLotteryResults;
      this.isMultiple = this.lotteryService.isMultiple;
      this.lotteriesByNumber = this.lotteryService.lotteriesByNumber;
       // ดึงรายการงวดทั้งหมดและกำหนดให้กับ periodList
       this.periodList = [...new Set(this.allLotteryResults.map((lottery) => lottery.period))];
       this.set_numberList = [...new Set(this.allLotteryResults.map((lottery) => lottery.set_number))];
    });
  }
  onPeriodSelect() {
    // เรียกฟังก์ชันที่ค้นหาสลากโดยใช้งวดที่ถูกเลือก
    this.selectByPeriod();
  }
  
  selectByPeriod() {
    
    if (typeof this.period === 'string' && this.period.trim() !== '') {
      const selectedPeriod = parseInt(this.period, 10);
      this.lotteryResults = this.allLotteryResults.filter(
        (lottery) => lottery.period === selectedPeriod
      );
    } else {
      // ถ้าไม่ได้เลือกงวดหรือเลือกงวดว่างเปล่า ให้แสดงทุกสลาก
      this.lotteryResults = this.allLotteryResults;
    }
  }
  onSet_numberSelect() {
    // เรียกฟังก์ชันที่ค้นหาสลากโดยใช้งวดที่ถูกเลือก
    this.selectBySet_number();
  }
  
  selectBySet_number() {
    if (typeof this.set_number === 'string' && this.set_number.trim() !== '') {
      const selectedSet_number = parseInt(this.set_number, 10);
      this.lotteryResults = this.allLotteryResults.filter(
        (lottery) => lottery.set_number === selectedSet_number
      );
    } else {
      // ถ้าไม่ได้เลือกงวดหรือเลือกงวดว่างเปล่า ให้แสดงทุกสลาก
      this.lotteryResults = this.allLotteryResults;
    }
  }
  
  openLotteryDetailDialog(lottery: Lottery): void {
    const dialogRef = this.dialog.open(LotteryDetailComponent, {
      width: '400px',
      data: lottery,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog was closed');
    });
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
  

  
  
  search(input: string) {
    this.isMultiple = true;
    this.lotteriesByNumber = [];
    const inputArray = input.split(',');

    const ticketNumbers = inputArray.map((inputItem) =>
      Number(inputItem.trim())
    );

    this.lotteryResults = this.allLotteryResults.filter((lottery) => {
      const lotteryNumbers = lottery.ticket_number
        .toString()
        .split(',')
        .map(Number);

      const hasAllNumbers = ticketNumbers.every((number) =>
        lotteryNumbers.includes(number)
      );

      const ticketNumberStrings = ticketNumbers.map((number) =>
        number.toString()
      );

      const startsWithNumber = ticketNumberStrings.some((inputNumber) =>
        lotteryNumbers.some((lotteryNumber) =>
          lotteryNumber.toString().startsWith(inputNumber)
        )
      );

      const endsWithNumber = ticketNumberStrings.some((inputNumber) =>
        lotteryNumbers.some((lotteryNumber) =>
          lotteryNumber.toString().endsWith(inputNumber)
        )
      );

      return hasAllNumbers || startsWithNumber || endsWithNumber;
    });
  }
  
  
  
  
  
  addToCart(result: any) {
    this.cartService.addToCart(result);
    console.log("เพิ่มสลากลงตะกร้า ", result);
  
    // สร้างข้อมูลสลากที่ถูกเพิ่มลงในตะกร้า
    const lotteryInfo = ` : ${result.ticket_number} ราคา : ${result.price} บาท ชุดที่ : ${result.set_number} งวดที่ : ${result.period}`;
  
    // ตั้งค่าคอนฟิกของ snackBar
    const config = new MatSnackBarConfig();
    config.duration = 5000; // ระยะเวลาที่ snackBar แสดง (ms)
    config.panelClass = ['custom-snackbar']; // คลาส CSS สำหรับ snackBar
  
    // แสดง snackBar ด้วยข้อมูลสลากที่ถูกเพิ่มลงในตะกร้า
    this.snackBar.open(`หมายเลขสลาก\n${lotteryInfo}ถูกเพิ่มเข้าไปยังตะกร้า`, '', config);
  }
  
  getCartBadgeCount(result: any): number {
    // นี่คือตำแหน่งในตะกร้าของคุณที่ต้องการคำนวณจำนวนสลาก
    // ในที่นี้ฉันใช้เลขสุ่มเป็นตัวอย่างเท่านั้น
    return Math.floor(Math.random() * 10); // เปลี่ยนเป็นตำแหน่งจริงในตะกร้าของคุณ
  }
  
  checkout() {
    // Calculate the total price of selected lotteries
    const totalPrice = this.selectedLotteries.reduce(
      (total, lottery) => total + lottery.price,
      0
    );

    // For demonstration, show an alert with the total price
    alert(`Total Price: ${totalPrice} THB`);

    // Clear the selected lotteries and reset the cart
    this.selectedLotteries = [];
    this.cartService.clearCart();
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