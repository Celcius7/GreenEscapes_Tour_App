import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51NY8MZSFwCNqqR2BxZb5OtG23XoQk9bbiBmCuyYXrN3p2CQCcMPYfOMU9ztyfmWbrcVo0RAEJzQb0Nugqvi4kK4u00GQPdLUqS'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://localhost:8080/api/v1/bookings/checkout-session/${tourId}`
    );
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
