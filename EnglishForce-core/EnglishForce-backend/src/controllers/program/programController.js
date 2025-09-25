import * as programService from '../../services/program/program.service.js';



export const getPaginatedPrograms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = await programService.getPaginatedPrograms(page);
    res.json(result);
  } catch (err) {
    console.error('Error fetching programs:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllProgramsWithStatus = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const result = await programService.getAllProgramsWithProgressStatus(userId);
    res.json(result);
  } catch (err) {
    console.error('Error fetching programs:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProgramDetail = async (req, res) => {
  try {
    const { public_id } = req.params;
    const program = await programService.getProgramByPublicId(public_id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.json(program);
  } catch (err) {
    console.error('Error fetching program detail:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getProgramDetailWithProgress = async (req, res) => {
  try {
    const userId = req.user.id; 
    const programPublicId = req.params.public_id;

    const programDetail = await programService.getProgramWithProgress(programPublicId, userId);
    if (!programDetail) {
      return res.status(404).json({ message: 'Program not found' });
    }

    return res.json(programDetail);
  } catch (error) {
    console.error('❌ Error in getProgramDetail:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteProgramByPublicId = async (req, res) => {
  const { publicId } = req.params;
  try {
    await programService.deleteByPublicId(publicId);
    res.status(200).json({ message: 'Program deleted successfully.' });
  } catch (err) {
    console.error('Error deleting program:', err);
    res.status(500).json({ message: 'Failed to delete program.' });
  }
};



export const createProgram = async (req, res) => {
  try {
    const { name, description, order_index } = req.body;
    const thumbnail = req.file?.path || null;

    const program = await programService.createProgramService({
      name,
      description,
      order_index: parseInt(order_index) || 0,
      thumbnail,
    });

    res.status(201).json({
      message: '✅ Program created successfully',
      program,
    });
  } catch (error) {
    console.error('❌ Failed to create program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const updateProgram = async (req, res) => {
  try {
    const { public_id } = req.params;
    const { name, description, order_index } = req.body;

    const isUpload = !!req.file;
    const thumbnail = isUpload ? req.file?.path : req.body.thumbnail || null;

    const updatedProgram = await programService.updateProgramByPublicId(public_id, {
      name,
      description,
      order_index: parseInt(order_index) || 0,
      thumbnail,
      isUpload,
    });

    if (!updatedProgram) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.status(200).json({
      message: '✅ Program updated successfully',
      program: updatedProgram
    });
  } catch (error) {
    console.error('❌ Failed to update program:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

