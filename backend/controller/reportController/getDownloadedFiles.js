const DownloadedFiles = require('../../models/downloadedFiles');

const getDownloadedFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const files = await DownloadedFiles.findAll({
      where: { userId },
      attributes: ['id', 'fileURL', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    if (!files.length) {
      return res.status(404).json({ success: false, message: 'No files found' });
    }

    res.status(200).json({ success: true, files });
  } catch (error) {
    console.error('Error fetching downloaded files:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getDownloadedFiles,
};
