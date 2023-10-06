import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LotteryService } from 'src/app/services/lottery.service';

@Component({
  selector: 'app-admin-add',
  templateUrl: './admin-add.component.html',
  styleUrls: ['./admin-add.component.css']
})
export class AdminAddComponent {
  constructor(
    private LotteryService: LotteryService,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AdminAddComponent>,
    private snackBar: MatSnackBar, 
    @Inject(MAT_DIALOG_DATA) public lottery: any
) {
    // this.lotteriesByNumber = LotteryService.lotteriesByNumber;
}


  addNew(ticket_number: string, price: string, period: string, set_number: number, quantity: number) {
    let jsonObj = {
      ticket_number: ticket_number,
      price: parseFloat(price),
      period: period,
      set_number: set_number,
      quantity:quantity
    }
    let jsonString = JSON.stringify(jsonObj);
    console.log(jsonObj);
    this.http.post(this.LotteryService.apiEndpoint + "/lottery/add", jsonString, { observe: 'response' }).subscribe((response) => {
      console.log(JSON.stringify(response.status));
      console.log(JSON.stringify(response.body));
  
      // เรียกใช้ MatSnackbar เพื่อแสดง Snackbar
   const   snackBarRef= this.snackBar.open('ข้อมูลถูกเพิ่มเรียบร้อยแล้ว', 'ปิด', {
        duration: 2000, // ระยะเวลาที่ Snackbar จะแสดง (มีหน่วยเป็นมิลลิวินาที)
      });
       snackBarRef.afterDismissed().subscribe(() => {
    
    console.log('Snackbar ถูกปิดลง');
          window.location.reload();
  });
      this.dialogRef.close();
    });
  }
}
