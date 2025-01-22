const form = document.getElementById('signupForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  document.getElementById('nameError').textContent = '';
  document.getElementById('emailError').textContent = '';
  document.getElementById('passwordError').textContent = '';

  let isValid = true;

  // Validate name
  if (!name) {
    document.getElementById('nameError').textContent = 'Name is required.';
    isValid = false;
  }

  // Validate email
  if (!email) {
    document.getElementById('emailError').textContent = 'Email is required.';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    document.getElementById('emailError').textContent = 'Enter a valid email address.';
    isValid = false;
  }

  // Validate password
  if (!password) {
    document.getElementById('passwordError').textContent = 'Password is required.';
    isValid = false;
  } else if (password.length < 6) {
    document.getElementById('passwordError').textContent = 'Password must be at least 6 characters long.';
    isValid = false;
  }

  if (isValid) {
    try {
      const response = await axios.post('http://localhost:3000/user/signup', { name, email, password });
      console.log("User signed up successfully");
      alert(response.data.message);
      
      // Redirect to login page after successful signup
      window.location.href = 'login.html';
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'An error occurred. Please try again.');
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  }
});
