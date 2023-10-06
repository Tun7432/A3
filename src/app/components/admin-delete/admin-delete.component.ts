import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LotteryService } from 'src/app/services/lottery.service';

@Component({
  selector: 'app-admin-delete',
  templateUrl: './admin-delete.component.html',
  styleUrls: ['./admin-delete.component.css']
})
export class AdminDeleteComponent {

  constructor(
    public dialogRef: MatDialogRef<AdminDeleteComponent>,
    private data: LotteryService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public lottery: any
  ) { }

  onCancelClick(): void {
    this.dialogRef.close(false); // ปิด dialog และส่งค่า false กลับ
  }

  onDeleteClick(id:number): void {
    this.dialogRef.close(true); // ปิด dialog และส่งค่า true กลับ
   
    console.log(id);
   
    this.http.delete(this.data.apiEndpoint + "/lottery/" + id).subscribe(
      (response) => {
        console.log("สถานะการอัปเดตข้อมูล: " + response);
        console.log("ผลการอัปเดตข้อมูล: " + JSON.stringify(response));
        this.snackBar.open('ข้อมูลถูกลบเรียบร้อยแล้ว', 'ปิด', {
        duration: 2000, // ระยะเวลาที่ Snackbar จะแสดง (มีหน่วยเป็นมิลลิวินาที)
      });
  
      this.dialogRef.close();
      },
      (error) => {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล: " + JSON.stringify(error));
        // คุณสามารถแสดงข้อความผิดพลาดหรือดำเนินการเพิ่มเติมตามความเหมาะสมที่นี่
        this.snackBar.open('ไม่สามารถลบได้ เนื่องจาก ข้อมูลสลากนี้มีการซื้อขายอยู่', 'ปิด', {
          duration: 4000, // ระยะเวลาที่ Snackbar จะแสดง (มีหน่วยเป็นมิลลิวินาที)
        });
      }
    );
  }
}
