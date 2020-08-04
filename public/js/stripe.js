/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51HBlq4IA4d7Y0sBUM5EpwKoAxbrSr95nnf9WCO7YldUwIJqaYh0P9R2hWtuKul1E6CGxabmu7TidaydaN2QQinuA00gyagZDeo');

export const bookTour = async tourId => {
  try {
   // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    //console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
