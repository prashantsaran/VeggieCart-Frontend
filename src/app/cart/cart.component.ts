import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { Cart } from '../interface/Cart';
import { register } from '../interface/register';
import { Router } from '@angular/router';
declare var Razorpay: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  constructor(private service: DataService, private router: Router) { }
  profile: register = {
    email: '',
    password: '',
    otp: 0,
    name: '',
    address: ''
  }
  success: number = 0;
  items: Cart[] = [];
  emptyCart: boolean = false;
  numberOfItems: number = 0;
  totalCost: number = 0;
  ngOnInit(): void {
    console.log("inside init");
    if (this.service.verify == false)
      this.router.navigate(['home']);
    this.service.getProfile().subscribe((data: any) => {
      if (data.status == 200)
        this.profile = data.body;
    })
    this.service.getCart().subscribe((data: any) => {
      if (data.status == 200 && data.body) {
        const problem: Cart[] = data.body;
        this.items = problem;
        console.log(this.items);
        this.total();
      }
      else if (data.status == 204 && data.body == null)
        this.emptyCart = true;
    })
  }
  total() {
    this.totalCost = 0;
    this.numberOfItems = 0;
    for (const cost of this.items) {
      this.totalCost += cost.price
      this.numberOfItems++;
    }
    this.totalCost += 100;
    return this.totalCost;
  }
  deleteItem(item: Cart) {
    this.service.deleteCartItem(item).subscribe(
      (data: any) => {
        data.status
        console.log("Inside delete success");
        // Refresh the cart after a successful delete
      },
      (error: any) => {
        this.refreshCart();

        // Handle the error here, if necessary.
        // You can also update the cart or display an error message to the user.
      }
    );
  }
  refreshCart() {
    // Call the getCart method to fetch the updated cart data
    this.service.getCart().subscribe(
      (data: any) => {
        if (data.status === 200 && data.body) {
          const cartItems: Cart[] = data.body;
          this.items = cartItems;
          // Call any other methods or perform actions needed after refreshing the cart
          this.total();
        } else if (data.status === 204 && data.body === null) {
          this.emptyCart = true;
        }
      },
      (error: any) => {
        console.error("Error refreshing cart:", error);

      }
    );
  }
  payNow() {
    const RozarpayOptions = {
      description: 'Sample Razorpay demo',
      currency: 'INR',
      amount: this.totalCost * 100,
      name: this.profile.name,
      key: 'rzp_test_tt6dvqmNZq4x73',
      image: '../assets/logo.png',
      prefill: {
        name: this.profile.name,
        email: this.profile.email,
        phone: '123456789'
      },
      theme: {
        color: '#6466e3'
      },
      modal: {
        ondismiss: () => {
          console.log('dismissed')
        }
      }
    }

    const successCallback = (paymentid: any) => {
      console.log(paymentid);


    }

    const failureCallback = (e: any) => {
      console.log(e);
    }

    Razorpay.open(RozarpayOptions, successCallback, failureCallback)



  }
}
