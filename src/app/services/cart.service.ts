import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Lottery } from '../model/Lottery.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: Lottery[] = [];
  private itemsSubject = new BehaviorSubject<Lottery[]>([]);
  Usersid: any;

  constructor() {}
  
  getItems(): Observable<Lottery[]> {
    return this.itemsSubject.asObservable();
  }

  addToCart(lottery: Lottery) {
    const existingLottery = this.items.find((item) => 
      item.ticket_number === lottery.ticket_number &&
      item.set_number === lottery.set_number &&
      item.period === lottery.period
    );
  
    if (existingLottery) {
      if (existingLottery.quantity !== undefined) {
        existingLottery.quantity += 1;
      } else {
        existingLottery.quantity = 1;
      }
    } else {
      lottery.quantity = 1;
      this.items.push(lottery);
    }
  
    this.itemsSubject.next(this.items);
  }
  
  // removeFromCart(lottery: Lottery) {
  //   const index = this.items.indexOf(lottery);
  //   if (index !== -1) {
  //     const existingLottery = this.items[index];
  //     if (existingLottery.quantity !== undefined && existingLottery.quantity > 1) {
  //       existingLottery.quantity -= 1;
  //     } else {
  //       this.items.splice(index, 1);
  //     }
  //     this.itemsSubject.next(this.items);
  //   }
  // }

clearSpecificLottery(lottery: Lottery) {
  const index = this.items.indexOf(lottery);
  if (index !== -1) {
    this.items.splice(index, 1);
    this.itemsSubject.next(this.items);
  }
}



  clearCart() {
    this.items = [];
    this.itemsSubject.next(this.items); // อัปเดตข้อมูล
  }
}
