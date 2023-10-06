import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseComponent } from '../purchase/purchase.component';
@Component({
  selector: 'app-admin-lottery-report',
  templateUrl: './admin-lottery-report.component.html',
  styleUrls: ['./admin-lottery-report.component.css']
})
export class AdminLotteryReportComponent {
  displayedColumns: string[] = ['date', 'name', 'lottery', 'amount', 'price'];
  dataSource = new MatTableDataSource<PurchaseComponent>([]);
  // รายการตัวเลือก "ประจำวัน"
  days: string[] = ['วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์', 'วันอาทิตย์'];

  // รายการตัวเลือก "ประจำเดือน"
  months: string[] = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

  // ตัวแปรสำหรับเก็บค่าที่เลือก
  selectedDay: string="";
  selectedMonth: string='';
  constructor() {
    // สมมติข้อมูลจาก API หรือแหล่งข้อมูลอื่น ๆ
    const mockData: PurchaseComponent[] = [
      { date: new Date(), name: 'John Doe', lottery: '12345', amount: 100, price: 500 },
      { date: new Date(), name: 'Jane Smith', lottery: '67890', amount: 200, price: 800 },
    ];
    this.dataSource.data = mockData;
  }
}
