import * as unitService from '../../services/program/unit.service.js';

export const getAllUnits = async (req, res) => {
  try {
    const units = await unitService.getAllUnits();
    res.json(units);
  } catch (error) {
    console.error('❌ getAllUnits error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUnitByPublicId = async (req, res) => {
  try {
    const userId = req?.user?.id ;
    const unit = await unitService.getUnitByPublicId(req.params.publicId,userId);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });
    res.json(unit);
  } catch (error) {
    console.error('❌ getUnitByPublicId error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUnitsByProgramPublicId = async (req, res) => {
  try {
    const { programPublicId } = req.params;
    const units = await unitService.getUnitsByProgramPublicId(programPublicId);
    res.json(units);
  } catch (error) {
    console.error('❌ getUnitsByProgramPublicId error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUnit = async (req, res) => {
  const { publicUnitId } = req.params;
  const { name, description, order_index } = req.body;

  try {
    const updated = await unitService.updateUnit(publicUnitId, {
      name,
      description,
      order_index: Number(order_index) || 0,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    res.json({ message: 'Unit updated successfully' });
  } catch (err) {
    console.error('Error updating unit:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const createUnit = async (req, res) => {
  try {
    const { program_public_id, name, description, order_index } = req.body;

    if (!program_public_id || !name) {
      return res.status(400).json({ message: 'program_public_id và name là bắt buộc' });
    }

    const newUnit = await unitService.createUnit({
      program_public_id,
      name,
      description,
      order_index: order_index || 0,
    });

    return res.status(201).json(newUnit);
  } catch (err) {
    console.error('Error creating unit:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteUnit = async (req, res) => {
  try {
    const { publicUnitId } = req.params;
    await unitService.deleteUnit(publicUnitId);
    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (error) {
    console.error('Error deleting unit:', error);
    res.status(500).json({ message: 'Failed to delete unit' });
  }
};
