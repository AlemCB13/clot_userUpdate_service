const { updateUserDB } = require("../models/userModel");

class UpdateUserCommand {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  async execute() {
    return await updateUserDB(this.id, this.name, this.email, this.password);
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; const { name, email, password } = req.body;

if (!id || !name || !email || !password) {
  return res.status(400).json({ message: "All fields are required" });
}

const command = new UpdateUserCommand(id, name, email, password);
const result = await command.execute();

if (result.affectedRows === 0) {
  return res.status(404).json({ message: "User not found or no changes made" });
}

res.status(200).json({ message: "User updated successfully" });
} catch (error) { console.error(error); res.status(500).json({ message: "Error updating user" }); } };

module.exports = { updateUser };

