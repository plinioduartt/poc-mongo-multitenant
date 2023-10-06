import mongoose from 'mongoose'

const User = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
})

export default User