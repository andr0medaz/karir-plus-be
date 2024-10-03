import EmployeeNIK from "../models/EmployeeNIK.js";
import EmployeeDetails from "../models/EmployeeDetails.js";
import UserLogin from "../models/UserLogin.js";
import { Op } from "sequelize";

// untuk login
// Simple login API endpoint
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await UserLogin.findOne({ where: { username } });

    if (user) {
      if (user.password === password) {
        res.status(200).json({ message: "Login successful", user });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    // Masukkan data NIK ke tabel EmployeeNIK
    const nikEntry = await EmployeeNIK.create({ nik: req.body.nik });

    // Masukkan data detail ke tabel EmployeeDetails dengan referensi ke NIK
    const detailEntry = await EmployeeDetails.create({
      nik: nikEntry.nik,
      name: req.body.name,
      tanggal_masuk: req.body.tanggal_masuk,
      pangkat: req.body.pangkat,
      jabatan: req.body.jabatan,
      academic_background: req.body.academic_background,
      nomor_telepon: req.body.nomor_telepon,
    });

    res.status(201).json({
      msg: "Data successfully added",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error adding employee data" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { nik } = req.params;
    const updateData = req.body;

    // Update detail employee di tabel EmployeeDetails
    await EmployeeDetails.update(updateData, {
      where: { nik },
    });

    res.status(200).json({ message: "Employee data updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error updating employee" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { nik } = req.params;

    // Hapus data dari EmployeeDetails
    await EmployeeDetails.destroy({
      where: { nik },
    });

    // Hapus data dari EmployeeNIK
    await EmployeeNIK.destroy({
      where: { nik },
    });

    res.status(200).json({ msg: "Successfully deleted data" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting employee data" });
  }
};


export const getUsersV2 = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;

  try {
    const totalRows = await EmployeeDetails.count({
      where: {
        [Op.or]: [{ nik: { [Op.like]: `%${search}%` } }, { name: { [Op.like]: `%${search}%` } }],
      },
    });

    const totalPage = Math.ceil(totalRows / limit);

    // Ambil data dari EmployeeDetails dan join dengan EmployeeNIK
    const result = await EmployeeDetails.findAll({
      where: {
        [Op.or]: [{ nik: { [Op.like]: `%${search}%` } }, { name: { [Op.like]: `%${search}%` } }],
      },
      offset,
      limit,
      include: [{ model: EmployeeNIK }], // Menggunakan model tanpa alias
      order: [["nik", "ASC"]],
    });

    const processedResults = result.map((employeeData) => {
      const { tanggal_masuk } = employeeData;
      const tanggalMasukDate = new Date(tanggal_masuk);
      const today = new Date();

      const yearsOfService = Math.floor((today - tanggalMasukDate) / (1000 * 60 * 60 * 24 * 365.25));
      const nextPromotionDate = new Date(tanggalMasukDate);
      nextPromotionDate.setFullYear(tanggalMasukDate.getFullYear() + (Math.floor(yearsOfService / 4) + 1) * 4);

      const formattedNextPromotionDate = nextPromotionDate.toISOString().split("T")[0];
      const daysToNextPromotion = Math.ceil((nextPromotionDate - today) / (1000 * 60 * 60 * 24));

      return {
        ...employeeData.toJSON(),
        nextPromotionDate: formattedNextPromotionDate,
        daysToNextPromotion,
      };
    });

    res.json({
      result: processedResults,
      page,
      limit,
      totalRows,
      totalPage,
    });
  } catch (error) {
    console.error("Error in getUsersV2:", error.message);
    res.status(500).json({ message: "Error fetching employee data" });
  }
};
