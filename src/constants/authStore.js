const users = [
  {
    fullName: 'Demo Student',
    university: 'Nairobi Medical College',
    registrationNumber: 'MED/2024/182',
    email: 'student@example.com',
    password: 'password123',
    role: 'Student'
  }
];

export const registerUser = ({ fullName, university, registrationNumber, email, password, role }) => {
  const existing = users.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  users.push({ fullName, university, registrationNumber, email, password, role });
  return { success: true };
};

export const authenticateUser = (email, password) => {
  const user = users.find(
    user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );
  return user || null;
};
