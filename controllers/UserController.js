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
      msg: "User Created Success",
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

    res.status(200).json({ message: "Employee updated successfully" });
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
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: `Error delete employee data` });
  }
};

export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const totalRows = await employee.count({
    where: {
      [Op.or]: [
        {
          nik: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });

  const totalPage = Math.ceil(totalRows / limit);
  const result = await employee.findAll({
    where: {
      [Op.or]: [
        {
          nik: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },

    offset: offset,
    limit: limit,
    order: [["nik", "ASC"]],
  });
  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};

export const validateWorkExperience = async (req, res) => {
  const { nik } = req.params; // Assuming NIK (employee ID) is in request params

  // Calculate the minimum required work start date (4 years ago)
  const fourYearsAgo = new Date();
  fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 4);

  try {
    const employeeData = await employee.findOne({
      where: {
        nik,
        tanggal_masuk: {
          [Op.lte]: fourYearsAgo, // Check if start date is less than or equal to 4 years ago
        },
      },
    });

    if (employeeData) {
      res.json({
        message: "Employee with NIK " + nik + " has been working for at least 4 years.",
        hasWorkedForFourYears: true,
      });
    } else {
      res.json({
        message: "Employee with NIK " + nik + " does not meet the 4-year work experience requirement.",
        hasWorkedForFourYears: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred while fetching employee data." });
  }
};

export const validateWorkExperienceTest2 = async (req, res) => {
  const { nik } = req.params;

  try {
    const employeeData = await employee.findOne({
      where: {
        nik,
      },
    });

    if (!employeeData) {
      return res.json({
        message: `Employee with NIK ${nik} not found.`,
        hasWorkedForFourYears: false,
      });
    }

    const { tanggal_masuk, name } = employeeData;

    // Calculate the exact date for the current 4-year period
    const currentFourYearsLater = new Date(tanggal_masuk);
    currentFourYearsLater.setFullYear(currentFourYearsLater.getFullYear() + 4);

    // Calculate the difference in milliseconds
    const timeDifference = currentFourYearsLater - new Date();

    // Convert milliseconds to days
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) {
      // Calculate the next 4-year period
      const nextPromotionDate = new Date(tanggal_masuk);
      nextPromotionDate.setFullYear(nextPromotionDate.getFullYear() + 8);

      // Format the date as a string
      const formattedNextPromotionDate = nextPromotionDate.toISOString();

      // Hitung hari sampai nextPromotionDate
      const daysToNextPromotion = Math.ceil((nextPromotionDate - new Date()) / (1000 * 60 * 60 * 24));

      return res.json({
        message: `Employee with NIK ${nik}: ${name} has been working for at least 4 years.`,
        hasWorkedForFourYears: true,
        nextPromotionDate: formattedNextPromotionDate,
        daysToNextPromotion: daysToNextPromotion,
      });
    } else {
      // Hitung tanggal estimasi selesainya 4 tahun masa kerja
      const estimatedCompletionDate = new Date();
      estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + daysLeft);

      // Format tanggal ke dalam format ISO 8601
      const formattedEstimatedCompletionDate = estimatedCompletionDate.toISOString();

      return res.json({
        message: `Employee with NIK ${nik} will complete 4 years of service in ${daysLeft} days.`,
        hasWorkedForFourYears: false,
        daysLeftToFourYears: daysLeft,
        estimatedCompletionDate: formattedEstimatedCompletionDate,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error occurred while fetching employee data." });
  }
};
