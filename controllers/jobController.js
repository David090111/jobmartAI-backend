const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const { title, description, location, salary,company, category, email, requirements } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      category,
      company,
      requirements,
      email,
      owner: req.user._id,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error(" Create job failed:", err);
    res.status(500).json({ message: "Failed to create job" });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { search = "", category, location, minSalary } = req.query;

    const filter = {};
    const trimmedSearch = search.trim();

   
    if (trimmedSearch.length > 0) {
      const regex = new RegExp(trimmedSearch, "i");
      filter.$or = [
        { title: { $regex: regex } },
        { company: { $regex: regex } },
        { location: { $regex: regex } },
        { category: { $regex: regex } },
      ];
    }

    if (category) filter.category = category;
    if (location) filter.location = location;
    if (minSalary) filter.salary = { $gte: parseFloat(minSalary) };

   

    const jobs = await Job.find(filter).populate("owner", "name email");
    res.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getJobById = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('owner', 'name email');
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
}

exports.updateJob = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    if (job.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to update this job" });
    }
    const {
      title,
      description,
      location,
      salary,
      company,
      category,
      email,
      requirements,
    } = req.body;
    job.title = title || job.title;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.category = category || job.category;
    job.company = company || job.company;
    job.requirements = requirements || job.requirements;
    job.email = email || job.email;
    const updatedJob = await job.save();
    res.json(updatedJob);
}
exports.deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ message: "Job not found" });
    }
    if (job.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to delete this job" });
    }
    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
}
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ owner: req.user._id });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Failed to get my jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
}