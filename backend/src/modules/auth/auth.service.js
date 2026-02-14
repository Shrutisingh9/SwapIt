const User = require("../../models/User");
const { hashPassword, verifyPassword } = require("../../core/auth/passwordHasher");
const { signAccessToken } = require("../../core/auth/jwtService");

class AuthService {
  async register(data) {
    const existing = await User.findOne({ email: data.email });

    if (existing) {
      const err = new Error("Email already in use");
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await hashPassword(data.password);

    const user = await User.create({
      email: data.email,
      passwordHash,
      name: data.name,
      gender: data.gender || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      phone: data.phone || null
    });

    const token = signAccessToken({ sub: user._id.toString(), email: user.email });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        location: user.location,
        rating: user.rating,
        ratingCount: user.ratingCount,
        swapPoints: user.swapPoints
      },
      token
    };
  }

  async login(data) {
    const user = await User.findOne({ email: data.email });

    if (!user) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const ok = await verifyPassword(data.password, user.passwordHash);
    if (!ok) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const token = signAccessToken({ sub: user._id.toString(), email: user.email });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        location: user.location,
        rating: user.rating,
        ratingCount: user.ratingCount,
        swapPoints: user.swapPoints
      },
      token
    };
  }
}

module.exports = AuthService;
