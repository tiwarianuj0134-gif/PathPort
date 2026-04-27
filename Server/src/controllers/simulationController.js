const SimulationTask = require('../models/SimulationTask');
const EvidenceCard = require('../models/EvidenceCard');

/** GET /api/simulations — list public simulations */
const getSimulations = async (req, res, next) => {
  try {
    const { type, difficulty } = req.query;
    const filter = { isPublic: true };
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;

    const tasks = await SimulationTask.find(filter)
      .populate('createdBy', 'name avatarUrl')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

/** GET /api/simulations/:id */
const getSimulationById = async (req, res, next) => {
  try {
    const task = await SimulationTask.findById(req.params.id).populate('createdBy', 'name avatarUrl');
    if (!task) return res.status(404).json({ message: 'Simulation not found.' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

/** POST /api/simulations — admin/mentor creates simulation */
const createSimulation = async (req, res, next) => {
  try {
    const task = await SimulationTask.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

/** POST /api/simulations/:id/submit — student submits */
const submitSimulation = async (req, res, next) => {
  try {
    const { submissionUrl, notes } = req.body;
    const task = await SimulationTask.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Simulation not found.' });

    const alreadySubmitted = task.submissions.find(
      (s) => s.studentId.toString() === req.user._id.toString()
    );
    if (alreadySubmitted) return res.status(409).json({ message: 'Already submitted.' });

    // Auto-create an EvidenceCard for the submission
    const evidenceCard = await EvidenceCard.create({
      userId: req.user._id,
      title: `Simulation: ${task.title}`,
      type: 'simulation',
      description: `Completed the "${task.title}" simulation task.\n\n${notes || ''}`,
      skills: task.skills,
      links: [{ label: 'Submission', url: submissionUrl }],
    });

    task.submissions.push({
      studentId: req.user._id,
      submissionUrl,
      notes,
      evidenceCardId: evidenceCard._id,
    });
    await task.save();

    res.status(201).json({ message: 'Submitted! Evidence card created.', evidenceCard });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSimulations, getSimulationById, createSimulation, submitSimulation };
