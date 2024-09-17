import employee from "../models/UserModel.js";
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
      // For simplicity, we are assuming passwords are stored as plain text
      // In a real application, use hashed passwords and compare hashed values
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
    await employee.create(req.body);
    res.status(201).json({
      msg: "Data successfully added",
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    // Access the body using req.body instead of a separate 'body' variable
    const { nik } = req.params;
    const updateData = req.body; // Destructure the body for readability

    // Perform the update using the id and update data
    await employee.update(updateData, {
      where: {
        nik, // Use destructured id from params
      },
    });

    res.status(200).json({ message: "Employee data updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error updating employee" }); // Provide more specific error message
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { nik } = req.params;
    await employee.destroy({
      where: {
        nik,
      },
    });
    res.status(200).json({ msg: "Successfully Delete Data" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: `Error delete employee data` });
  }
};

export const getUsersV2 = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;

  try {
    // Log the search query and pagination details
    console.log("Search Query:", search);
    console.log("Page:", page, "Limit:", limit, "Offset:", offset);

    // Check if search is working properly
    if (!search) {
      console.log("No search query provided.");
    }

    // Get total count of employees matching the search criteria
    const totalRows = await employee.count({
      where: {
        [Op.or]: [{ nik: { [Op.like]: `%${search}%` } }, { name: { [Op.like]: `%${search}%` } }],
      },
    });

    const totalPage = Math.ceil(totalRows / limit);

    // Fetch employees with pagination and search criteria
    const result = await employee.findAll({
      where: {
        [Op.or]: [{ nik: { [Op.like]: `%${search}%` } }, { name: { [Op.like]: `%${search}%` } }],
      },
      offset: offset,
      limit: limit,
      order: [["nik", "ASC"]],
    });

    // Log the result to check if employees are being found
    console.log("Result Count:", result.length);

    // Process promotion date calculation
    const processedResults = result.map((employeeData) => {
      const { tanggal_masuk } = employeeData;
      const tanggalMasukDate = new Date(tanggal_masuk);
      const today = new Date();

      // Calculate next promotion date every 4 years
      const yearsOfService = Math.floor((today - tanggalMasukDate) / (1000 * 60 * 60 * 24 * 365.25));
      const nextPromotionDate = new Date(tanggalMasukDate);
      nextPromotionDate.setFullYear(tanggalMasukDate.getFullYear() + (Math.floor(yearsOfService / 4) + 1) * 4);

      // Format the date as YYYY-MM-DD
      const formattedNextPromotionDate = nextPromotionDate.toISOString().split("T")[0];

      // Calculate days to the next promotion
      const daysToNextPromotion = Math.ceil((nextPromotionDate - today) / (1000 * 60 * 60 * 24));

      return {
        ...employeeData.toJSON(),
        nextPromotionDate: formattedNextPromotionDate,
        daysToNextPromotion,
      };
    });

    // Send processed results and pagination details
    res.json({
      result: processedResults,
      page,
      limit,
      totalRows,
      totalPage,
    });
  } catch (error) {
    console.error("Error in getUsersV2:", error.message);
    res.status(500).json({ message: "Error occurred while fetching employee data." });
  }
};

