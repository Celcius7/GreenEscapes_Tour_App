import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    console.log('Entered updateSettings');
    const url =
      type === 'password'
        ? 'http://localhost:8080/api/v1/users/updateMyPassword'
        : 'http://localhost:8080/api/v1/users/updateMe';
    console.log('url ', url);
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated Successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
