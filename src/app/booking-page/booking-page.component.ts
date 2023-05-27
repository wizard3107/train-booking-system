import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BookingSystemService } from '../booking-system.service';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
})
export class BookingPageComponent implements OnInit, OnChanges {
  constructor(private bookingSystemService: BookingSystemService) {}
  isLoading: boolean = false;
  seats: any = {};
  rows = Object.keys(this.seats);
  obj = { no: 1, status: true };
  detailsForm: FormGroup = new FormGroup({
    username: new FormControl(null),
    email: new FormControl(null),
    mobile: new FormControl(null),
    ticket: new FormControl(null),
  });
  usernameError = false;
  mobileError = false;
  emailError = false;
  ticketsError = false;
  ticketsSelected: any = [];
  disableSelection: boolean = true;
  userName: string = '';
  email: string = '';
  mobile: string = '';
  tickets: any = 0;
  userTickets: any = [];
  maxTicketCount: Number = 7;
  ngOnInit(): void {
    this.initSeats();
    this.getSeats();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  initSeats() {
    const maxSeats = 80; // Total Seats
    const rows = 12; // Number of rows
    const seatsPerRow = 7; // Number of seats per row
    const alphabets = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
    ];
    let totalSeats = 0;
    for (let i = 0; i < rows; i++) {
      const row = alphabets[i];
      this.seats[row] = [];

      for (let j = 1; j <= seatsPerRow; j++) {
        if (totalSeats === maxSeats) {
          break;
        } else {
          this.seats[row].push({
            row: row,
            seat: j,
            status: false,
            reserved: false,
          });
          totalSeats++;
        }
      }
    }
  }

  onSeatSelect(row: string, seat: any) {
    const selectedTickets = +this.detailsForm.controls['ticket'].value;
    if (selectedTickets) {
      if (this.seats[row][seat - 1].status) {
        this.seats[row][seat - 1].status = false;
        this.ticketsSelected = this.ticketsSelected.filter(
          (ticket: any) => !(ticket.row === row && ticket.seat === seat)
        );
        this.disableSelection = false;
      } else if (
        this.ticketsSelected.length <= this.maxTicketCount &&
        (!selectedTickets || this.ticketsSelected.length < selectedTickets)
      ) {
        this.seats[row][seat - 1].status = true;
        this.ticketsSelected.push({ row, ...this.seats[row][seat - 1] });
        this.tickets = this.ticketsSelected.length;
        this.disableSelection =
          this.ticketsSelected.length === this.maxTicketCount ||
          this.ticketsSelected.length === selectedTickets;
        console.log(this.disableSelection);
      }
    } else {
      alert('please select the no. of tickets');
    }
  }
  checkValidation() {
    this.usernameError = !this.detailsForm.controls['username'].value;
    this.emailError = !this.detailsForm.controls['email'].value;
    this.mobileError = !this.detailsForm.controls['mobile'].value;
    this.ticketsError = !this.detailsForm.controls['username'].value;
    return (
      this.usernameError ||
      this.emailError ||
      this.mobileError ||
      this.ticketsError
    );
  }
  onConfirmBooking() {
    const tickets = +this.detailsForm.controls['ticket'].value;
    let payload = {
      username: this.detailsForm.controls['username'].value,
      email: this.detailsForm.controls['email'].value,
      mobile: this.detailsForm.controls['mobile'].value,
      tickets: tickets,
      selectedSeats: [],
    };
    if (this.ticketsSelected.length <= tickets) {
      const ticketsToBook = tickets - this.ticketsSelected.length;
      console.log(this.reserveSeats(ticketsToBook));

      const seats: any = [
        ...this.ticketsSelected,
        ...this.reserveSeats(ticketsToBook),
      ];
      payload['tickets'] = tickets;
      payload['selectedSeats'] = seats;
    }
    if (!this.checkValidation()) this.bookSeats(payload);
  }
  reserveSeats(ticketsToReserve: any) {
    const rows = Object.keys(this.seats);
    let selectedRow = null;

    // Find a row with consecutive seats
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const availableSeats = this.seats[row].filter(
        (seat: any) => !seat.status && !seat.reserved
      );

      if (availableSeats.length >= ticketsToReserve) {
        selectedRow = row;
        break;
      }
    }

    // If no row has enough consecutive seats, find nearest available seats
    if (!selectedRow) {
      const seatsCount = Object.values(this.seats).reduce(
        (count, rowSeats: any) => count + rowSeats.length,
        0
      );
      const availableSeats: any = Object.values(this.seats).reduce(
        (seatsArr: any, rowSeats: any) =>
          seatsArr.concat(
            rowSeats.filter((seat: any) => !seat.status && !seat.reserved)
          ),
        []
      );
      const nearestSeats = [];

      for (let i = 0; i < ticketsToReserve; i++) {
        if (i >= availableSeats.length) {
          break;
        }
        nearestSeats.push(availableSeats[i]);
      }

      return nearestSeats;
    }

    // Allot consecutive seats in the selected row
    const allottedSeats = this.seats[selectedRow]
      .filter((seat: any) => !seat.status && !seat.reserved)
      .slice(0, ticketsToReserve);

    return allottedSeats;
  }
  getSeats() {
    this.isLoading = true;
    this.bookingSystemService.getSeats().subscribe((res) => {
      this.reservedSeats(res);
      this.ticketsSelected = [];
      this.isLoading = false;
    });
    this.rows = Object.keys(this.seats);
  }
  bookSeats(payload: any) {
    this.bookingSystemService.bookSeats(payload).subscribe((res) => {
      this.getSeats();
    });
  }

  getMyTickets() {
    if (this.detailsForm.controls['username'].value) {
      const payload = {
        username: this.detailsForm.controls['username'].value,
        email: this.detailsForm.controls['email'].value,
        mobile: this.detailsForm.controls['mobile'].value,
      };
      this.bookingSystemService.userSeats(payload).subscribe((res) => {
        this.userTickets = res;
      });
    } else {
      alert('please enter username');
    }
  }
  enableSelection() {
    this.disableSelection = !this.detailsForm.controls['ticket'].value;
    if (this.disableSelection) {
      this.ticketsSelected.forEach((ele: any) => {
        this.seats[ele.row][ele.seat - 1].status = false;
      });
      this.ticketsSelected = [];
      console.log(this.ticketsSelected);
    }
  }
  unreserveSeats() {
    let username = this.detailsForm.controls['username'].value;
    if (username) {
      const payload = { username: username };
      this.bookingSystemService.unreserveSeats(payload).subscribe((res) => {
        alert(res.message);
        this.getSeats();
      });
    } else {
      this.usernameError = true;
    }
  }
  reservedSeats(seat: any) {
    this.rows.forEach((element: any) => {
      this.seats[element].forEach((ele: any) => {
        const row = ele.row;
        const seatNumber = ele.seat;
        const isReserved = seat.some(
          (reservedSeat: any) =>
            reservedSeat.row === row && reservedSeat.seat === seatNumber
        );
        isReserved ? (ele.reserved = true) : (ele.reserved = false);
      });
    });
  }
}
