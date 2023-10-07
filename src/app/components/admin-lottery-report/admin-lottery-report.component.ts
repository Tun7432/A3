import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Purchase } from 'src/app/model/purchase.model';
import { CartService } from 'src/app/services/cart.service';
import { LotteryService } from 'src/app/services/lottery.service';
@Component({
  selector: 'app-admin-lottery-report',
  templateUrl: './admin-lottery-report.component.html',
  styleUrls: ['./admin-lottery-report.component.css']
})
export class AdminLotteryReportComponent {
  displayedColumns: string[] = ['date', 'name', 'lottery', 'amount', 'price'];
  dataSource = new MatTableDataSource<Purchase>([]);
  // รายการตัวเลือก "ประจำวัน"
  //days: string[] = ['วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์', 'วันอาทิตย์'];

  // รายการตัวเลือก "ประจำเดือน"
  months: string[] = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

  // ตัวแปรสำหรับเก็บค่าที่เลือก
  selectedDay: string="";
  selectedMonth: string='';

  allLResults: any;
  selectedDate: Date | null = null;
  selectedYear: number = new Date().getFullYear();



  constructor(private cartService: CartService, private router: Router,
    private snackBar: MatSnackBar,
        private http: HttpClient,
public data: LotteryService,
    private dialog: MatDialog) {
    
this.http.get(this.data.apiEndpoint + "/purchase" ).subscribe(
      (response) => {
        //console.log("สถานะการอัปเดตข้อมูล: " + response);
 // console.log("ผลการอัปเดตข้อมูล: " + JSON.stringify(response));
this.allLResults = response;
this.dataSource.data = this.allLResults;

         console.log(this.dataSource.data);
         
      },
      (error) => {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล: " + JSON.stringify(error));
      }
    );



    //const mockData: PurchaseComponent[] = [
      // { date: new Date(), name: 'John Doe', lottery: '12345', amount: 100, price: 500 },
      // { date: new Date(), name: 'Jane Smith', lottery: '67890', amount: 200, price: 800 },
   // ];
   // this.dataSource.data = mockData;
  }


 filterData() {
  if (this.selectedDate) {
    // ใช้ this.selectedDate เพื่อกรองข้อมูลการซื้อ
    this.dataSource.data = this.allLResults.filter((purchase: Purchase) => {
      // แปลง created_at จาก string เป็น Date
      const purchaseDate = new Date(purchase.created_at);
      // เปรียบเทียบแค่วันที่โดยใช้ toDateString()
      return purchaseDate.toDateString() === this.selectedDate!.toDateString();
    });
  } else {
    // ถ้า this.selectedDate เป็นค่าว่าง ให้แสดงข้อมูลการซื้อทั้งหมด
    this.dataSource.data = this.allLResults;
  }
}

filterDataByMonthYear() {
  if (this.selectedMonth && this.selectedYear) {
    // ใช้ this.selectedMonth และ this.selectedYear เพื่อกรองข้อมูลการซื้อ
    this.dataSource.data = this.allLResults.filter((purchase: Purchase) => {
      // แปลง created_at จาก string เป็น Date
      const purchaseDate = new Date(purchase.created_at);
      // เปรียบเทียบเดือนและปี
      return (
        purchaseDate.getMonth() === this.months.indexOf(this.selectedMonth) &&
        purchaseDate.getFullYear() === this.selectedYear
      );
    });
  } else {
    // ถ้าเดือนหรือปีไม่ถูกเลือก ให้แสดงข้อมูลการซื้อทั้งหมด
    this.dataSource.data = this.allLResults;
  }
}
  
  
}




