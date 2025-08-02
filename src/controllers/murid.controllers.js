import Murid from "../models/murid.model.js";

export const getAllMurid = async (req, res) => {
  try {
    const murid = await Murid.find();
    res.status(200).json(murid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMurid = async (req, res) => {
  try {
    const { nis, nama, kelas, email } = req.body;
    const murid = new Murid({ nis, nama, kelas, email });
    await murid.save();
    res.status(201).json(murid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMurid = async (req, res) => {
  try {
    const muridId = req.params.id;
    const { nis, nama, kelas, email } = req.body;
    const murid = await Murid.findByIdAndUpdate(muridId, { nis, nama, kelas, email }, { new: true });
    if (!murid) {
      return res.status(404).json({ message: "Murid not found" });
    }
    res.status(200).json(murid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMurid = async (req, res) => {
  try {
    const id = req.params.id;
    await Murid.findByIdAndDelete(id);
    res.status(200).json({ message: "Murid deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
