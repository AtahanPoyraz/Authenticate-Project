import axios from "axios";
import React, { useState } from 'react';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [new_password, setNew_Password] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = {
          email: email,
          new_password: new_password
        };
        axios.post('http://127.0.0.1:8000/user-api/resetpass/', formData)
      .then(response => {
        console.log('Sifre başariyla kaydedildi:', response.data);
        
      })
      .catch(error => {
        console.error('Islem sirasinda bir hata oluştu:', error);
      });
    }
    return (
    <div>
        <h1>Şifre Sifirlama</h1>
        <form onSubmit={handleSubmit}>

        <label>E-posta: </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div>
          <label>Yeni Şifre: </label>
          <input type="password" value={new_password} onChange={(e) => setNew_Password(e.target.value)} />
        </div>
        <button type="submit">Kaydet</button>
      </form>
    </div>

    );

}

export default ResetPassword