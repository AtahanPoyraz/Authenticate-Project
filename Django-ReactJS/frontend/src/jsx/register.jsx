import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name: name,
      email: email,
      password: password
    };

    // Axios ile Django backend'e POST isteği gönderiyoruz.
    axios.post('http://127.0.0.1:8000/user-api/register/', formData)
      .then(response => {
        console.log('Kullanici başariyla kaydedildi:', response.data);
        // Başarılı cevap durumunda, uygun şekilde işlem yapabilirsiniz.
      })
      .catch(error => {
        console.error('Kayit sirasinda bir hata oluştu:', error);
        // Hata durumunda, uygun şekilde hata mesajları gösterebilirsiniz.
      });
  };

  return (
    <div>
      <h1>Kullanici Oluştur</h1>
      <form onSubmit={handleSubmit}>
        <label>Kullanici Adi:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>E-posta:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Şifre:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
};

export default CreateUser;
