import * as examAttemptService from '../../services/exam/examAttempt.service.js';


export const getPaginatedAttempts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const result = await examAttemptService.getPaginatedAttempts(page);

    res.json(result);
  } catch (err) {
    console.error('Error fetching paginated exam attempts:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const getUserExamAttempts = async (req, res) => {
    try {
      const { publicId } = req.params;
      const userId = req?.user?.id;
      if(!userId || !publicId) return res.status(400).json({message: "Not found UserId or examPublicId"});
    
      const attempts = await examAttemptService.getExamAttemptByUserId(publicId, userId);
  
      res.json(attempts);
    } catch (err) {
      console.error('Error fetching user exam attempts:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };