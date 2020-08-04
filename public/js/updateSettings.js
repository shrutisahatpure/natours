//update data
/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

//type is eithefr pwd or data
export const updateSettings = async (data, type) => {
  console.log(type);
  try {
    const url =
     type == 'password'
     ? 'http://127.0.0.2:3000/api/v1/users/updateMyPassword'
     : 'http://127.0.0.2:3000/api/v1/users/updateMe'
    
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Data Updated successfully!`);
    
    }
  } catch (err) {
    console.log(err.response.data);
    showAlert('error', err.response.data.message);
  }
};