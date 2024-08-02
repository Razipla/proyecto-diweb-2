const Room = require("../schema/RoomSchema");

const router = require("express").Router();

router.get('/', async (req, res) => {
  try {
    console.log('req.query', req.query);
    const { userIds } = req.query; // Get the userIds from the query parameters
    console.log('userIds', userIds)

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ error: 'Invalid userIds' });
    }

    const room = await Room.findOrCreateRoom(userIds);
    res.status(200).json(room);
  } catch (error) {
    console.error('Error finding or creating room:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
