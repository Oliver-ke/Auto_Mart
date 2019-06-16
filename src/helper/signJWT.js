import jwt from 'jsonwebtoken';

export default async (userData) => {
  const payload = { id: userData.id, email: userData.email, isAdmin: userData.is_admin };
  try {
    const token = await jwt.sign(payload, process.env.JWT_SECRET);
    const user = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      id: userData.id,
      email: userData.email,
      token,
    };
    return { error: null, user };
  } catch (err) {
    return { error: err, user: null };
  }
};
