import mongoose from 'mongoose'

const Tenant = new mongoose.Schema({
  company_name: {
    type: String,
    unique: true,
  },
  db_name: {
    type: String,
    unique: true,
  },
  db_password: {
    type: String,
  },
})

export default Tenant