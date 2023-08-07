import React, {useState} from "react";
import axios from "axios";

const EmailSender = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('')
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        setToken(token)
    
        const formData = {
          email: email,
          token: token
        };
        axios.post('http://127.0.0.1:8000/user-api/sendmail/', formData)
      .then(response => {
        console.log('mail başariyla gonderildi:', response.data);
        
      })
      .catch(error => {
        console.error('Islem sirasinda bir hata oluştu:', error);
      });
    }

    return (
        <div>
        <form onSubmit={handleSubmit}>
        <p>Sifre Sifirlama</p>
        <label>E-posta:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <button type="submit">Gonder</button>
      </form>
    </div>
    );
}
export default EmailSender