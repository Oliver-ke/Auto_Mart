import jwt from 'jsonwebtoken';

export default async (userData) => {
  const payload = { id: Number(userData.id), email: userData.email, is_admin: userData.is_admin };
  try {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
    const user = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      id: Number(userData.id),
      email: userData.email,
      is_admin: userData.is_admin,
      token,
    };
    return { error: null, user };
  } catch (err) {
    return { error: err, user: null };
  }
};
