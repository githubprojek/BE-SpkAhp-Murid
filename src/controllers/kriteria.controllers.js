import Kriteria from "../models/kriteria.model.js";

export const getAllKriteria = async (req, res) => {
  try {
    const kriteria = await Kriteria.find();
    res.status(200).json(kriteria);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const addKriteria = async (req, res) => {
  try {
    const { nama, keterangan } = req.body;
    const kriteria = new Kriteria({ nama, keterangan });
    await kriteria.save();
    res.status(201).json(kriteria);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateKriteria = async (req, res) => {
  try {
    const { nama, keterangan } = req.body;
    const id = req.params.id;
    const kriteria = await Kriteria.findByIdAndUpdate(id, { nama, keterangan }, { new: true });
    res.status(200).json(kriteria);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const deleteKriteria = async (req, res) => {
  try {
    const id = req.params.id;
    await Kriteria.findByIdAndDelete(id);
    res.status(200).json({ message: "Kriteria deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
