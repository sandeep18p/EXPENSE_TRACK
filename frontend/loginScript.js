const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  document.getElementById('emailError').textContent = '';
  document.getElementById('passwordError').textContent = '';

  let isValid = true;

  if (!email) {
    document.getElementById('emailError').textContent = 'Email is required.';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    document.getElementById('emailError').textContent = 'Enter a valid email address.';
    isValid = false;
  }

  if (!password) {
    document.getElementById('passwordError').textContent = 'Password is required.';
    isValid = false;
  }

  if (isValid) {
    try {
      const response = await axios.post('http://localhost:3000/user/login', { email, password });
      console.log(response.headers)
      const token = response.headers['authorization'] || response.headers['Authorization'];
      if (token) {
        const authToken = token.split(' ')[1];
        console.log(authToken)
        localStorage.setItem('authToken', authToken);
         
        alert(response.data.message);

        window.location.href = 'loginExpense.html';
      } else {
        alert('Authorization token not found.');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'An error occurred. Please try again.');
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  }
});

document.getElementById('forgot-password-button').addEventListener('click', function() {
  document.getElementById('forgot-password-form').style.display = 'block';
});

document.getElementById('forgot-password-form-inner').addEventListener('submit', async function(event) {
  event.preventDefault();
  const email = document.getElementById('forgot-email').value;

  try {
    const response = await axios.post('http://localhost:3000/user/reset/password/forgotpassword',
     { email });
    alert(response.data.message);
  } catch (error) {
    console.error('Error:', error);
    alert('Error sending password reset email');
  }
});
